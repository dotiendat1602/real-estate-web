"use client";

import { PostsApi } from "@/lib/api/post";
import { CreatePostRequest, PostListQuery, PostListResponse, UpdatePostRequest } from "@/types/interfaces/api/post";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const postsKey = {
  all: ["post"] as const,
  list: (q: PostListQuery = {}) => [...postsKey.all, "list", q] as const,
  detail: (id: number) => [...postsKey.all, "detail", id] as const,
};

export function usePosts(query: PostListQuery) {
  return useQuery<PostListResponse>({
    queryKey: postsKey.list(query),
    queryFn: () => PostsApi.getListPost(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function usePostDetail(postId: number) {
  return useQuery({
    queryKey: postsKey.detail(postId),
    queryFn: () => PostsApi.getOnePost(postId),
    staleTime: 60_000,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostRequest) =>
      PostsApi.createPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postsKey.all });
    },
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: UpdatePostRequest }) =>
      PostsApi.updatePost(payload.id, payload.data),
    onSuccess: (_data, variables) => {
      // Invalidate list + detail
      qc.invalidateQueries({ queryKey: postsKey.all });
      qc.invalidateQueries({ queryKey: postsKey.detail(variables.id) });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PostsApi.deletePost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postsKey.all });
    },
  });
}
