"use client";

import React from "react";

interface ChatContextType {
  openChatWithMessage: (agentId: number, postId: number, message: string) => void;
  pendingMessage: {
    agentId: number;
    postId: number;
    message: string;
  } | null;
  clearPendingMessage: () => void;
}

const ChatContext = React.createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [pendingMessage, setPendingMessage] = React.useState<{
    agentId: number;
    postId: number;
    message: string;
  } | null>(null);

  const openChatWithMessage = React.useCallback(
    (agentId: number, postId: number, message: string) => {
      setPendingMessage({ agentId, postId, message });
    },
    []
  );

  const clearPendingMessage = React.useCallback(() => {
    setPendingMessage(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        openChatWithMessage,
        pendingMessage,
        clearPendingMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
}
