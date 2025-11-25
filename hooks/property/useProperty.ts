"use client";

import { PropertiesApi } from "@/lib/api/property";
import { CreatePropertyRequest, PropertyListQuery, PropertyListResponse, UpdatePropertyRequest } from "@/types/interfaces/api/property";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const propertiesKey = {
  all: ["property"] as const,
  list: (q: PropertyListQuery = {}) => [...propertiesKey.all, "list", q] as const,
  detail: (id: number) => [...propertiesKey.all, "detail", id] as const,
};

export function useProperties(query: PropertyListQuery) {
  return useQuery<PropertyListResponse>({
    queryKey: propertiesKey.list(query),
    queryFn: () => PropertiesApi.getListProperty(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function usePropertyDetail(propertyId: number) {
  return useQuery({
    queryKey: propertiesKey.detail(propertyId),
    queryFn: () => PropertiesApi.getOneProperty(propertyId),
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!propertyId,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePropertyRequest) =>
      PropertiesApi.createProperty(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: propertiesKey.all });
    },
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: UpdatePropertyRequest }) =>
      PropertiesApi.updateProperty(payload.id, payload.data),
    onSuccess: (_data, variables) => {
      // Invalidate list + detail
      qc.invalidateQueries({ queryKey: propertiesKey.all });
      qc.invalidateQueries({ queryKey: propertiesKey.detail(variables.id) });
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PropertiesApi.deleteProperty(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: propertiesKey.all });
    },
  });
}
