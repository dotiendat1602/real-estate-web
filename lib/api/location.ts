import type { DistrictData, ProvinceData, WardData } from "@/types/interfaces/api/location";
import { sendGet } from "./axios";

export const LocationApi = {
  getProvinces: async (): Promise<ProvinceData[]> => {
    const response = await sendGet("/api/core/v1/locations/provinces");
    return response.data;
  },

  getDistricts: async (provinceId: number): Promise<DistrictData[]> => {
    const response = await sendGet(`/api/core/v1/locations/districts/${provinceId}`);
    return response.data;
  },

  getWards: async (districtId: number): Promise<WardData[]> => {
    const response = await sendGet(`/api/core/v1/locations/wards/${districtId}`);
    return response.data;
  },
};
