"use client";

import { PlanningApi } from "@/lib/api/planning";
import { CoordinatePlanningLookupRequest } from "@/types/interfaces/api/planning";
import { useMutation, useQuery } from "@tanstack/react-query";

export const planningKey = {
  all: ["planning"] as const,
  propertySummary: (propertyId: number) => [...planningKey.all, "property-summary", propertyId] as const,
  propertyMap: (propertyId: number) => [...planningKey.all, "property-map", propertyId] as const,
  dossier: (maHoSo: string) => [...planningKey.all, "dossier", maHoSo] as const,
};

export function usePropertyPlanningSummary(propertyId: number) {
  return useQuery({
    queryKey: planningKey.propertySummary(propertyId),
    queryFn: () => PlanningApi.getPropertyPlanningSummary(propertyId),
    staleTime: 5 * 60_000,
    enabled: !!propertyId,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function usePropertyPlanningMap(propertyId: number) {
  return useQuery({
    queryKey: planningKey.propertyMap(propertyId),
    queryFn: () => PlanningApi.getPropertyPlanningMap(propertyId),
    staleTime: 5 * 60_000,
    enabled: !!propertyId,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function usePlanningLookupByCoordinate() {
  return useMutation({
    mutationFn: (data: CoordinatePlanningLookupRequest) => PlanningApi.lookupByCoordinate(data),
  });
}

export function usePlanningDossier(maHoSo?: string | null) {
  const dossierCode = maHoSo?.trim() || "";

  return useQuery({
    queryKey: planningKey.dossier(dossierCode),
    queryFn: () => PlanningApi.getPlanningDossier(dossierCode),
    staleTime: 5 * 60_000,
    enabled: !!dossierCode,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function usePlanningExplain(propertyId: number) {
  return useMutation({
    mutationFn: (question?: string) =>
      PlanningApi.explainPropertyPlanning(propertyId, {
        question: question?.trim() || undefined,
      }),
  });
}
