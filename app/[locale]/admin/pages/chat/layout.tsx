"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useLocale } from "next-intl";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ConversationList } from "@/components/admin/chat/ConversationList";
import {
  ChatLayoutContext,
  ChatLayoutContextValue,
} from "@/components/admin/chat/ChatLayoutContext";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { useConversations } from "@/hooks/chat/useConversations";
import { useSocket } from "@/hooks/chat/useSocket";
import { ConversationDataListItem } from "@/types/interfaces/api/chat";

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
  const locale = useLocale();
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

  const conversations = useMemo(
    () => conversationsData?.data ?? [],
    [conversationsData?.data],
  );

  const handleSelectConversation = (conversation: ConversationDataListItem) => {
    router.push(`/${locale}/admin/pages/chat/${conversation.id}`, {
      scroll: false,
    });
  };

  const socket = useSocket({ autoConnect: true });

  useEffect(() => {
    const cid = selectedConversationId;
    if (!cid || !socket.isConnected) return;

    socket.joinConversation(cid);

    return () => {
      if (socket.isConnected) {
        socket.leaveConversation(cid);
      }
    };
  }, [selectedConversationId, socket, socket.isConnected]);

  const contextValue: ChatLayoutContextValue = useMemo(
    () => ({
      conversations,
      isLoading,
      refetch,
      search,
      setSearch,
      currentUserId,
      selectedConversationId,
      socket,
    }),
    [
      conversations,
      isLoading,
      refetch,
      search,
      setSearch,
      currentUserId,
      selectedConversationId,
      socket,
    ],
  );

  return (
    <ChatLayoutContext.Provider value={contextValue}>
      <ProtectedLayout>
        <div className="flex h-[calc(100vh-32px)] flex-col overflow-hidden">
          <AdminPageHeader
            title="Quản lý đoạn chat"
            description="Danh sách hội thoại giữa Buyer và Agent/Manager. Chọn một đoạn chat để xem nội dung và thông tin khách hàng."
          />

          <div className="m-4 grid min-h-0 flex-1 grid-cols-[300px_minmax(0,1fr)] gap-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
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
