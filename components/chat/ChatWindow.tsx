// components/chat/ChatWindow.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";
import {
  ConversationDataListItem,
  MessageItem,
} from "@/types/interfaces/api/chat";
import { useInfiniteMessages, useSendManagerReplyAsAgent } from "@/hooks/chat/useMessages";
import { useSocket } from "@/hooks/chat/useSocket";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

interface ChatWindowProps {
  conversation: ConversationDataListItem | null;
  currentUserId: number;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUserId,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const prevScrollHeightRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  const {
    data: messagesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMessages(conversation?.id || 0, 8);

  const sendMessageMutation = useSendManagerReplyAsAgent();
  const {
    isConnected,
    joinConversation,
    leaveConversation,
    onNewMessage,
  } = useSocket({ autoConnect: true });

  // Flatten all messages từ các pages và reverse để hiển thị từ cũ -> mới
  // Sử dụng Map để deduplicate messages based on message_id
  const allMessages = React.useMemo(() => {
    if (!messagesData?.pages) return [];

    const messagesMap = new Map<number, MessageItem>();

    // Đảo ngược pages để xử lý từ page cũ nhất trước
    [...messagesData.pages].reverse().forEach((page) => {
      page.data.forEach((message: MessageItem) => {
        messagesMap.set(message.id, message);
      });
    });

    // Convert Map về array và sort theo thời gian (cũ -> mới)
    return Array.from(messagesMap.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messagesData]);

  // Join conversation khi chọn
  useEffect(() => {
    if (conversation && isConnected) {
      joinConversation(conversation.id);
    }

    return () => {
      if (conversation && isConnected) {
        leaveConversation(conversation.id);
      }
    };
  }, [conversation, isConnected, joinConversation, leaveConversation]);

  // Reset initial load flag when conversation changes
  useEffect(() => {
    isInitialLoadRef.current = true;
  }, [conversation?.id]);

  // Listen for new messages via socket và thêm vào cache
  useEffect(() => {
    if (!conversation) return;

    const unsubscribe = onNewMessage((data) => {
      console.log("New message received:", data);

      const newMessage = data.message;

      // Thêm message mới vào cache
      queryClient.setQueryData(
        ["messages-infinite", conversation.id],
        (old: any) => {
          if (!old) return old;

          // Check if message already exists in any page
          const exists = old.pages.some((page: any) =>
            page.data.some((msg: MessageItem) => msg.id === newMessage.message_id)
          );

          if (exists) return old;

          const firstPage = old.pages[0];

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                data: [newMessage, ...(firstPage.data || [])],
                totalItems: firstPage.totalItems + 1,
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );

      // Update conversations list (soft update, không refetch)
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
        refetchType: "none",
      });
    });

    return () => unsubscribe();
  }, [conversation, onNewMessage, queryClient]);

  // Auto scroll to bottom khi có message mới (chỉ khi đang ở gần bottom)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150;

    // Nếu là initial load hoặc đang ở gần bottom thì scroll xuống
    if (isInitialLoadRef.current || isNearBottom) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: isInitialLoadRef.current ? "auto" : "smooth" });
      }, 100);
    }
  }, [allMessages]);

  // Scroll to bottom khi first load
  useEffect(() => {
    if (!isLoading && allMessages.length > 0 && isInitialLoadRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        isInitialLoadRef.current = false;
      }, 200);
    }
  }, [isLoading, allMessages.length]);

  // Handle scroll to load more (scroll lên top)
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || isFetchingNextPage || !hasNextPage) return;

    // Khi scroll gần đến top (50px)
    if (container.scrollTop < 50) {
      prevScrollHeightRef.current = container.scrollHeight;
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Maintain scroll position khi load more
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

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [isFetchingNextPage]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !conversation) return;

    const content = messageInput.trim();
    setMessageInput("");

    try {
      // Gửi qua REST API (Manager reply as agent)
      // Backend sẽ tự broadcast qua socket với senderId = agentId
      await sendMessageMutation.mutateAsync({
        conversationId: conversation.id,
        data: { content },
      });

      // Scroll to bottom sau khi gửi
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessageInput(content); // Restore message on error
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
        </div>
      </div>

      {/* Messages - Scrollable */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4"
      >
        <div className="space-y-4">
          {/* Load more indicator */}
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
            <p className="text-center text-sm text-gray-400">Đang tải tin nhắn...</p>
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
                  <div
                    className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700"
                  >
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
                  <div
                    className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-semibold text-white"
                  >
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
