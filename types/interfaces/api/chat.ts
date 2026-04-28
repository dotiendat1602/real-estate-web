import { PostStatus, PostType } from "@/types/enums/post";
import { DefaultPaginationResponse } from "../common";

// ============================================================================
// Query & List Interfaces
// ============================================================================

export interface ConversationListQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  postId?: number;
  buyerId?: number;
  agentId?: number;
}

export interface ConversationListResponse extends DefaultPaginationResponse {
  data: ConversationDataListItem[];
}

export interface ConversationDataListItem {
  id: number;
  postId: number | null;
  buyerId: number | null;
  agentId: number | null;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  post: PostInConversation;
  buyer: UserInConversation;
  agent: UserInConversation;
  messages: MessageItem[];
}

export interface PostInConversation {
  id: number;
  propertyId: number;
  postTitle: string;
  postType: PostType | null;
  postContent: string | null;
  postStatus: PostStatus | null;
  approvedById: number | null;
  approvedAt: Date | null;
  rejectedById: number | null;
  rejectReason: string | null;
  publishedAt: Date | null;
  createdById: number;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface UserInConversation {
  id: number;
  roleId: number;
  email: string;
  name: string | null;
  password: string;
  phone: string | null;
  lastLogin: Date | null;
  status: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// ============================================================================
// Message Interfaces
// ============================================================================

export interface MessageItem {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface GetMessagesQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
}

export interface MessageListResponse extends DefaultPaginationResponse {
  data: MessageItem[];
}

// ============================================================================
// Request Interfaces
// ============================================================================

export interface SendBuyerFirstMessageRequest {
  postId: number;
  agentId: number;
  content: string;
}

export interface SendMessageInConversationRequest {
  senderId: number;
  content: string;
}

export interface SendManagerReplyAsAgentRequest {
  content: string;
}

export interface ChatBotRequest {
  message: string;
}

// ============================================================================
// Response Interfaces
// ============================================================================

export interface SendBuyerFirstMessageResponse {
  conversation: ConversationDetail;
  message: MessageItem;
}

export interface SendMessageInConversationResponse extends MessageItem { }

export interface SendManagerReplyAsAgentResponse {
  conversation: ConversationDetail;
  message: MessageItem;
}

export interface ConversationDetail {
  id: number;
  postId: number | null;
  buyerId: number | null;
  agentId: number | null;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface GetConversationResponse extends ConversationDetail { }

export interface ChatBotCitation {
  postId: number;
  propertyId: number;
  postType: string;
  categoryName: string;
  city: string;
  district: string;
  ward: string;
  price: string;
  area: string;
  bedrooms: number;
  amenities: string[];
  snippet: string;
  postTitle: string;
  location: string;
  province: string;
}

export interface ChatBotMetadata {
  userId: number;
  timestamp: string;
  topK: number;
}

export interface ChatBotMessageItem {
  id: number;
  chatbotConversationId: number;
  senderType: "USER" | "CHATBOT";
  content: string;
  metadata: {
    topK?: number;
    citations?: ChatBotCitation[];
    citationCount?: number;
  } | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ChatBotMessagesQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
}

export interface ChatBotMessagesListResponse extends DefaultPaginationResponse {
  data: ChatBotMessageItem[];
}

export interface SendChatBotMessageResponse {
  data: {
    conversationId: number;
    userMessageId: number;
    botMessageId: number;
    answer: string;
    citations: ChatBotCitation[];
    metadata: ChatBotMetadata;
  };
  timestamp: string;
  path: string;
  traceId: string;
}

// ============================================================================
// WebSocket Interfaces
// ============================================================================

export interface SocketMessage {
  message_id: number | null;
  conversation_id: number;
  senderId: number;
  content: string;
  createdAt: string;
}

export interface JoinConversationPayload {
  conversationId: number;
}

export interface LeaveConversationPayload {
  conversationId: number;
}

export interface SendMessagePayload {
  conversationId: number;
  senderId: number;
  content: string;
  tempId?: string;
}

export interface TypingPayload {
  conversationId: number;
  userId: number;
}

export interface NewMessageEvent {
  message: SocketMessage;
  tempId: string | null;
}

export interface MessageSentEvent {
  conversationId: number;
  tempId: string | null;
}

export interface TypingEvent {
  conversationId: number;
  userId: number;
}

export interface JoinedConversationEvent {
  conversationId: number;
}

export interface LeftConversationEvent {
  conversationId: number;
}