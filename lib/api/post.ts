import { CreatePostRequest, PostDetailResponse, PostListQuery, PostListResponse, UpdatePostRequest } from "@/types/interfaces/api/post";
import { sendDelete, sendGet, sendPatch, sendPost } from "./axios";

export const PostsApi = {
  getListPost: async (query?: PostListQuery): Promise<PostListResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
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
}
