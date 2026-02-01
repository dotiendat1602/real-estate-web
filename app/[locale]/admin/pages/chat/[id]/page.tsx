"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChatWindow } from "@/components/admin/chat/ChatWindow";
import { ConversationInfo } from "@/components/admin/chat/ConversationInfo";
import { useChatLayout } from "@/components/admin/chat/ChatLayoutContext";
import { useLocale } from "next-intl";

export default function ChatDetailPage() {
  const router = useRouter();
  const locale = useLocale();
  const {
    conversations,
    selectedConversationId,
    currentUserId,
    isLoading,
  } = useChatLayout();

  const selectedConversation = useMemo(() => {
    if (!selectedConversationId) return null;
    return (
      conversations.find(
        (c) => c.id === selectedConversationId
      ) || null
    );
  }, [conversations, selectedConversationId]);

  // Nếu đã load list xong mà không tìm thấy conversation -> quay lại trang list
  useEffect(() => {
    if (!isLoading && selectedConversationId && !selectedConversation) {
      router.push(`/${locale}/pages/chat`);
    }
  }, [isLoading, selectedConversationId, selectedConversation, router, locale]);

  // if (!selectedConversationId || !selectedConversation) {
  //   return (
  //     <div className="flex h-full items-center justify-center text-sm text-gray-500">
  //       Đang tải thông tin đoạn chat...
  //     </div>
  //   );
  // }

  return (
    <div className="grid h-full grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)] gap-0">
      <div className="h-full overflow-hidden">
        <ChatWindow
          conversation={selectedConversation}
          currentUserId={currentUserId}
        />
      </div>

      <div className="h-full overflow-hidden border-l border-gray-200 bg-gray-50">
        <ConversationInfo conversation={selectedConversation} />
      </div>
    </div>
  );
}
