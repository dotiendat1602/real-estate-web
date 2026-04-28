"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { PropertyCategoryApi } from "@/lib/api/property-category";
import {
  PropertyCategoryRequest,
  PropertyCategoryUpdate,
  PropertyCategoryResponse,
} from "@/types/interfaces/api/property-category";

export type CategoryQuery = {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
};

export const categoryKeys = {
  all: ["property-category"] as const,
  list: (q: CategoryQuery = {}) => [...categoryKeys.all, "list", q] as const,
  detail: (id: number) => [...categoryKeys.all, "detail", id] as const,
};

export function useCategoriesProperty(query: CategoryQuery) {
  return useQuery<PropertyCategoryResponse>({
    queryKey: categoryKeys.list(query),
    queryFn: () => PropertyCategoryApi.getListAllCategoryProperty(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useCreateCategoryProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PropertyCategoryRequest) =>
      PropertyCategoryApi.createCategoryProperty(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategoryProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: PropertyCategoryUpdate }) =>
      PropertyCategoryApi.updateCategoryProperty(payload.id, payload.data),
    onSuccess: (_data, variables) => {
      // Invalidate list + detail
      qc.invalidateQueries({ queryKey: categoryKeys.all });
      qc.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
    },
  });
}

export function useDeleteCategoryProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PropertyCategoryApi.deleteCategoryProperty(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
