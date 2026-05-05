"use client";

import { LocationApi } from "@/lib/api/location";
import type { DistrictData, ProvinceData, WardData } from "@/types/interfaces/api/location";
import { useQuery } from "@tanstack/react-query";

export const locationKeys = {
  all: ["locations"] as const,
  provinces: () => [...locationKeys.all, "provinces"] as const,
  districts: (provinceId?: number) => [...locationKeys.all, "districts", provinceId] as const,
  wards: (districtId?: number) => [...locationKeys.all, "wards", districtId] as const,
};

export function useProvinces() {
  return useQuery<ProvinceData[]>({
    queryKey: locationKeys.provinces(),
    queryFn: LocationApi.getProvinces,
    staleTime: 10 * 60_000,
  });
}

export function useDistricts(provinceId?: number) {
  return useQuery<DistrictData[]>({
    queryKey: locationKeys.districts(provinceId),
    queryFn: () => LocationApi.getDistricts(provinceId as number),
    enabled: !!provinceId,
    staleTime: 10 * 60_000,
  });
}

export function useWards(districtId?: number) {
  return useQuery<WardData[]>({
    queryKey: locationKeys.wards(districtId),
    queryFn: () => LocationApi.getWards(districtId as number),
    enabled: !!districtId,
    staleTime: 10 * 60_000,
  });
}
