import { useQuery } from "@tanstack/react-query";
import { ChatApi } from "@/lib/api/chat";
import { ConversationListQuery } from "@/types/interfaces/api/chat";

export const useConversations = (query?: ConversationListQuery) => {
  return useQuery({
    queryKey: ["conversations", query],
    queryFn: () => ChatApi.getAllConversations(query),
    staleTime: 30000,
    retry: 1,
  });
};

export const useConversation = (conversationId: number) => {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => ChatApi.getConversation(conversationId),
    enabled: !!conversationId,
    retry: 1,
  });
};

/**
 * Hook cho user/agent: Lấy conversations của chính mình
 */
export const useUserConversations = (
  query?: ConversationListQuery,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["user-conversations", query],
    queryFn: () => ChatApi.getUserConversations(query),
    retry: 1,
    retryDelay: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 30000,
    enabled: options?.enabled !== false,
  });
};
