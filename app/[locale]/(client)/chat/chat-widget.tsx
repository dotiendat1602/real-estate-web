// app/[locale]/(client)/chat/chat-widget.tsx
"use client"

import * as React from "react"
import { ExternalLink, FileText, Home, Loader2, MapPin, MessageSquare, Search, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "../auth/auth-provider"
import { useUserConversations } from "@/hooks/chat/useConversations"
import {
  useChatBotInfiniteMessages,
  useSendChatBotMessage,
  useUserInfiniteMessages,
  useUserSendMessage,
  useSendBuyerFirstMessage,
} from "@/hooks/chat/useMessages"
import { useSocket } from "@/hooks/chat/useSocket"
import { ChatBotCitation, ConversationDataListItem, MessageItem } from "@/types/interfaces/api/chat"
import { useQueryClient } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { useChatContext } from "./chat-context"
import { useLocale } from "next-intl"
import { usePathname } from "next/navigation"
import { withLocalePath } from "@/lib/utils/i18n"

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

function cleanCitationSnippet(snippet?: string | null) {
  if (!snippet) return ""
  return snippet
    .replace(/LISTING_ID:\s*\d+/gi, "")
    .replace(/=+\s*(?:BẤT\s+ĐỘNG\s+SẢN|BAT\s+DONG\s+SAN)\s+\d+\s*=+/gi, "")
    .replace(/^\[[^\]]+\]\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim()
}

function inlineMarkdown(text: string) {
  return text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, index) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      const href = linkMatch[2].startsWith("/posts/") && typeof window !== "undefined"
        ? `/${window.location.pathname.split("/")[1]}${linkMatch[2]}`
        : linkMatch[2]
      return (
        <a
          key={index}
          href={href}
          className="font-medium text-purple-200 underline underline-offset-2 hover:text-purple-100"
        >
          {linkMatch[1]}
        </a>
      )
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>
    }
    return <React.Fragment key={index}>{part}</React.Fragment>
  })
}

function BotAnswerContent({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean)

  if (!blocks.length) return null

  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean)
        const isList = lines.length > 1 && lines.every((line) => /^([-*+]\s+|\d+[.)]\s+)/.test(line))

        if (isList) {
          return (
            <ul key={blockIndex} className="space-y-1.5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-300/80" />
                  <span>{inlineMarkdown(line.replace(/^([-*+]\s+|\d+[.)]\s+)/, ""))}</span>
                </li>
              ))}
            </ul>
          )
        }

        if (lines.length === 1 && /^#{2,4}\s+/.test(lines[0])) {
          return (
            <div key={blockIndex} className="text-[15px] font-semibold text-white">
              {inlineMarkdown(lines[0].replace(/^#{2,4}\s+/, ""))}
            </div>
          )
        }

        return (
          <p key={blockIndex} className="leading-relaxed">
            {inlineMarkdown(lines.join(" "))}
          </p>
        )
      })}
    </div>
  )
}

