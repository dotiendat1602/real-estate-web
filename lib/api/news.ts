// d:\Real-estate\real-estate-web\lib\api\news.ts
import {
  ArticleListQuery,
  ArticleListResponse,
  CreateArticleRequest,
  CreateTopicRequest,
  NewsArticleData,
  NewsletterSubscribeRequest,
  NewsletterSubscribeResponse,
  NewsTopicData,
  SavedArticleData,
  ToggleSaveResponse,
  UpdateArticleRequest,
  UpdateTopicRequest,
} from "@/types/interfaces/api/news";
import { sendDelete, sendGet, sendPatch, sendPost, sendPut } from "./axios";

export const NewsApi = {
  // ==================== TOPICS ====================

  /**
   * Create a new news topic (Admin only)
   */
  createTopic: async (data: CreateTopicRequest): Promise<NewsTopicData> => {
    try {
      const response = await sendPost("/api/core/v1/news/topics", data);
      return response.data as NewsTopicData;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all news topics
   */
  getAllTopics: async (): Promise<NewsTopicData[]> => {
    try {
      const response = await sendGet("/api/core/v1/news/topics");
      return response.data as NewsTopicData[];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single topic by ID
   */
  getOneTopic: async (id: number): Promise<NewsTopicData> => {
    try {
      const response = await sendGet(`/api/core/v1/news/topics/${id}`);
      return response.data as NewsTopicData;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a topic (Admin only)
   */
  updateTopic: async (id: number, data: UpdateTopicRequest): Promise<NewsTopicData> => {
    try {
      const response = await sendPut(`/api/core/v1/news/topics/${id}`, data);
      return response.data as NewsTopicData;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a topic (Admin only)
   */
  deleteTopic: async (id: number): Promise<NewsTopicData> => {
    try {
      const response = await sendDelete(`/api/core/v1/news/topics/${id}`);
      return response.data as NewsTopicData;
    } catch (error) {
      throw error;
    }
  },

  // ==================== ARTICLES ====================

  /**
   * Create a new article (Admin only)
   */
  createArticle: async (data: CreateArticleRequest): Promise<NewsArticleData> => {
    try {
      const response = await sendPost("/api/core/v1/news/articles", data);
      return response.data as NewsArticleData;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all articles with filters and pagination
   */
  getAllArticles: async (query?: ArticleListQuery): Promise<ArticleListResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
      if (query?.topicId) qs.set("topicId", String(query.topicId));
      if (query?.status) qs.set("status", query.status);
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.sortKey) qs.set("sortKey", query.sortKey);
      if (query?.sortOrder) qs.set("sortOrder", query.sortOrder);

      const url = `/api/core/v1/news/articles${qs.toString() ? `?${qs.toString()}` : ""}`;

      const response = await sendGet(url);
      return response.data as ArticleListResponse;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single article by ID
   */
  getOneArticle: async (id: number): Promise<NewsArticleData> => {
    try {
      const response = await sendGet(`/api/core/v1/news/articles/${id}`);
      return response.data as NewsArticleData;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an article (Admin only)
   */
  updateArticle: async (id: number, data: UpdateArticleRequest): Promise<NewsArticleData> => {
    try {
      const response = await sendPut(`/api/core/v1/news/articles/${id}`, data);
      return response.data as NewsArticleData;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete an article (Admin only)
   */
  deleteArticle: async (id: number): Promise<NewsArticleData> => {
    try {
      const response = await sendDelete(`/api/core/v1/news/articles/${id}`);
      return response.data as NewsArticleData;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Toggle featured status of an article (Admin only)
   */
  toggleFeatured: async (id: number): Promise<NewsArticleData> => {
    try {
      const response = await sendPatch(`/api/core/v1/news/articles/${id}/toggle-featured`);
      return response.data as NewsArticleData;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Publish an article (Admin only)
   */
  publishArticle: async (id: number): Promise<NewsArticleData> => {
    try {
      const response = await sendPatch(`/api/core/v1/news/articles/${id}/publish`);
      return response.data as NewsArticleData;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Unpublish an article (Admin only)
   */
  unpublishArticle: async (id: number): Promise<NewsArticleData> => {
    try {
      const response = await sendPatch(`/api/core/v1/news/articles/${id}/unpublish`);
      return response.data as NewsArticleData;
    } catch (error) {
      throw error;
    }
  },

  // ==================== SAVED ARTICLES (User) ====================

  /**
   * Toggle save/unsave an article (Authenticated users)
   */
  toggleSaveArticle: async (id: number): Promise<ToggleSaveResponse> => {
    try {
      const response = await sendPost(`/api/core/v1/news/articles/${id}/toggle-save`);
      return response.data as ToggleSaveResponse;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all saved articles of the current user (Authenticated users)
   */
  getAllSavedArticles: async (): Promise<SavedArticleData[]> => {
    try {
      const response = await sendGet("/api/core/v1/news/saved-articles");
      return response.data as SavedArticleData[];
    } catch (error) {
      throw error;
    }
  },

  // ==================== NEWSLETTER ====================

  subscribeNewsletter: async (data: NewsletterSubscribeRequest): Promise<NewsletterSubscribeResponse> => {
    try {
      const response = await sendPost("/api/core/v1/news/newsletter", data);
      return response.data as NewsletterSubscribeResponse;
    } catch (error) {
      throw error;
    }
  },
};
