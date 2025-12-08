// hooks/chat/useMessages.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { ChatApi } from "@/lib/api/chat";
import {
  GetMessagesQuery,
  SendMessageInConversationRequest,
  SendBuyerFirstMessageRequest,
  SendManagerReplyAsAgentRequest,
  MessageItem,
} from "@/types/interfaces/api/chat";

export const useMessages = (
  conversationId: number,
  query?: GetMessagesQuery
) => {
  return useQuery({
    queryKey: ["messages", conversationId, query],
    queryFn: () => ChatApi.getMessagesOfConversation(conversationId, query),
    enabled: !!conversationId,
    staleTime: 10000,
    retry: 1,
  });
};

/**
 * Hook mới: Infinite scroll messages
 * Load messages từ mới nhất trước (page 1), khi scroll lên đầu sẽ load page tiếp theo (messages cũ hơn)
 */
export const useInfiniteMessages = (conversationId: number, pageSize: number = 8) => {
  return useInfiniteQuery({
    queryKey: ["messages-infinite", conversationId],
    queryFn: async ({ pageParam = 1 }) => {
      return ChatApi.getMessagesOfConversation(conversationId, {
        pageIndex: pageParam,
        pageSize,
        sortOrder: "desc", // Lấy messages mới nhất trước
      });
    },
    enabled: !!conversationId,
    getNextPageParam: (lastPage) => {
      // Check if có page tiếp theo dựa vào DefaultPaginationResponse
      if (lastPage.hasMore) {
        return (lastPage.pageIndex || 1) + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      data,
    }: {
      conversationId: number;
      data: SendMessageInConversationRequest;
    }) => ChatApi.sendMessageInConversation(conversationId, data),
    retry: 0,
    onSuccess: (response, variables) => {
      // Thêm message mới vào cache thay vì refetch
      queryClient.setQueryData(
        ["messages-infinite", variables.conversationId],
        (old: any) => {
          if (!old) return old;

          const newMessage = response.content || response;
          const firstPage = old.pages[0];

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                data: [newMessage, ...(firstPage.data || [])],
                totalItems: firstPage.totalItems + 1,
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );

      // Update conversations list
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};

export const useSendBuyerFirstMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendBuyerFirstMessageRequest) =>
      ChatApi.sendBuyerFirstMessage(data),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};

export const useSendManagerReplyAsAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      data,
    }: {
      conversationId: number;
      data: SendManagerReplyAsAgentRequest;
    }) => ChatApi.sendManagerReplyAsAgent(conversationId, data),
    retry: 0,
    onSuccess: (response, variables) => {
      // Thêm message mới vào cache thay vì refetch
      queryClient.setQueryData(
        ["messages-infinite", variables.conversationId],
        (old: any) => {
          if (!old) return old;

          const newMessage = response.message || response;
          const firstPage = old.pages[0];

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                data: [newMessage, ...(firstPage.data || [])],
                totalItems: firstPage.totalItems + 1,
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );

      // Update conversations list
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};
