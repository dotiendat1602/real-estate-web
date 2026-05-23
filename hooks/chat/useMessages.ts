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
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["chatbot-messages-infinite"] });

      const tempId = Date.now();
      const timestamp = new Date().toISOString();

      queryClient.setQueryData(["chatbot-messages-infinite"], (old: any) => {
        const firstPage = old?.pages?.[0] ?? { data: [], totalItems: 0 };
        const pages = old?.pages ?? [firstPage];

        const optimisticUserMessage: ChatBotMessageItem = {
          id: tempId,
          chatbotConversationId: 0,
          senderType: "USER",
          content: variables.message,
          metadata: null,
          createdAt: timestamp,
          updatedAt: timestamp,
          deletedAt: null,
        };

        return {
          ...(old ?? {
            pageIndex: 1,
            totalPages: 1,
            totalItems: 0,
            hasMore: false,
            paging: true,
          }),
          pages: [
            {
              ...firstPage,
              data: [optimisticUserMessage, ...(firstPage.data || [])],
              totalItems: (firstPage.totalItems || 0) + 1,
            },
            ...pages.slice(1),
          ],
        };
      });

      return { tempId };
    },
    onSuccess: (response, variables, context) => {
      // Thêm message mới vào cache
      queryClient.setQueryData(
        ["chatbot-messages-infinite"],
        (old: any) => {
          const firstPage = old?.pages?.[0] ?? { data: [], totalItems: 0 };
          const pages = old?.pages ?? [firstPage];
          const timestamp = response.metadata?.timestamp ?? new Date().toISOString();

          const userMessage: ChatBotMessageItem = {
            id: response.userMessageId,
            chatbotConversationId: response.conversationId,
            senderType: "USER",
            content: variables.message,
            metadata: null,
            createdAt: timestamp,
            updatedAt: timestamp,
            deletedAt: null,
          };

          const botMessage: ChatBotMessageItem = {
            id: response.botMessageId,
            chatbotConversationId: response.conversationId,
            senderType: "CHATBOT",
            content: response.answer,
            metadata: {
              citations: response.citations ?? [],
              citationCount: response.citations?.length ?? 0,
            },
            createdAt: timestamp,
            updatedAt: timestamp,
            deletedAt: null,
          };

          const existingIds = new Set(
            pages.flatMap((page: any) =>
              (page.data || []).map((message: ChatBotMessageItem) => message.id)
            )
          );
          const newMessages = [botMessage, userMessage].filter((message) => !existingIds.has(message.id));
          const withoutOptimistic = (firstPage.data || []).filter(
            (message: ChatBotMessageItem) => message.id !== context?.tempId
          );

          return {
            ...(old ?? {
              pageIndex: 1,
              totalPages: 1,
              totalItems: 0,
              hasMore: false,
              paging: true,
            }),
            pages: [
              {
                ...firstPage,
                data: [...newMessages, ...withoutOptimistic],
                totalItems: Math.max(
                  0,
                  (firstPage.totalItems || 0) + newMessages.length - (context?.tempId ? 1 : 0)
                ),
              },
              ...pages.slice(1),
            ],
          };
        }
      );
    },
    onError: (_error, _variables, context) => {
      const timestamp = new Date().toISOString();
      const fallbackBotMessage: ChatBotMessageItem = {
        id: (context?.tempId ?? Date.now()) + 1,
        chatbotConversationId: 0,
        senderType: "CHATBOT",
        content:
          "Xin lỗi, hiện tôi chưa nhận được phản hồi từ hệ thống AI. Bạn vui lòng thử gửi lại sau ít phút.",
        metadata: {
          citations: [],
          citationCount: 0,
        },
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
      };

      queryClient.setQueryData(["chatbot-messages-infinite"], (old: any) => {
        const firstPage = old?.pages?.[0] ?? { data: [], totalItems: 0 };
        const pages = old?.pages ?? [firstPage];
        const exists = pages.some((page: any) =>
          (page.data || []).some((message: ChatBotMessageItem) => message.id === fallbackBotMessage.id)
        );

        if (exists) return old;

        return {
          ...(old ?? {
            pageIndex: 1,
            totalPages: 1,
            totalItems: 0,
            hasMore: false,
            paging: true,
          }),
          pages: [
            {
              ...firstPage,
              data: [fallbackBotMessage, ...(firstPage.data || [])],
              totalItems: (firstPage.totalItems || 0) + 1,
            },
            ...pages.slice(1),
          ],
        };
      });
    },
  });
};
