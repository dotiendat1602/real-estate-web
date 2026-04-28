"use client";

import { UtilityApi } from "@/lib/api/utility";
import { UtilityRequest, UtilityResponse } from "@/types/interfaces/api/utility";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export type UtilityQuery = {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
};

export const utilityKeys = {
  all: ["property-utility"] as const,
  list: (q: UtilityQuery = {}) => [...utilityKeys.all, "list", q] as const,
  detail: (id: number) => [...utilityKeys.all, "detail", id] as const,
};

export function useUtilities(query: UtilityQuery) {
  return useQuery<UtilityResponse>({
    queryKey: utilityKeys.list(query),
    queryFn: () => UtilityApi.getListAllUtility(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useCreateUtility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UtilityRequest) =>
      UtilityApi.createUtility(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: utilityKeys.all });
    },
  });
}

export function useUpdateUtility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: UtilityRequest }) =>
      UtilityApi.updateUtility(payload.id, payload.data),
    onSuccess: (_data, variables) => {
      // Invalidate list + detail
      qc.invalidateQueries({ queryKey: utilityKeys.all });
      qc.invalidateQueries({ queryKey: utilityKeys.detail(variables.id) });
    },
  });
}

export function useDeleteUtility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => UtilityApi.deleteUtility(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: utilityKeys.all });
    },
  });
}
