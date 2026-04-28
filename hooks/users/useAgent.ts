"use client";

import { UsersApi } from "@/lib/api/user";
import { AgentResponse, FeaturedAgentsQuery, FeaturedAgentsResponse } from "@/types/interfaces/api/user";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const agentKeys = {
  all: ["agents"] as const,
  featured: (q: FeaturedAgentsQuery = {}) => [...agentKeys.all, "featured", q] as const,
  detail: (id: number) => [...agentKeys.all, "detail", id] as const,
};

export function useFeaturedAgents(query: FeaturedAgentsQuery) {
  return useQuery<FeaturedAgentsResponse>({
    queryKey: agentKeys.featured(query),
    queryFn: () => UsersApi.getFeaturedAgents(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useAgentDetail(agentId: number) {
  return useQuery<AgentResponse>({
    queryKey: agentKeys.detail(agentId),
    queryFn: () => UsersApi.getAgentDetail(agentId),
    staleTime: 60_000,
    enabled: !!agentId,
  });
}