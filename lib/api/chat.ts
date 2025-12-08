import {
  ConversationListQuery,
  ConversationListResponse,
  SendBuyerFirstMessageRequest,
  SendBuyerFirstMessageResponse,
  SendMessageInConversationRequest,
  SendMessageInConversationResponse,
  SendManagerReplyAsAgentRequest,
  SendManagerReplyAsAgentResponse,
  GetMessagesQuery,
  MessageListResponse,
  ConversationDetail,
} from "@/types/interfaces/api/chat";
import { sendGet, sendPost } from "./axios";

export const ChatApi = {
  /**
   * Lấy danh sách conversations
   */
  getAllConversations: async (
    query?: ConversationListQuery
  ): Promise<ConversationListResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.pageIndex) qs.set("pageIndex", query.pageIndex.toString());
      if (query?.pageSize) qs.set("pageSize", query.pageSize.toString());
      if (query?.sortKey) qs.set("sortKey", query.sortKey);
      if (query?.sortOrder) qs.set("sortOrder", query.sortOrder);
      if (query?.search) qs.set("search", query.search);
      if (query?.postId) qs.set("postId", query.postId.toString());
      if (query?.buyerId) qs.set("buyerId", query.buyerId.toString());
      if (query?.agentId) qs.set("agentId", query.agentId.toString());

      const url = `/api/core/v1/chat/conversations${qs.toString() ? `?${qs.toString()}` : ""
        }`;

      const response = await sendGet(url);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một conversation
   */
  getConversation: async (
    conversationId: number
  ): Promise<ConversationDetail> => {
    try {
      const response = await sendGet(
        `/api/core/v1/chat/conversations/${conversationId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy danh sách messages của một conversation
   */
  getMessagesOfConversation: async (
    conversationId: number,
    query?: GetMessagesQuery
  ): Promise<MessageListResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.pageIndex) qs.set("pageIndex", query.pageIndex.toString());
      if (query?.pageSize) qs.set("pageSize", query.pageSize.toString());
      if (query?.sortKey) qs.set("sortKey", query.sortKey);
      if (query?.sortOrder) qs.set("sortOrder", query.sortOrder);

      const url = `/api/core/v1/chat/conversations/${conversationId}/messages${qs.toString() ? `?${qs.toString()}` : ""
        }`;

      const response = await sendGet(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Buyer gửi message đầu tiên (tự động tạo conversation)
   */
  sendBuyerFirstMessage: async (
    data: SendBuyerFirstMessageRequest
  ): Promise<SendBuyerFirstMessageResponse> => {
    const response = await sendPost(
      "/api/core/v1/chat/buyer/send-first-message",
      data
    );
    return response.data;
  },

  /**
   * Gửi message trong conversation đã có
   */
  sendMessageInConversation: async (
    conversationId: number,
    data: SendMessageInConversationRequest
  ): Promise<SendMessageInConversationResponse> => {
    const response = await sendPost(
      `/api/core/v1/chat/conversations/${conversationId}/messages`,
      data
    );
    return response.data;
  },

  /**
   * Manager reply as agent
   */
  sendManagerReplyAsAgent: async (
    conversationId: number,
    data: SendManagerReplyAsAgentRequest
  ): Promise<SendManagerReplyAsAgentResponse> => {
    const response = await sendPost(
      `/api/core/v1/chat/conversations/${conversationId}/reply-as-agent`,
      data
    );
    return response.data;
  },
};
