"use client";

import { NewsApi } from "@/lib/api/news";
import {
  ArticleListQuery,
  ArticleListResponse,
  CreateArticleRequest,
  NewsArticleData,
  UpdateArticleRequest,
} from "@/types/interfaces/api/news";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

export const newsArticlesKey = {
  all: ["news-articles"] as const,
  list: (q: ArticleListQuery = {}) => [...newsArticlesKey.all, "list", q] as const,
  detail: (id: number) => [...newsArticlesKey.all, "detail", id] as const,
  saved: () => [...newsArticlesKey.all, "saved"] as const,
};

/**
 * Get all news articles with filters and pagination
 * With staleTime of 1 minute and keepPreviousData for smooth pagination
 */
export function useNewsArticles(query: ArticleListQuery = {}) {
  return useQuery<ArticleListResponse>({
    queryKey: newsArticlesKey.list(query),
    queryFn: () => NewsApi.getAllArticles(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000, // 1 minute
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * Get single news article by ID
 */
export function useNewsArticleDetail(id: number) {
  return useQuery<NewsArticleData>({
    queryKey: newsArticlesKey.detail(id),
    queryFn: () => NewsApi.getOneArticle(id),
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!id,
  });
}

/**
 * Create a new article (Admin only)
 */
export function useCreateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateArticleRequest) => NewsApi.createArticle(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: newsArticlesKey.all });
    },
  });
}

/**
 * Update an article (Admin only)
 */
export function useUpdateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: UpdateArticleRequest }) =>
      NewsApi.updateArticle(payload.id, payload.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: newsArticlesKey.all });
      qc.invalidateQueries({ queryKey: newsArticlesKey.detail(variables.id) });
    },
  });
}

/**
 * Delete an article (Admin only)
 */
export function useDeleteArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => NewsApi.deleteArticle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: newsArticlesKey.all });
    },
  });
}

/**
 * Toggle featured status (Admin only)
 */
export function useToggleFeaturedArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => NewsApi.toggleFeatured(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: newsArticlesKey.all });
      qc.invalidateQueries({ queryKey: newsArticlesKey.detail(id) });
    },
  });
}

/**
 * Publish an article (Admin only)
 */
export function usePublishArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => NewsApi.publishArticle(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: newsArticlesKey.all });
      qc.invalidateQueries({ queryKey: newsArticlesKey.detail(id) });
    },
  });
}

/**
 * Unpublish an article (Admin only)
 */
export function useUnpublishArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => NewsApi.unpublishArticle(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: newsArticlesKey.all });
      qc.invalidateQueries({ queryKey: newsArticlesKey.detail(id) });
    },
  });
}

/**
 * Toggle save/unsave article (Authenticated users)
 * Invalidates both article lists and saved articles list
 */
export function useToggleSaveArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => NewsApi.toggleSaveArticle(id),
    onSuccess: (_data, id) => {
      // Invalidate saved articles list
      qc.invalidateQueries({ queryKey: newsArticlesKey.saved() });
      // Also invalidate article detail to update save count
      qc.invalidateQueries({ queryKey: newsArticlesKey.detail(id) });
      // Optionally invalidate lists to update save counts
      qc.invalidateQueries({ queryKey: newsArticlesKey.list() });
    },
  });
}

/**
 * Get all saved articles of current user (Authenticated users)
 */
export function useSavedArticles(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: newsArticlesKey.saved(),
    queryFn: () => NewsApi.getAllSavedArticles(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: options?.enabled ?? true,
  });
}
