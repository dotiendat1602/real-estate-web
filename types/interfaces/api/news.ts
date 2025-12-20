import { DefaultPaginationResponse } from "../common";

// ==================== ENUMS ====================
export enum NewsStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

// ==================== TOPICS ====================
export interface NewsTopicData {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  _count: {
    articles: number;
  };
}

export interface CreateTopicRequest {
  name: string;
}

export interface UpdateTopicRequest {
  name?: string;
}

// ==================== ARTICLES ====================
export interface NewsArticleData {
  id: number;
  topicId: number;
  title: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  readMin?: number;
  status: NewsStatus;
  publishedAt?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  topic: {
    id: number;
    name: string;
  };
  _count: {
    savedBy: number;
  };
}

export interface ArticleListQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  topicId?: number;
  status?: NewsStatus;
  search?: string;
}

export interface ArticleListResponse extends DefaultPaginationResponse {
  data: NewsArticleData[];
}

export interface CreateArticleRequest {
  topicId: number;
  title: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  readMin?: number;
  status?: NewsStatus;
  isFeatured?: boolean;
}

export interface UpdateArticleRequest {
  topicId?: number;
  title?: string;
  excerpt?: string;
  content?: string;
  cover?: string;
  readMin?: number;
  status?: NewsStatus;
  isFeatured?: boolean;
}

// ==================== SAVED ARTICLES ====================
export interface SavedArticleData {
  userId: number;
  articleId: number;
  createdAt: string;
  article: NewsArticleData;
}

export interface ToggleSaveResponse {
  message: string;
}