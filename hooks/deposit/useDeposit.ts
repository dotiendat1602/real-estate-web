"use client";

import { DepositsApi } from "@/lib/api/deposit";
import { DepositListQuery, DepositListResponse, UpdateDepositRequest } from "@/types/interfaces/api/deposit";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const depositsKey = {
  all: ["deposit"] as const,
  list: (q: DepositListQuery = {}) => [...depositsKey.all, "list", q] as const,
  detail: (id: number) => [...depositsKey.all, "detail", id] as const,
};

export function useDeposits(query: DepositListQuery) {
  return useQuery<DepositListResponse>({
    queryKey: depositsKey.list(query),
    queryFn: () => DepositsApi.getListDeposit(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useDepositDetail(depositId: number) {
  return useQuery({
    queryKey: depositsKey.detail(depositId),
    queryFn: () => DepositsApi.getOneDeposit(depositId),
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!depositId,
  });
}

// export function useCreateDeposit() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (data: CreatePostRequest) =>
//       PostsApi.createPost(data),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: postsKey.all });
//     },
//   });
// }

export function useUpdateDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: UpdateDepositRequest }) =>
      DepositsApi.updateDeposit(payload.id, payload.data),
    onSuccess: (_data, variables) => {
      // Invalidate list + detail
      qc.invalidateQueries({ queryKey: depositsKey.all });
      qc.invalidateQueries({ queryKey: depositsKey.detail(variables.id) });
    },
  });
}

// export function useDeleteDeposit() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (id: number) => DepositsApi.deleteDeposit(id),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: depositsKey.all });
//     },
//   });
// }
