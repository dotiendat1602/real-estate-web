"use client"

import * as React from "react"
import { MessageSquare, Send, X, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "../auth/auth-provider"

type Conversation = {
  id: string
  title: string
  subtitle?: string
  updatedAt: string // display only
  unread?: number
  avatarText?: string
  isBot?: boolean
}

type ChatMessage = {
  id: string
  from: "me" | "support"
  text: string
  createdAt?: string
}

const BOT_CONVERSATION_ID = "bot"

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export default function ChatWidget() {
  const { isAuthed, openAuthModal, user } = useAuth()

  const [open, setOpen] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const [keyword, setKeyword] = React.useState("")
  const [filter, setFilter] = React.useState<"all" | "unread">("all")

  // Demo conversations (sau này map từ API)
  const [conversations, setConversations] = React.useState<Conversation[]>([
    {
      id: BOT_CONVERSATION_ID,
      title: "Chatbot Estatein",
      subtitle: "Gợi ý BĐS, lọc theo nhu cầu…",
      updatedAt: "Hôm nay",
      unread: 0,
      avatarText: "AI",
      isBot: true,
    },
    {
      id: "c_1",
      title: "Nguyễn Minh Anh",
      subtitle: "Mình cần căn 2PN khu Cầu Giấy...",
      updatedAt: "15/10",
      unread: 2,
      avatarText: "MA",
    },
    {
      id: "c_2",
      title: "Trần Quốc Huy",
      subtitle: "Có căn nào budget 3 tỷ không?",
      updatedAt: "31/05",
      unread: 0,
      avatarText: "QH",
    },
    {
      id: "c_3",
      title: "Lê Thanh",
      subtitle: "Cho mình xin thêm ảnh nội thất",
      updatedAt: "11/01",
      unread: 1,
      avatarText: "LT",
    },
  ])

  // Demo messages per conversation
  const [messagesByConv, setMessagesByConv] = React.useState<Record<string, ChatMessage[]>>({
    [BOT_CONVERSATION_ID]: [
      { id: "m1", from: "support", text: "Chào bạn 👋 Mình là chatbot Estatein. Bạn cần mua hay thuê ạ?" },
      { id: "m2", from: "support", text: "Bạn cho mình khu vực + ngân sách + số phòng ngủ nhé." },
    ],
    c_1: [{ id: "m3", from: "support", text: "Chào bạn, mình có vài căn phù hợp. Bạn muốn gần trường học hay metro?" }],
    c_2: [{ id: "m4", from: "support", text: "Chào bạn, ngân sách 3 tỷ bạn ưu tiên quận nào?" }],
    c_3: [{ id: "m5", from: "support", text: "Mình gửi bạn ảnh nội thất và mặt bằng nhé." }],
  })

  const [input, setInput] = React.useState("")

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

    // Pin bot on top always
    const sorted = [...conversations].sort((a, b) => {
      const ap = a.isBot ? -1 : 0
      const bp = b.isBot ? -1 : 0
      if (ap !== bp) return ap - bp
      // fallback: no real time sort yet, keep order stable
      return 0
    })

    const filtered = sorted.filter((c) => {
      if (filter === "unread" && (!c.unread || c.unread <= 0)) return false
      if (!kw) return true
      return (
        c.title.toLowerCase().includes(kw) ||
        (c.subtitle ? c.subtitle.toLowerCase().includes(kw) : false)
      )
    })

    return filtered
  }, [conversations, keyword, filter])

  const selectedConversation = React.useMemo(
    () => conversations.find((c) => c.id === selectedId) || null,
    [conversations, selectedId],
  )

  const selectedMessages = React.useMemo(
    () => (selectedId ? messagesByConv[selectedId] || [] : []),
    [messagesByConv, selectedId],
  )

  const send = () => {
    if (!selectedId) return
    const text = input.trim()
    if (!text) return

    const msg: ChatMessage = { id: crypto.randomUUID(), from: "me", text }
    setMessagesByConv((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), msg],
    }))
    setInput("")

    // cập nhật preview subtitle + updatedAt (demo)
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId ? { ...c, subtitle: text, updatedAt: "Vừa xong", unread: 0 } : c,
      ),
    )
  }

  const onSelectConversation = (id: string) => {
    setSelectedId(id)
    // clear unread
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)))
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      {open && (
        <div
          className="
            overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#0f0f0f] shadow-2xl
            w-[920px] h-[560px]
          "
        >
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
              {/* Search + filter */}
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

                  <button
                    type="button"
                    onClick={() => setFilter((p) => (p === "all" ? "unread" : "all"))}
                    className="h-10 px-3 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] text-sm text-white/70 hover:text-white hover:bg-white/5 inline-flex items-center gap-1"
                    title={filter === "all" ? "Chỉ xem chưa đọc" : "Xem tất cả"}
                  >
                    {filter === "all" ? "Tất cả" : "Chưa đọc"}
                    <ChevronDown className="h-4 w-4 text-white/40" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="h-[calc(100%-68px)] overflow-auto">
                {displayedConversations.map((c) => {
                  const active = c.id === selectedId
                  const isPinned = !!c.isBot

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelectConversation(c.id)}
                      className={cn(
                        "w-full text-left px-3 py-3 border-b border-[#1a1a1a] transition-colors",
                        active ? "bg-white/5" : "hover:bg-white/[0.04]",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center border",
                            isPinned ? "bg-purple-600/15 border-purple-500/25" : "bg-[#0a0a0a] border-[#1a1a1a]",
                          )}
                        >
                          <span className="text-xs font-semibold text-white/85">
                            {c.avatarText || c.title.slice(0, 2).toUpperCase()}
                          </span>
                        </div>

                        {/* Meta */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="truncate text-sm font-semibold text-white">
                                  {c.title}
                                </div>
                                {isPinned && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-purple-500/25 bg-purple-600/10 text-purple-200">
                                    Chatbot
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-[11px] text-white/45 shrink-0">{c.updatedAt}</div>
                          </div>

                          <div className="mt-1 flex items-center justify-between gap-2">
                            <div className="truncate text-xs text-white/55">
                              {c.subtitle || "—"}
                            </div>

                            {!!c.unread && c.unread > 0 && (
                              <div className="h-5 min-w-5 px-1.5 rounded-full bg-purple-600 text-white text-[11px] flex items-center justify-center">
                                {c.unread}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}

                {displayedConversations.length === 0 && (
                  <div className="p-6 text-center text-sm text-white/45">
                    Không tìm thấy cuộc trò chuyện phù hợp.
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Chat / Welcome */}
            <div className="flex-1 bg-[#0f0f0f]">
              {/* If no selection: Welcome */}
              {!selectedConversation ? (
                <div className="h-full flex items-center justify-center px-8">
                  <div className="text-center max-w-md">
                    <div className="mx-auto mb-5 h-20 w-20 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-white/60" />
                    </div>
                    <div className="text-xl font-bold text-white mb-2">Chào mừng bạn đến với Estatein Chat</div>
                    <div className="text-sm text-white/50">
                      Hãy chọn một cuộc trò chuyện ở bên trái để bắt đầu nhắn tin với tư vấn viên hoặc chatbot.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {/* Chat header */}
                  <div className="px-4 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{selectedConversation.title}</div>
                      <div className="text-[11px] text-white/45 truncate">
                        {selectedConversation.isBot ? "Tư vấn tự động 24/7" : "Tư vấn viên đang hỗ trợ"}
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
                    {selectedMessages.map((m) => (
                      <div key={m.id} className={m.from === "me" ? "flex justify-end" : "flex justify-start"}>
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                            m.from === "me"
                              ? "bg-purple-600 text-white"
                              : "bg-[#0a0a0a] border border-[#1a1a1a] text-white/80",
                          )}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Composer */}
                  <div className="border-t border-[#1a1a1a] p-3">
                    <div className="flex items-center gap-2">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
                        placeholder="Nhập tin nhắn..."
                        className="h-10 flex-1 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-3 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
                      />
                      <Button
                        onClick={send}
                        className="h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-3"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 text-[11px] text-white/35">
                      Tip: Nhấn Enter để gửi.
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
        onClick={open ? () => setOpen(false) : openChat}
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
