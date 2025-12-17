"use client"

import * as React from "react"
import { MessageSquare, Send, X, Search, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "../auth/auth-provider"
import { useUserConversations } from "@/hooks/chat/useConversations"
import { useUserInfiniteMessages, useUserSendMessage } from "@/hooks/chat/useMessages"
import { useSocket } from "@/hooks/chat/useSocket"
import { ConversationDataListItem, MessageItem } from "@/types/interfaces/api/chat"
import { useQueryClient } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { ChatApi } from "@/lib/api/chat"

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diffInSeconds < 60) return "Vừa xong"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`

  return then.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
}

function getCurrentUserId(): number {
  const token = Cookies.get("access_token")
  if (!token) return 0
  try {
    const decoded: any = jwtDecode(token)
    return decoded.user_id || decoded.sub || 0
  } catch {
    return 0
  }
}

export default function ChatWidget() {
  const { isAuthed, openAuthModal, user, role } = useAuth()
  const queryClient = useQueryClient()
  const currentUserId = getCurrentUserId()

  const [open, setOpen] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<number | null>(null)
  const [keyword, setKeyword] = React.useState("")
  const [filter, setFilter] = React.useState<"all" | "unread">("all")
  const [input, setInput] = React.useState("")
  const [botInput, setBotInput] = React.useState("")
  const [botMessages, setBotMessages] = React.useState<Array<{ id: string; from: "me" | "bot"; text: string }>>([
    { id: "bot-1", from: "bot", text: "Chào bạn 👋 Mình là chatbot Estatein. Bạn cần mua hay thuê ạ?" },
    { id: "bot-2", from: "bot", text: "Bạn cho mình khu vực + ngân sách + số phòng ngủ nhé." },
  ])
  const [isBotLoading, setIsBotLoading] = React.useState(false)

  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const messagesContainerRef = React.useRef<HTMLDivElement>(null)
  const prevScrollHeightRef = React.useRef(0)
  const isInitialLoadRef = React.useRef(true)

  const normalizeSocketMessage = (m: any): MessageItem => {
    const id = m.id ?? m.message_id
    return {
      ...m,
      id,
      conversationId: m.conversationId ?? m.conversation_id,
      senderId: m.senderId ?? m.sender_id,
      createdAt: m.createdAt ?? m.created_at,
      content: m.content ?? m.message ?? m.text,
    } as MessageItem
  }

  // ✅ CHỈ fetch conversations KHI đã authenticated VÀ đã mở chat
  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
  } = useUserConversations({
    search: keyword || undefined,
    pageSize: 50,
  }, {
    enabled: isAuthed && open, // ⭐ Thêm enabled condition
  })

  // ✅ CHỈ fetch messages KHI có selectedId hợp lệ VÀ đã authenticated
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserInfiniteMessages(selectedId || 0, 20, {
    enabled: isAuthed && !!selectedId && selectedId !== -1, // ⭐ Thêm enabled condition
  })

  // Send message mutation
  const sendMessageMutation = useUserSendMessage()

  // Socket setup - chỉ connect khi đã auth
  const {
    isConnected,
    joinConversation,
    leaveConversation,
    onNewMessage,
  } = useSocket({ autoConnect: isAuthed })

  // Flatten messages từ infinite query
  const allMessages = React.useMemo(() => {
    if (!messagesData?.pages) return []

    const messagesMap = new Map<number, MessageItem>();

    [...messagesData.pages].reverse().forEach((page) => {
      page.data.forEach((message: MessageItem) => {
        messagesMap.set(message.id, message)
      })
    })

    return Array.from(messagesMap.values())
      .filter((m) => m?.id != null)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }, [messagesData])

  const conversations = React.useMemo(() => {
    return conversationsData?.data || []
  }, [conversationsData])

  // Join/leave conversation qua socket
  React.useEffect(() => {
    if (selectedId && selectedId !== -1 && isConnected) {
      joinConversation(selectedId)
    }

    return () => {
      if (selectedId && selectedId !== -1 && isConnected) {
        leaveConversation(selectedId)
      }
    }
  }, [selectedId, isConnected, joinConversation, leaveConversation])

  // Listen for new messages
  React.useEffect(() => {
    if (!selectedId || selectedId === -1) return

    const unsubscribe = onNewMessage((data) => {
      const raw = data.message
      const newMessage = normalizeSocketMessage(raw)

      // ✅ update messages cache (bạn đã làm)
      if (newMessage.conversationId === selectedId) {
        queryClient.setQueryData(["user-messages-infinite", selectedId], (old: any) => {
          if (!old) return old

          const exists = old.pages.some((page: any) =>
            (page.data || []).some((msg: MessageItem) => msg.id === newMessage.id)
          )
          if (exists) return old

          const firstPage = old.pages?.[0] ?? { data: [], totalItems: 0 }
          return {
            ...old,
            pages: [
              {
                ...firstPage,
                data: [newMessage, ...(firstPage.data || [])],
                totalItems: (firstPage.totalItems || 0) + 1,
              },
              ...(old.pages || []).slice(1),
            ],
          }
        })
      }

      // ✅ update conversations cache (KHÔNG invalidate)
      queryClient.setQueriesData({ queryKey: ["user-conversations"] }, (old: any) => {
        if (!old?.data) return old

        const list = old.data as ConversationDataListItem[]
        const idx = list.findIndex((c) => c.id === newMessage.conversationId)
        if (idx === -1) return old

        const conv = list[idx]

        const updatedConv: ConversationDataListItem = {
          ...conv,
          updatedAt: newMessage.createdAt,
          messages: [
            {
              id: newMessage.id,
              content: newMessage.content,
              createdAt: newMessage.createdAt,
              senderId: newMessage.senderId,
            } as any,
          ],
        }

        // move to top
        const next = [updatedConv, ...list.slice(0, idx), ...list.slice(idx + 1)]

        return { ...old, data: next }
      })
    })

    return () => unsubscribe()
  }, [selectedId, onNewMessage, queryClient])

  // Auto scroll
  React.useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150

    if (isInitialLoadRef.current || isNearBottom) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: isInitialLoadRef.current ? "auto" : "smooth"
        })
      }, 100)
    }
  }, [allMessages])

  // Scroll on first load
  React.useEffect(() => {
    if (!isLoadingMessages && allMessages.length > 0 && isInitialLoadRef.current && selectedId !== -1) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
        isInitialLoadRef.current = false
      }, 200)
    }
  }, [isLoadingMessages, allMessages.length, selectedId])

  // Reset scroll flag when conversation changes
  React.useEffect(() => {
    isInitialLoadRef.current = true
  }, [selectedId])

  // Handle scroll to load more
  const handleScroll = React.useCallback(() => {
    const container = messagesContainerRef.current
    if (!container || isFetchingNextPage || !hasNextPage) return

    if (container.scrollTop < 50) {
      prevScrollHeightRef.current = container.scrollHeight
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // Maintain scroll position when loading more
  React.useEffect(() => {
    const container = messagesContainerRef.current
    if (!container || !isFetchingNextPage) return

    const observer = new MutationObserver(() => {
      const prevScrollHeight = prevScrollHeightRef.current
      const newScrollHeight = container.scrollHeight
      const diff = newScrollHeight - prevScrollHeight

      if (diff > 0) {
        container.scrollTop = container.scrollTop + diff
      }
    })

    observer.observe(container, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [isFetchingNextPage])

  const openChat = () => {
    if (!isAuthed) {
      openAuthModal("signin")
      return
    }
    setOpen(true)
  }

  const closeChat = () => {
    setOpen(false)
  }

  const displayedConversations = React.useMemo(() => {
    const kw = keyword.trim().toLowerCase()

    const filtered = conversations.filter((c) => {
      if (!kw) return true
      const buyerName = c.buyer?.name || c.buyer?.email || ""
      const agentName = c.agent?.name || c.agent?.email || ""
      const postTitle = c.post?.postTitle || ""

      return (
        buyerName.toLowerCase().includes(kw) ||
        agentName.toLowerCase().includes(kw) ||
        postTitle.toLowerCase().includes(kw)
      )
    })

    return filtered
  }, [conversations, keyword])

  const selectedConversation = React.useMemo(
    () => conversations.find((c) => c.id === selectedId) || null,
    [conversations, selectedId]
  )

  const send = async () => {
    if (!selectedId || selectedId === -1) return
    const text = input.trim()
    if (!text) return

    setInput("")

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedId,
        data: { senderId: currentUserId, content: text },
      })

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (error) {
      console.error("Failed to send message:", error)
      setInput(text)
    }
  }

  const sendBotMessage = async () => {
    const text = botInput.trim()
    if (!text) return

    const userMessage = { id: crypto.randomUUID(), from: "me" as const, text }
    setBotMessages((prev) => [...prev, userMessage])
    setBotInput("")
    setIsBotLoading(true)

    try {
      const response = await ChatApi.sendMessageChatBot({ message: text })
      const botMessage = { id: crypto.randomUUID(), from: "bot" as const, text: response.reply }
      setBotMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Bot error:", error)
      const errorMessage = {
        id: crypto.randomUUID(),
        from: "bot" as const,
        text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại."
      }
      setBotMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsBotLoading(false)
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  const onSelectConversation = (id: number) => {
    setSelectedId(id)
  }

  const getOtherUserName = (conv: ConversationDataListItem) => {
    if (!currentUserId) return "Unknown"

    // Nếu current user là buyer, hiển thị agent
    if (conv.buyerId === currentUserId) {
      return conv.agent?.name || conv.agent?.email || "Agent"
    }

    // Nếu current user là agent, hiển thị buyer
    if (conv.agentId === currentUserId) {
      return conv.buyer?.name || conv.buyer?.email || "Buyer"
    }

    return "User"
  }

  const getAvatarText = (conv: ConversationDataListItem) => {
    const name = getOtherUserName(conv)
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      {open && (
        <div className="overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#0f0f0f] shadow-2xl w-[920px] h-[560px]">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold text-white">Chat</div>
              <div className="text-[11px] text-white/45">
                Đang đăng nhập: <span className="text-white/70">{user?.email ?? "—"}</span>
              </div>
            </div>

            <button
              onClick={closeChat}
              className="rounded-lg p-2 text-white/60 hover:text-white hover:bg-white/5"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body: 2 columns */}
          <div className="flex h-[calc(560px-56px)]">
            {/* LEFT: Conversations */}
            <div className="w-[320px] border-r border-[#1a1a1a] bg-[#0f0f0f]">
              {/* Search */}
              <div className="p-3 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35" />
                    <input
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="Tìm theo tên"
                      className="h-10 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] pl-9 pr-3 text-sm text-white/85 placeholder:text-white/30 outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* List */}
              <div className="h-[calc(100%-68px)] overflow-auto chat-scrollbar">
                {/* Bot conversation - always on top */}
                <button
                  type="button"
                  onClick={() => onSelectConversation(-1)}
                  className={cn(
                    "w-full text-left px-3 py-3 border-b border-[#1a1a1a] transition-colors",
                    selectedId === -1 ? "bg-white/5" : "hover:bg-white/[0.04]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center border bg-purple-600/15 border-purple-500/25">
                      <span className="text-xs font-semibold text-white/85">AI</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="truncate text-sm font-semibold text-white">
                              Chatbot Estatein
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full border border-purple-500/25 bg-purple-600/10 text-purple-200">
                              Chatbot
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-1 truncate text-xs text-white/55">
                        Gợi ý BĐS, lọc theo nhu cầu…
                      </div>
                    </div>
                  </div>
                </button>

                {/* Real conversations */}
                {isLoadingConversations && (
                  <div className="p-6 text-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-white/40" />
                  </div>
                )}

                {displayedConversations.map((c) => {
                  const active = c.id === selectedId
                  const lastMessage = c.messages?.[0]

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelectConversation(c.id)}
                      className={cn(
                        "w-full text-left px-3 py-3 border-b border-[#1a1a1a] transition-colors",
                        active ? "bg-white/5" : "hover:bg-white/[0.04]"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center border bg-[#0a0a0a] border-[#1a1a1a]">
                          <span className="text-xs font-semibold text-white/85">
                            {getAvatarText(c)}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="truncate text-sm font-semibold text-white">
                              {getOtherUserName(c)}
                            </div>
                            <div className="text-[11px] text-white/45 shrink-0">
                              {formatRelativeTime(c.updatedAt || c.createdAt)}
                            </div>
                          </div>

                          <div className="mt-1 truncate text-xs text-white/55">
                            {lastMessage?.content || c.post?.postTitle || "—"}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}

                {!isLoadingConversations && displayedConversations.length === 0 && (
                  <div className="p-6 text-center text-sm text-white/45">
                    Không tìm thấy cuộc trò chuyện phù hợp.
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Chat */}
            <div className="flex-1 bg-[#0f0f0f]">
              {/* No selection */}
              {selectedId === null && (
                <div className="h-full flex items-center justify-center px-8">
                  <div className="text-center max-w-md">
                    <div className="mx-auto mb-5 h-20 w-20 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-white/60" />
                    </div>
                    <div className="text-xl font-bold text-white mb-2">
                      Chào mừng bạn đến với Estatein Chat
                    </div>
                    <div className="text-sm text-white/50">
                      Hãy chọn một cuộc trò chuyện ở bên trái để bắt đầu nhắn tin.
                    </div>
                  </div>
                </div>
              )}

              {/* Bot chat */}
              {selectedId === -1 && (
                <div className="h-full flex flex-col">
                  <div className="px-4 py-3 border-b border-[#1a1a1a]">
                    <div className="text-sm font-semibold text-white">Chatbot Estatein</div>
                    <div className="text-[11px] text-white/45">Tư vấn tự động 24/7</div>
                  </div>

                  <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-auto px-4 py-4 space-y-3 chat-scrollbar"
                  >
                    {botMessages.map((m) => (
                      <div key={m.id} className={m.from === "me" ? "flex justify-end" : "flex justify-start"}>
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                            m.from === "me"
                              ? "bg-purple-600 text-white"
                              : "bg-[#0a0a0a] border border-[#1a1a1a] text-white/80"
                          )}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {isBotLoading && (
                      <div className="flex justify-start">
                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl px-3 py-2">
                          <Loader2 className="h-4 w-4 animate-spin text-white/60" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t border-[#1a1a1a] p-3">
                    <div className="flex items-center gap-2">
                      <input
                        value={botInput}
                        onChange={(e) => setBotInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !isBotLoading && sendBotMessage()}
                        placeholder="Nhập tin nhắn..."
                        disabled={isBotLoading}
                        className="h-10 flex-1 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-3 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500 disabled:opacity-50"
                      />
                      <Button
                        onClick={sendBotMessage}
                        disabled={isBotLoading}
                        className="h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-3"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Real conversation */}
              {selectedId && selectedId !== -1 && selectedConversation && (
                <div className="h-full flex flex-col">
                  <div className="px-4 py-3 border-b border-[#1a1a1a]">
                    <div className="text-sm font-semibold text-white truncate">
                      {getOtherUserName(selectedConversation)}
                    </div>
                    <div className="text-[11px] text-white/45 truncate">
                      {selectedConversation.post?.postTitle || "Hội thoại"}
                    </div>
                  </div>

                  <div
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-auto px-4 py-4 space-y-3 chat-scrollbar"
                  >
                    {isFetchingNextPage && (
                      <div className="text-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto text-white/40" />
                      </div>
                    )}

                    {isLoadingMessages && (
                      <div className="text-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto text-white/40" />
                      </div>
                    )}

                    {allMessages.map((m: MessageItem) => {
                      const isMe = m.senderId === currentUserId

                      return (
                        <div key={m.id} className={isMe ? "flex justify-end" : "flex justify-start"}>
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                              isMe
                                ? "bg-purple-600 text-white"
                                : "bg-[#0a0a0a] border border-[#1a1a1a] text-white/80"
                            )}
                          >
                            {m.content}
                          </div>
                        </div>
                      )
                    })}

                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t border-[#1a1a1a] p-3">
                    <div className="flex items-center gap-2">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !sendMessageMutation.isPending && send()}
                        placeholder="Nhập tin nhắn..."
                        disabled={sendMessageMutation.isPending}
                        className="h-10 flex-1 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-3 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500 disabled:opacity-50"
                      />
                      <Button
                        onClick={send}
                        disabled={sendMessageMutation.isPending}
                        className="h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-3"
                      >
                        {sendMessageMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={open ? closeChat : openChat}
        className="group flex items-center gap-2 rounded-full border border-[#1a1a1a] bg-[#141414] px-4 py-3 text-white shadow-lg hover:bg-white/5 transition-colors"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600/20 border border-purple-500/20">
          <MessageSquare className="h-5 w-5 text-white/90" />
        </div>
        <div className="pr-1">
          <div className="text-sm font-semibold leading-tight">Chat</div>
          <div className="text-[11px] text-white/50 leading-tight">Tư vấn ngay</div>
        </div>
      </button>
    </div>
  )
}
