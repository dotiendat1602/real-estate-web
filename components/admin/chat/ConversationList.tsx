// components/chat/ConversationList.tsx - Update để có scroll riêng
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { ConversationDataListItem } from "@/types/interfaces/api/chat";
import { format } from "date-fns";

interface ConversationListProps {
  conversations: ConversationDataListItem[];
  selectedConversationId: number | null;
  onSelectConversation: (conversation: ConversationDataListItem) => void;
  search: string;
  onSearchChange: (search: string) => void;
  isLoading?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  search,
  onSearchChange,
  isLoading,
}) => {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Search - Fixed */}
      <div className="flex-shrink-0 border-b border-gray-200 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm..."
            className="h-9 pl-9 text-sm"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}

        {!isLoading && conversations.length === 0 && (
          <div className="p-4 text-center text-sm text-gray-500">
            Không có cuộc hội thoại nào
          </div>
        )}

        {!isLoading &&
          conversations.map((conversation) => {
            const isSelected = conversation.id === selectedConversationId;
            const lastMessage = conversation.messages?.[0];

            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={cn(
                  "w-full border-b border-gray-200 px-3 py-3 text-left transition-colors hover:bg-gray-50",
                  isSelected && "bg-blue-50 hover:bg-blue-50"
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-1 h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 text-center text-xs leading-8 text-gray-600">
                    {conversation.buyer?.name?.charAt(0) || "B"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {conversation.buyer?.name || "Unknown"}
                      </p>
                      {conversation.updatedAt && (
                        <span className="flex-shrink-0 text-[11px] text-gray-400">
                          {format(new Date(conversation.updatedAt), "HH:mm")}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {conversation.post?.postTitle || "—"}
                    </p>
                    {lastMessage && (
                      <p className="mt-1 truncate text-xs text-gray-400">
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
};