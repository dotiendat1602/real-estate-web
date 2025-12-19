"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";
import {
  ConversationDataListItem,
  MessageItem,
  NewMessageEvent,
  MessageSentEvent,
} from "@/types/interfaces/api/chat";
import {
  useInfiniteMessages,
  useSendManagerReplyAsAgent,
} from "@/hooks/chat/useMessages";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { softUpdateConversationsCache } from "@/lib/utils";
import { useSocket } from "@/hooks/chat/useSocket";
import { useChatLayout } from "@/app/[locale]/admin/pages/chat/layout";

interface ChatWindowProps {
  conversation: ConversationDataListItem | null;
  currentUserId: number;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUserId,
}) => {
  const [messageInput, setMessageInput] = useState("");

  const { socket } = useChatLayout();
  const { isConnected, onNewMessage, onMessageSent } = socket;


  const queryClient = useQueryClient();

  const activeConversationIdRef = useRef<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  const isConnectedRef = useRef(false);
  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  const {
    data: messagesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMessages(conversation?.id || 0, 8);

  const sendMessageMutation = useSendManagerReplyAsAgent();

  // ---------------------------
  // Helpers: cache upsert message
  // ---------------------------
  const upsertMessageIntoInfiniteCache = React.useCallback(
    (conversationId: number, msg: MessageItem) => {
      queryClient.setQueryData(["messages-infinite", conversationId], (old: any) => {
        if (!old?.pages) {
          // Nếu chưa có cache (chưa fetch lần nào) thì thôi, để UI tự fetch
          return old;
        }

        const exists = old.pages.some((page: any) =>
          (page.data || []).some((m: MessageItem) => m.id === msg.id)
        );
        if (exists) return old;

        const firstPage = old.pages?.[0] ?? { data: [], totalItems: 0 };

        // API của bạn đang fetch sortOrder="desc" (mới nhất trước),
        // nên thêm vào đầu firstPage.data là hợp lý.
        return {
          ...old,
          pages: [
            {
              ...firstPage,
              data: [msg, ...(firstPage.data || [])],
              totalItems: (firstPage.totalItems || 0) + 1,
            },
            ...old.pages.slice(1),
          ],
        };
      });

      // ✅ Update conversation list cache (lastMessage/updatedAt)
      softUpdateConversationsCache(queryClient, conversationId, msg);
    },
    [queryClient]
  );

  // ---------------------------
  // Flatten messages (dedupe + sort asc for display)
  // ---------------------------
  const allMessages = React.useMemo(() => {
    if (!messagesData?.pages) return [];

    const messagesMap = new Map<number, MessageItem>();

    [...messagesData.pages].reverse().forEach((page) => {
      page.data.forEach((message: MessageItem) => {
        if (message?.id != null) messagesMap.set(message.id, message);
      });
    });

    return Array.from(messagesMap.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messagesData]);

  // ---------------------------
  // Join/Leave room on conversation change
  // ---------------------------
  useEffect(() => {
    activeConversationIdRef.current = conversation?.id || 0;
  }, [conversation?.id]);

  // ---------------------------
  // Listen socket events -> update cache
  // ---------------------------
  useEffect(() => {
    const cid = conversation?.id || 0;
    if (!cid || !isConnected) return;

    const offNew = onNewMessage((evt: NewMessageEvent) => {
      const raw = (evt as any)?.message ?? evt;

      const msg: MessageItem = {
        id: raw?.id ?? raw?.message_id,
        conversationId: raw?.conversationId ?? raw?.conversation_id,
        senderId: raw?.senderId ?? raw?.sender_id,
        content:
          raw?.content ??
          (typeof raw?.message === "string" ? raw.message : undefined) ??
          raw?.message?.content ??
          "",
        createdAt: raw?.createdAt ?? raw?.created_at ?? new Date().toISOString(),
      };

      if (!msg.conversationId || !msg.id) return;

      upsertMessageIntoInfiniteCache(msg.conversationId, msg);

      if (msg.conversationId === activeConversationIdRef.current) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    });

    const offSent = onMessageSent((evt: MessageSentEvent) => {
      const raw = (evt as any)?.message ?? evt;

      const msg: MessageItem = {
        id: raw?.id ?? raw?.message_id,
        conversationId: raw?.conversationId ?? raw?.conversation_id,
        senderId: raw?.senderId ?? raw?.sender_id,
        content:
          raw?.content ??
          (typeof raw?.message === "string" ? raw.message : undefined) ??
          raw?.message?.content ??
          "",
        createdAt: raw?.createdAt ?? raw?.created_at ?? new Date().toISOString(),
      };

      if (!msg.conversationId || !msg.id) return;

      upsertMessageIntoInfiniteCache(msg.conversationId, msg);
    });

    return () => {
      offNew?.();
      offSent?.();
    };
  }, [conversation?.id, isConnected, onNewMessage, onMessageSent, upsertMessageIntoInfiniteCache]);

  // ---------------------------
  // Auto scroll behavior
  // ---------------------------
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150;

    if (isInitialLoadRef.current || isNearBottom) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: isInitialLoadRef.current ? "auto" : "smooth",
        });
      }, 100);
    }
  }, [allMessages]);

  useEffect(() => {
    if (!isLoading && allMessages.length > 0 && isInitialLoadRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        isInitialLoadRef.current = false;
      }, 200);
    }
  }, [isLoading, allMessages.length]);

  useEffect(() => {
    isInitialLoadRef.current = true;
  }, [conversation?.id]);

  // ---------------------------
  // Infinite scroll load older
  // ---------------------------
  const handleScroll = React.useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || isFetchingNextPage || !hasNextPage) return;

    if (container.scrollTop < 50) {
      prevScrollHeightRef.current = container.scrollHeight;
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !isFetchingNextPage) return;

    const observer = new MutationObserver(() => {
      const prevScrollHeight = prevScrollHeightRef.current;
      const newScrollHeight = container.scrollHeight;
      const diff = newScrollHeight - prevScrollHeight;

      if (diff > 0) {
        container.scrollTop = container.scrollTop + diff;
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isFetchingNextPage]);

  // ---------------------------
  // Send message (API: sendManagerReplyAsAgent)
  // ---------------------------
  const handleSendMessage = async () => {
    if (!conversation?.id) return;
    const text = messageInput.trim();
    if (!text) return;

    setMessageInput("");

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: conversation.id,
        data: { content: text },
      });

      // Mutation onSuccess đã add cache + update conversation list.
      // Socket sent/new-message sẽ dedupe theo id nên không bị double.
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessageInput(text);
    }
  };

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-gray-500">
        <MessageCircle className="h-8 w-8 text-gray-300" />
        <p>Hãy chọn một đoạn chat ở bên trái để xem nội dung.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">
              {conversation.buyer?.name || "Unknown"}
            </p>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600">
              {conversation.post?.postStatus || "—"}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {conversation.post?.postTitle || "—"}
          </p>
        </div>
        <div className="text-right text-[11px] text-gray-400">
          <p>Cập nhật cuối:</p>
          <p>
            {conversation.updatedAt
              ? format(new Date(conversation.updatedAt), "dd/MM/yyyy HH:mm")
              : "—"}
          </p>
          <p className={cn("mt-1", isConnected ? "text-emerald-600" : "text-gray-400")}>
            {isConnected ? "● Realtime" : "○ Offline"}
          </p>
        </div>
      </div>

      {/* Messages - Scrollable */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4"
      >
        <div className="space-y-4">
          {isFetchingNextPage && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          )}

          {hasNextPage && !isFetchingNextPage && (
            <div className="flex justify-center py-2">
              <button
                onClick={() => fetchNextPage()}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Tải thêm tin nhắn cũ
              </button>
            </div>
          )}

          {isLoading && (
            <p className="text-center text-sm text-gray-400">
              Đang tải tin nhắn...
            </p>
          )}

          {allMessages.map((message: MessageItem) => {
            const isSentByMe = message.senderId === conversation.agentId;
            return (
              <div
                key={`message-${message.id}-${message.createdAt}`}
                className={cn(
                  "flex w-full gap-2 text-sm",
                  isSentByMe ? "justify-end" : "justify-start"
                )}
              >
                {!isSentByMe && (
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                    {conversation.buyer?.name?.charAt(0) || "B"}
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-3 py-2 text-sm break-words",
                    isSentByMe
                      ? "bg-sky-500 text-white"
                      : "border border-gray-200 bg-white text-gray-900"
                  )}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <div
                    className={cn(
                      "mt-1 text-[11px]",
                      isSentByMe ? "text-sky-100" : "text-gray-400"
                    )}
                  >
                    {format(new Date(message.createdAt), "HH:mm")}
                  </div>
                </div>

                {isSentByMe && (
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-semibold text-white">
                    {conversation.agent?.name?.charAt(0) || "A"}
                  </div>
                )}
              </div>
            );
          })}

          {allMessages.length === 0 && !isLoading && (
            <p className="text-center text-sm text-gray-400">
              Chưa có tin nhắn nào trong đoạn chat này.
            </p>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - Fixed */}
      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Nhập tin nhắn..."
            className="h-9 text-sm"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={sendMessageMutation.isPending}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? "..." : "Gửi"}
          </Button>
        </div>
      </div>
    </div>
  );
};
