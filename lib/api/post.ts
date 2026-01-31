import {
  CreatePostRequest,
  FavoritesPostListQuery,
  FavoritesPostListResponse,
  PostDetailResponse,
  PostListQuery,
  PostListResponse,
  PublicPostListQuery,
  PublicPostListResponse,
  ReportPostRequest,
  ReportPostResponse,
  ToggleFavoriteResponse,
  UpdatePostRequest
} from "@/types/interfaces/api/post";
import { sendDelete, sendGet, sendPatch, sendPost } from "./axios";

export const PostsApi = {
  // ============= ADMIN APIs (require auth + permission) =============

  getListPost: async (query?: PostListQuery): Promise<PostListResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.sortKey) qs.set("sortKey", String(query.sortKey));
      if (query?.sortOrder) qs.set("sortOrder", String(query.sortOrder));
      if (query?.status) qs.set("status", query.status);
      if (query?.type) qs.set("type", query.type);

      const url = `/api/core/v1/post${qs.toString() ? `?${qs.toString()}` : ""}`;

      const response = await sendGet(url);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getOnePost: async (postId: number): Promise<PostDetailResponse> => {
    try {
      const response = await sendGet(`/api/core/v1/post/${postId}`);
      return response.data as PostDetailResponse;
    } catch (error) {
      throw error;
    }
  },

  createPost: async (data: CreatePostRequest): Promise<PostDetailResponse> => {
    const response = await sendPost('/api/core/v1/post', data);
    return response.data as PostDetailResponse;
  },

  updatePost: async (postId: number, data: UpdatePostRequest): Promise<PostDetailResponse> => {
    const response = await sendPatch(`/api/core/v1/post/${postId}`, data);
    return response.data as PostDetailResponse;
  },

  deletePost: async (postId: number): Promise<PostDetailResponse> => {
    const response = await sendDelete(`/api/core/v1/post/${postId}`);
    return response.data as PostDetailResponse;
  },

  restorePost: async (postId: number): Promise<PostDetailResponse> => {
    const response = await sendPost(`/api/core/v1/post/restore/${postId}`, {});
    return response.data as PostDetailResponse;
  },

  approvePost: async (postId: number): Promise<PostDetailResponse> => {
    const response = await sendPost(`/api/core/v1/post/approve/${postId}`, {});
    return response.data as PostDetailResponse;
  },

  rejectPost: async (postId: number, reason: string): Promise<PostDetailResponse> => {
    const response = await sendPost(`/api/core/v1/post/reject/${postId}`, { reason });
    return response.data as PostDetailResponse;
  },

  archivePost: async (postId: number): Promise<PostDetailResponse> => {
    const response = await sendPost(`/api/core/v1/post/archive/${postId}`, {});
    return response.data as PostDetailResponse;
  },

  // ============= PUBLIC APIs (no auth required) =============

  getPublicPosts: async (query?: PublicPostListQuery): Promise<PublicPostListResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.sortKey) qs.set("sortKey", String(query.sortKey));
      if (query?.sortOrder) qs.set("sortOrder", String(query.sortOrder));
      if (query?.type) qs.set("type", query.type);

      const url = `/api/core/v1/post/public${qs.toString() ? `?${qs.toString()}` : ""}`;

      const response = await sendGet(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getOnePublicPost: async (postId: number, userId?: number): Promise<PostDetailResponse> => {
    try {
      const response = await sendGet(`/api/core/v1/post/public/${postId}${userId ? `/${userId}` : ''}`);
      return response.data as PostDetailResponse;
    } catch (error) {
      throw error;
    }
  },

  reportPost: async (postId: number, data: ReportPostRequest): Promise<ReportPostResponse> => {
    try {
      const response = await sendPost(`/api/core/v1/post/public/${postId}/reports`, data);
      return response.data as ReportPostResponse;
    } catch (error) {
      throw error;
    }
  },

  // ============= FAVORITES APIs (require auth) =============

  getFavoritesPosts: async (query?: FavoritesPostListQuery): Promise<FavoritesPostListResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));

      const url = `/api/core/v1/post/favorites${qs.toString() ? `?${qs.toString()}` : ""}`;

      const response = await sendGet(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  toggleFavorite: async (postId: number): Promise<ToggleFavoriteResponse> => {
    try {
      const response = await sendPost(`/api/core/v1/post/favorites/${postId}`, {});
      return response.data as ToggleFavoriteResponse;
    } catch (error) {
      throw error;
    }
  },
};
