import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { ChatApi } from "@/lib/api/chat";
import {
  GetMessagesQuery,
  SendMessageInConversationRequest,
  SendBuyerFirstMessageRequest,
  SendManagerReplyAsAgentRequest,
  MessageItem,
  ChatBotRequest,
  ChatBotMessageItem,
} from "@/types/interfaces/api/chat";
import { softUpdateConversationsCache } from "@/lib/utils";

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
    enabled: conversationId > 0,
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
      const raw = (response as any)?.message ?? response;

      const msg: MessageItem = {
        id: raw?.id ?? raw?.message_id,
        conversationId: variables.conversationId,
        senderId: raw?.senderId ?? raw?.sender_id,
        content:
          raw?.content ??
          (typeof raw?.message === "string" ? raw.message : undefined) ??
          raw?.message?.content ??
          "",
        createdAt: raw?.createdAt ?? raw?.created_at ?? new Date().toISOString(),
      };

      // ✅ CẬP NHẬT: Thêm message vào infinite query cache
      queryClient.setQueryData(
        ["messages-infinite", variables.conversationId],
        (old: any) => {
          if (!old?.pages) return old;

          // Kiểm tra xem message đã tồn tại chưa
          const exists = old.pages.some((page: any) =>
            (page.data || []).some((m: MessageItem) => m.id === msg.id)
          );
          if (exists) return old;

          const firstPage = old.pages?.[0] ?? { data: [], totalItems: 0 };

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                data: [msg, ...(firstPage.data || [])],
                totalItems: (firstPage.totalItems || 0) + 1,
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );

      // Cập nhật conversations cache
      softUpdateConversationsCache(queryClient, variables.conversationId, msg);
    }
  });
};

/**
 * Hook cho user/agent: Lấy messages của conversations mình tham gia
 */
export const useUserInfiniteMessages = (
  conversationId: number,
  pageSize: number = 20,
  options?: { enabled?: boolean }
) => {
  return useInfiniteQuery({
    queryKey: ["user-messages-infinite", conversationId],
    queryFn: async ({ pageParam = 1 }) => {
      return ChatApi.getUserConversationMessages(conversationId, {
        pageIndex: pageParam,
        pageSize,
        sortOrder: "desc",
      });
    },
    enabled: options?.enabled !== false && !!conversationId,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchInterval: false,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.pageIndex || 1) + 1 : undefined,
    initialPageParam: 1,
    staleTime: 30000,
  });
};

/**
 * Hook cho user/agent: Gửi message trong conversation
 */
export const useUserSendMessage = () => {
  return useMutation({
    mutationFn: ({
      conversationId,
      data,
    }: {
      conversationId: number;
      data: SendMessageInConversationRequest;
    }) => ChatApi.sendMessageInConversation(conversationId, data),
    retry: 0,
    onSuccess: (response, variables) => { },
  });
};

export const useChatBotInfiniteMessages = (
  pageSize: number = 10,
  options?: { enabled?: boolean }
) => {
  return useInfiniteQuery({
    queryKey: ["chatbot-messages-infinite"],
    queryFn: async ({ pageParam = 1 }) => {
      return ChatApi.getChatBotMessages({
        pageIndex: pageParam,
        pageSize,
        sortKey: "createdAt",
        sortOrder: "desc",
      });
    },
    enabled: options?.enabled !== false,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchInterval: false,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.pageIndex || 1) + 1 : undefined,
    initialPageParam: 1,
    staleTime: 30000,
  });
};

/**
 * Hook: Gửi message tới chatbot
 */
export const useSendChatBotMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChatBotRequest) => ChatApi.sendMessageChatBot(data),
    retry: 0,
    onSuccess: (response) => {
      // Thêm message mới vào cache
      queryClient.setQueryData(
        ["chatbot-messages-infinite"],
        (old: any) => {
          if (!old?.pages) return old;

          const userMessage: ChatBotMessageItem = {
            id: response.data.userMessageId,
            chatbotConversationId: response.data.conversationId,
            senderType: "USER",
            content: "", // Sẽ được cập nhật từ UI
            metadata: {
              topK: response.data.metadata.topK,
            },
            createdAt: response.data.metadata.timestamp,
            updatedAt: response.data.metadata.timestamp,
            deletedAt: null,
          };

          const botMessage: ChatBotMessageItem = {
            id: response.data.botMessageId,
            chatbotConversationId: response.data.conversationId,
            senderType: "CHATBOT",
            content: response.data.answer,
            metadata: {
              citations: response.data.citations,
              citationCount: response.data.citations.length,
            },
            createdAt: response.data.metadata.timestamp,
            updatedAt: response.data.metadata.timestamp,
            deletedAt: null,
          };

          const firstPage = old.pages?.[0] ?? { data: [], totalItems: 0 };

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                data: [botMessage, userMessage, ...(firstPage.data || [])],
                totalItems: (firstPage.totalItems || 0) + 2,
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );
    },
  });
};
