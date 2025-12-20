"use client";

import { NewsApi } from "@/lib/api/news";
import {
  CreateTopicRequest,
  NewsTopicData,
  UpdateTopicRequest,
} from "@/types/interfaces/api/news";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const newsTopicsKey = {
  all: ["news-topics"] as const,
  list: () => [...newsTopicsKey.all, "list"] as const,
  detail: (id: number) => [...newsTopicsKey.all, "detail", id] as const,
};

/**
 * Get all news topics
 * With staleTime of 5 minutes - won't refetch unless manually triggered or stale
 */
export function useNewsTopics() {
  return useQuery<NewsTopicData[]>({
    queryKey: newsTopicsKey.list(),
    queryFn: () => NewsApi.getAllTopics(),
    staleTime: 5 * 60_000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * Get single news topic by ID
 */
export function useNewsTopicDetail(id: number) {
  return useQuery<NewsTopicData>({
    queryKey: newsTopicsKey.detail(id),
    queryFn: () => NewsApi.getOneTopic(id),
    staleTime: 5 * 60_000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!id,
  });
}

/**
 * Create a new topic (Admin only)
 */
export function useCreateTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTopicRequest) => NewsApi.createTopic(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: newsTopicsKey.all });
    },
  });
}

/**
 * Update a topic (Admin only)
 */
export function useUpdateTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: UpdateTopicRequest }) =>
      NewsApi.updateTopic(payload.id, payload.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: newsTopicsKey.all });
      qc.invalidateQueries({ queryKey: newsTopicsKey.detail(variables.id) });
    },
  });
}

/**
 * Delete a topic (Admin only)
 */
export function useDeleteTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => NewsApi.deleteTopic(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: newsTopicsKey.all });
    },
  });
}