"use client";

import { AmenityApi } from "@/lib/api/amenity";
import { AmenityRequest, AmenityResponse } from "@/types/interfaces/api/amenity";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export type AmenityQuery = {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
};

export const amenityKeys = {
  all: ["property-amenity"] as const,
  list: (q: AmenityQuery = {}) => [...amenityKeys.all, "list", q] as const,
  detail: (id: number) => [...amenityKeys.all, "detail", id] as const,
};

export function useAmenities(query: AmenityQuery) {
  return useQuery<AmenityResponse>({
    queryKey: amenityKeys.list(query),
    queryFn: () => AmenityApi.getListAllAmenity(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useCreateAmenity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AmenityRequest) =>
      AmenityApi.createAmenity(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: amenityKeys.all });
    },
  });
}

export function useUpdateAmenity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: AmenityRequest }) =>
      AmenityApi.updateAmenity(payload.id, payload.data),
    onSuccess: (_data, variables) => {
      // Invalidate list + detail
      qc.invalidateQueries({ queryKey: amenityKeys.all });
      qc.invalidateQueries({ queryKey: amenityKeys.detail(variables.id) });
    },
  });
}

export function useDeleteAmenity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => AmenityApi.deleteAmenity(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: amenityKeys.all });
    },
  });
}
