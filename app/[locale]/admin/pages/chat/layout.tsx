"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageCircle, RefreshCw } from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { Button } from "@/components/ui/button";
import { ConversationList } from "@/components/admin/chat/ConversationList";
import { useConversations } from "@/hooks/chat/useConversations";
import { ConversationDataListItem } from "@/types/interfaces/api/chat";

type ChatLayoutContextValue = {
  conversations: ConversationDataListItem[];
  isLoading: boolean;
  refetch: () => void;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  currentUserId: number;
  selectedConversationId: number | null;
};

const ChatLayoutContext = createContext<ChatLayoutContextValue | undefined>(
  undefined
);

export const useChatLayout = () => {
  const ctx = useContext(ChatLayoutContext);
  if (!ctx) {
    throw new Error("useChatLayout must be used within ChatLayout");
  }
  return ctx;
};

const getCurrentUserId = (): number => {
  const token = Cookies.get("access_token");
  if (!token) return 0;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.user_id || decoded.sub || 0;
  } catch {
    return 0;
  }
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const [search, setSearch] = useState("");

  const selectedConversationId = useMemo(() => {
    const raw = (params as any)?.id;
    if (!raw) return null;
    const id = Number(raw);
    return Number.isNaN(id) ? null : id;
  }, [params]);

  const currentUserId = useMemo(() => getCurrentUserId(), []);

  const {
    data: conversationsData,
    isLoading,
    refetch,
  } = useConversations({
    search: search || undefined,
    pageSize: 100,
  });

  const conversations = conversationsData?.data || [];

  const handleSelectConversation = (conversation: ConversationDataListItem) => {
    router.push(`/pages/chat/${conversation.id}`, {
      scroll: false,
    });
  };

  const contextValue: ChatLayoutContextValue = {
    conversations,
    isLoading,
    refetch,
    search,
    setSearch,
    currentUserId,
    selectedConversationId,
  };

  return (
    <ChatLayoutContext.Provider value={contextValue}>
      <ProtectedLayout>
        <div className="h-[calc(100vh-32px)] pl-4 flex flex-col">
          <div className="flex-shrink-0 flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Quản lý đoạn chat
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Danh sách hội thoại giữa Buyer và Agent/Manager. Chọn một đoạn
                  chat để xem nội dung và thông tin khách hàng.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-[300px_minmax(0,1fr)] gap-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="h-full overflow-hidden border-r border-gray-200">
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
                search={search}
                onSearchChange={setSearch}
                isLoading={isLoading}
              />
            </div>

            <div className="h-full overflow-hidden">{children}</div>
          </div>
        </div>
      </ProtectedLayout>
    </ChatLayoutContext.Provider>
  );
}
