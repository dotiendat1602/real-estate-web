"use client";

import { PostsApi } from "@/lib/api/post";
import {
  CreatePostRequest,
  FavoritesPostListQuery,
  FavoritesPostListResponse,
  PostListQuery,
  PostListResponse,
  PublicPostListQuery,
  PublicPostListResponse,
  ReportPostRequest,
  UpdatePostRequest,
  PostDetailResponse,
  ReportListQuery,
  ReportListResponse,
  UpdateReportRequest,
} from "@/types/interfaces/api/post";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const postsKey = {
  all: ["post"] as const,
  list: (q: PostListQuery = {}) => [...postsKey.all, "list", q] as const,
  detail: (id: number) => [...postsKey.all, "detail", id] as const,

  // Public posts
  publicAll: ["post", "public"] as const,
  publicList: (q: PublicPostListQuery = {}) => [...postsKey.publicAll, "list", q] as const,
  publicDetail: (id: number, userId?: number) => [...postsKey.publicAll, "detail", id, userId] as const,

  // Favorites
  favoritesAll: ["post", "favorites"] as const,
  favoritesList: (q: FavoritesPostListQuery = {}) => [...postsKey.favoritesAll, "list", q] as const,

  // Reports
  reportsAll: ["post", "reports"] as const,
  reportsList: (q: ReportListQuery = {}) => [...postsKey.reportsAll, "list", q] as const,
};

// ============= ADMIN HOOKS =============

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
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!postId,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostRequest) => PostsApi.createPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postsKey.all });
      qc.invalidateQueries({ queryKey: postsKey.publicAll });
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
      qc.invalidateQueries({ queryKey: postsKey.publicAll });
      qc.invalidateQueries({ queryKey: postsKey.publicDetail(variables.id) });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PostsApi.deletePost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postsKey.all });
      qc.invalidateQueries({ queryKey: postsKey.publicAll });
    },
  });
}

export function useRestorePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PostsApi.restorePost(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: postsKey.all });
      qc.invalidateQueries({ queryKey: postsKey.detail(id) });
    },
  });
}

export function useApprovePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PostsApi.approvePost(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: postsKey.all });
      qc.invalidateQueries({ queryKey: postsKey.detail(id) });
      qc.invalidateQueries({ queryKey: postsKey.publicAll });
      qc.invalidateQueries({ queryKey: postsKey.publicDetail(id) });
    },
  });
}

export function useRejectPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; reason: string }) =>
      PostsApi.rejectPost(payload.id, payload.reason),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: postsKey.all });
      qc.invalidateQueries({ queryKey: postsKey.detail(variables.id) });
      qc.invalidateQueries({ queryKey: postsKey.publicDetail(variables.id) });
    },
  });
}

export function useArchivePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PostsApi.archivePost(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: postsKey.all });
      qc.invalidateQueries({ queryKey: postsKey.detail(id) });
      qc.invalidateQueries({ queryKey: postsKey.publicAll });
      qc.invalidateQueries({ queryKey: postsKey.publicDetail(id) });
    },
  });
}

// ============= PUBLIC HOOKS =============

export function usePublicPosts(query: PublicPostListQuery) {
  return useQuery<PublicPostListResponse>({
    queryKey: postsKey.publicList(query),
    queryFn: () => PostsApi.getPublicPosts(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function usePublicPostDetail(postId: number, userId?: number) {
  return useQuery({
    queryKey: postsKey.publicDetail(postId),
    queryFn: () => PostsApi.getOnePublicPost(postId, userId),
    staleTime: 60_000,
    enabled: !!postId,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useReports(query: ReportListQuery) {
  return useQuery<ReportListResponse>({
    queryKey: postsKey.reportsList(query),
    queryFn: () => PostsApi.getListReports(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useReportPost() {
  return useMutation({
    mutationFn: (payload: { postId: number; data: ReportPostRequest }) =>
      PostsApi.reportPost(payload.postId, payload.data),
  });
}

export function useUpdateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { reportId: number; data: UpdateReportRequest }) =>
      PostsApi.updateReport(payload.reportId, payload.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postsKey.reportsAll });
    },
  });
}

// ============= FAVORITES HOOKS =============

export function useFavoritesPosts(query: FavoritesPostListQuery) {
  return useQuery<FavoritesPostListResponse>({
    queryKey: postsKey.favoritesList(query),
    queryFn: () => PostsApi.getFavoritesPosts(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => PostsApi.toggleFavorite(postId),
    onSuccess: (_data, postId) => {
      qc.invalidateQueries({ queryKey: postsKey.favoritesAll });
      qc.invalidateQueries({
        queryKey: [...postsKey.publicAll, "detail", postId],
        exact: false,
      });
    },
  });
}
