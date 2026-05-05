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
  topK?: number;
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
  postId?: number | null;
  propertyId?: number | null;
  postType?: string | null;
  categoryName?: string | null;
  city?: string | null;
  district?: string | null;
  ward?: string | null;
  price?: string | number | null;
  area?: string | number | null;
  bedrooms?: number | null;
  amenities?: string[];
  snippet?: string | null;
  postTitle?: string | null;
  location?: string | null;
  province?: string | null;
  imageUrl?: string | null;
  score?: number | null;
  title?: string | null;
  format?: string | null;
  sourceUrl?: string | null;
  documentScope?: string | null;
  documentType?: string | null;
  dossierCode?: string | null;
  planYear?: number | null;
  chunkType?: string | null;
  chunkIndex?: number | null;
  globalChunkIndex?: number | null;
  pageNumber?: number | null;
  lineStart?: number | null;
  lineEnd?: number | null;
  sourceLocator?: string | null;
  chunker?: string | null;
  planningDocumentId?: number | null;
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
  conversationId: number;
  userMessageId: number;
  botMessageId: number;
  answer: string;
  citations: ChatBotCitation[];
  metadata: ChatBotMetadata;
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
