"use client";

import React, { createContext, useContext, Dispatch, SetStateAction } from "react";
import type { ConversationDataListItem } from "@/types/interfaces/api/chat";
import type { useSocket } from "@/hooks/chat/useSocket";

export type ChatLayoutContextValue = {
  conversations: ConversationDataListItem[];
  isLoading: boolean;
  refetch: () => void;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  currentUserId: number;
  selectedConversationId: number | null;
  socket: ReturnType<typeof useSocket>;
};

export const ChatLayoutContext = createContext<ChatLayoutContextValue | undefined>(
  undefined
);

export const useChatLayout = () => {
  const ctx = useContext(ChatLayoutContext);
  if (!ctx) throw new Error("useChatLayout must be used within ChatLayout");
  return ctx;
};