function CitationList({ citations }: { citations?: ChatBotCitation[] }) {
  const locale = useLocale()
  const items = (citations || []).filter(Boolean).slice(0, 6)
  if (!items.length) return null

  return (
    <div className="mt-3 border-t border-white/10 pt-3">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/55">
        <FileText className="h-3.5 w-3.5" />
        Dẫn chứng ({citations?.length || items.length})
      </div>
      <div className="space-y-2">
        {items.map((citation, index) => {
          const isPlanning = Boolean(citation.planningDocumentId || citation.dossierCode || citation.documentScope === "planning")
          const title = citation.title || citation.postTitle || `Nguồn #${index + 1}`
          const location = [citation.ward, citation.district, citation.province || citation.city].filter(Boolean).join(", ")
          const sourceLocator = citation.sourceLocator || [
            citation.pageNumber ? `trang ${citation.pageNumber}` : null,
            citation.lineStart ? `dòng ${citation.lineStart}${citation.lineEnd ? `-${citation.lineEnd}` : ""}` : null,
          ].filter(Boolean).join(", ")
          const snippet = cleanCitationSnippet(citation.snippet)
          const href = citation.postId
            ? withLocalePath(`/posts/${citation.postId}`, locale)
            : citation.sourceUrl
              ? citation.sourceUrl.startsWith("/posts/")
                ? withLocalePath(citation.sourceUrl, locale)
                : citation.sourceUrl
              : null

          return (
            <div key={`${citation.postId || citation.planningDocumentId || "citation"}-${index}`} className="rounded-lg border border-white/10 bg-white/[0.035] p-2.5">
              <div className="flex items-start gap-2">
                <div className={cn("mt-0.5 rounded-md p-1.5", isPlanning ? "bg-amber-500/15 text-amber-200" : "bg-purple-500/15 text-purple-200")}>
                  {isPlanning ? <FileText className="h-3.5 w-3.5" /> : <Home className="h-3.5 w-3.5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-xs font-semibold text-white/90">{title}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-white/50">
                    {isPlanning && citation.dossierCode && <span>Hồ sơ {citation.dossierCode}</span>}
                    {isPlanning && citation.planYear && <span>Năm {citation.planYear}</span>}
                    {sourceLocator && <span>{sourceLocator}</span>}
                    {!isPlanning && location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {location}
                      </span>
                    )}
                  </div>
                  {snippet && <div className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-white/60">{snippet}</div>}
                  {href && (
                    <a
                      href={href}
                      target={citation.postId ? undefined : "_blank"}
                      rel={citation.postId ? undefined : "noreferrer"}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-purple-200 hover:text-purple-100"
                    >
                      {citation.postId ? "Xem chi tiết" : "Mở nguồn"}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const { isAuthed, openAuthModal, user } = useAuth()
  const queryClient = useQueryClient()
  const currentUserId = getCurrentUserId()
  const chatContext = useChatContext()
  const pathname = usePathname()
  const currentPostId = React.useMemo(() => {
    const match = pathname?.match(/\/posts\/(\d+)/)
    return match ? Number(match[1]) : undefined
  }, [pathname])

  const [open, setOpen] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<number | null>(null)
  const [keyword, setKeyword] = React.useState("")
  const [input, setInput] = React.useState("")
  const [botInput, setBotInput] = React.useState("")

  const {
    data: chatBotMessagesData,
    isLoading: isLoadingBotMessages,
    fetchNextPage: fetchNextBotPage,
    hasNextPage: hasNextBotPage,
    isFetchingNextPage: isFetchingNextBotPage,
  } = useChatBotInfiniteMessages(10, {
    enabled: isAuthed && open && selectedId === -1,
  })

  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const messagesContainerRef = React.useRef<HTMLDivElement>(null)
  const prevScrollHeightRef = React.useRef(0)
  const isInitialLoadRef = React.useRef(true)
  const hasProcessedPendingRef = React.useRef(false)

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior = "auto") => {
    const run = () => {
      const container = messagesContainerRef.current
      if (container && behavior === "auto") {
        container.scrollTop = container.scrollHeight
      }
      messagesEndRef.current?.scrollIntoView({ behavior, block: "end" })
    }

    requestAnimationFrame(run)
    if (behavior === "auto") {
      requestAnimationFrame(() => requestAnimationFrame(run))
      window.setTimeout(run, 80)
    }
  }, [])

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

  // CHỈ fetch conversations KHI đã authenticated VÀ đã mở chat
  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
  } = useUserConversations(
    {
      search: keyword || undefined,
      pageSize: 50,
    },
    {
      enabled: isAuthed && open,
    }
  )

  // CHỈ fetch messages KHI có selectedId hợp lệ VÀ đã authenticated
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserInfiniteMessages(selectedId || 0, 20, {
    enabled: isAuthed && !!selectedId && selectedId !== -1,
  })

  // Send message mutation
  const sendMessageMutation = useUserSendMessage()
  const sendBotMessageMutation = useSendChatBotMessage()
  const sendBuyerFirstMessageMutation = useSendBuyerFirstMessage()

  const isBotLoading = sendBotMessageMutation.isPending

  // Socket setup - chỉ connect khi đã auth
  const { isConnected, joinConversation, leaveConversation, onNewMessage } =
    useSocket({ autoConnect: isAuthed })

  // Flatten messages từ infinite query
  const allMessages = React.useMemo(() => {
    if (!messagesData?.pages) return []

    const messagesMap = new Map<number, MessageItem>()

      ;[...messagesData.pages].reverse().forEach((page) => {
        page.data.forEach((message: MessageItem) => {
          messagesMap.set(message.id, message)
        })
      })

    return Array.from(messagesMap.values())
      .filter((m) => m?.id != null)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
  }, [messagesData])

  const conversations = React.useMemo(() => {
    return conversationsData?.data || []
  }, [conversationsData])

  // Handle pending message from context
  React.useEffect(() => {
    if (!chatContext.pendingMessage || !isAuthed) return
    if (hasProcessedPendingRef.current) return // Prevent re-processing

    const { agentId, postId, message } = chatContext.pendingMessage

    // Open chat first
    setOpen(true)

    // Mark as processing
    hasProcessedPendingRef.current = true

    // Wait for conversations to load
    const timer = setTimeout(() => {
      const existingConv = conversations.find(
        (c) => c.agentId === agentId && c.postId === postId
      )

      if (existingConv) {
        setSelectedId(existingConv.id)

        setTimeout(() => {
          setInput(message)
          chatContext.clearPendingMessage()
          hasProcessedPendingRef.current = false
        }, 300)
      } else {
        sendBuyerFirstMessageMutation.mutate(
          {
            postId,
            agentId,
            content: message,
          },
          {
            onSuccess: (response) => {
              refetchConversations()

              setTimeout(() => {
                setSelectedId(response.conversation.id)
                chatContext.clearPendingMessage()
                hasProcessedPendingRef.current = false
              }, 500)
            },
            onError: (error) => {
              console.error("Failed to send first message:", error)
              chatContext.clearPendingMessage()
              hasProcessedPendingRef.current = false
            },
          }
        )
      }
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatContext.pendingMessage])

  // Reset processing flag when chat closes
  React.useEffect(() => {
    if (!open) {
      hasProcessedPendingRef.current = false
    }
  }, [open])

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

      // update messages cache
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

      // update conversations cache
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

  // Scroll to bottom immediately when selecting a conversation
  React.useEffect(() => {
    if (!open) return
    if (selectedId === null) return

    isInitialLoadRef.current = true
    scrollToBottom("auto")
  }, [selectedId, open, scrollToBottom])

  // Scroll on first load of messages for a conversation
  React.useEffect(() => {
    if (selectedId === null || selectedId === -1) return
    if (isLoadingMessages) return
    if (!allMessages.length) return

    if (isInitialLoadRef.current) {
      scrollToBottom("auto")
      isInitialLoadRef.current = false
    }
  }, [selectedId, isLoadingMessages, allMessages, scrollToBottom])

  // Auto scroll when new messages arrive IF user is near bottom
  React.useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150

    if (isInitialLoadRef.current || isNearBottom) {
      scrollToBottom(isInitialLoadRef.current ? "auto" : "smooth")
    }
  }, [allMessages, scrollToBottom])

  // Handle scroll to load more (older messages)
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

      scrollToBottom("smooth")
    } catch (error) {
      console.error("Failed to send message:", error)
      setInput(text)
    }
  }

  const botMessages = React.useMemo(() => {
    if (!chatBotMessagesData?.pages) return []

    const messagesMap = new Map<number, any>()

      ;[...chatBotMessagesData.pages].reverse().forEach((page) => {
        page.data.forEach((message: any) => {
          messagesMap.set(message.id, {
            id: message.id.toString(),
            from: message.senderType === "USER" ? "me" : "bot",
            text: message.content,
            citations: message.metadata?.citations || [],
          })
        })
      })

    return Array.from(messagesMap.values()).sort((a, b) => parseInt(a.id) - parseInt(b.id))
  }, [chatBotMessagesData])

  React.useEffect(() => {
    if (selectedId !== -1) return
    if (isLoadingBotMessages) return
    if (!botMessages.length) return

    const container = messagesContainerRef.current
    if (!container) return

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150

    if (isInitialLoadRef.current || isNearBottom) {
      scrollToBottom(isInitialLoadRef.current ? "auto" : "smooth")
      isInitialLoadRef.current = false
    }
  }, [selectedId, isLoadingBotMessages, botMessages, scrollToBottom])

  const sendBotMessage = async () => {
    const text = botInput.trim()
    if (!text) return

    setBotInput("")

    try {
      await sendBotMessageMutation.mutateAsync({ message: text, postId: currentPostId })
      scrollToBottom("smooth")
    } catch (error) {
      console.error("Bot error:", error)
      setBotInput(text)
    }
  }

  const onSelectConversation = (id: number) => {
    setSelectedId(id)
  }

  const getOtherUserName = (conv: ConversationDataListItem) => {
    if (!currentUserId) return "Unknown"

    if (conv.buyerId === currentUserId) {
      return conv.agent?.name || conv.agent?.email || "Agent"
    }

    if (conv.agentId === currentUserId) {
      return conv.buyer?.name || conv.buyer?.email || "Buyer"
    }

    return "User"
  }

  const getAvatarText = (conv: ConversationDataListItem) => {
    const name = getOtherUserName(conv)
    return name.slice(0, 2).toUpperCase()
  }

  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const botInputRef = React.useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  const autoResizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  React.useEffect(() => {
    autoResizeTextarea(inputRef.current)
  }, [input])

  React.useEffect(() => {
    autoResizeTextarea(botInputRef.current)
  }, [botInput])

  return (
    <div className="fixed bottom-5 right-5 z-[10000] flex flex-col items-end gap-3">
      {/* Panel */}
      {open && (
        <div className="overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#0f0f0f] shadow-2xl w-[920px] h-[560px]">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold text-white">Chat</div>
              <div className="text-[11px] text-white/45">
                Đang đăng nhập:{" "}
                <span className="text-white/70">{user?.email ?? "—"}</span>
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
                      <span className="text-xs font-semibold text-white/85">
                        AI
                      </span>
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
                    <div className="text-sm font-semibold text-white">
                      Chatbot Estatein
                    </div>
                    <div className="text-[11px] text-white/45">
                      Tư vấn tự động 24/7
                    </div>
                  </div>

                  <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-auto px-4 py-4 space-y-3 chat-scrollbar"
                  >
                    {botMessages.map((m) => (
                      <div
                        key={m.id}
                        className={m.from === "me" ? "flex justify-end" : "flex justify-start"}
                      >
                        <div
                          className={cn(
                            "max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                            "whitespace-pre-wrap break-words",
                            "word-break-break-word overflow-wrap-anywhere",
                            m.from === "me"
                              ? "bg-purple-600 text-white"
                              : "bg-[#0a0a0a] border border-[#1a1a1a] text-white/80"
                          )}
                          style={{
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere',
                            hyphens: 'auto'
                          }}
                        >
                          {m.from === "bot" ? (
                            <>
                              <BotAnswerContent text={m.text} />
                              <CitationList citations={m.citations} />
                            </>
                          ) : (
                            m.text
                          )}
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
                    <div className="flex items-end gap-2">
                      <textarea
                        ref={botInputRef}
                        value={botInput}
                        onChange={(e) => setBotInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            if (!isBotLoading) sendBotMessage()
                          }
                        }}
                        placeholder="Nhập tin nhắn... (Shift+Enter để xuống dòng)"
                        disabled={isBotLoading}
                        rows={1}
                        className="flex-1 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-3 py-2.5 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500 disabled:opacity-50 resize-none overflow-hidden min-h-[40px] max-h-[120px]"
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: 'rgba(255,255,255,0.1) transparent'
                        }}
                      />
                      <Button
                        onClick={sendBotMessage}
                        disabled={isBotLoading}
                        className="h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-3 shrink-0"
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
                        <div
                          key={m.id}
                          className={isMe ? "flex justify-end" : "flex justify-start"}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                              "whitespace-pre-wrap break-words",
                              "word-break-break-word overflow-wrap-anywhere",
                              isMe
                                ? "bg-purple-600 text-white"
                                : "bg-[#0a0a0a] border border-[#1a1a1a] text-white/80"
                            )}
                            style={{
                              wordBreak: 'break-word',
                              overflowWrap: 'anywhere',
                              hyphens: 'auto'
                            }}
                          >
                            {m.content}
                          </div>
                        </div>
                      )
                    })}

                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t border-[#1a1a1a] p-3">
                    <div className="flex items-end gap-2">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            if (!sendMessageMutation.isPending) send()
                          }
                        }}
                        placeholder="Nhập tin nhắn... (Shift+Enter để xuống dòng)"
                        disabled={sendMessageMutation.isPending}
                        rows={1}
                        className="flex-1 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-3 py-2.5 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500 disabled:opacity-50 resize-none overflow-hidden min-h-[40px] max-h-[120px]"
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: 'rgba(255,255,255,0.1) transparent'
                        }}
                      />
                      <Button
                        onClick={send}
                        disabled={sendMessageMutation.isPending}
                        className="h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-3 shrink-0"
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
