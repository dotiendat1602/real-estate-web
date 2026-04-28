import { AmenityData, AmenityRequest, AmenityResponse, AmenityUpdate } from "@/types/interfaces/api/amenity";
import { sendDelete, sendGet, sendPatch, sendPost } from "./axios";

export const AmenityApi = {
  getListAllAmenity: async (query?: { pageIndex?: number, pageSize?: number, sortKey?: string, sortOrder?: string, search?: string }): Promise<AmenityResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.sortKey) qs.set("sortKey", String(query.sortKey));
      if (query?.sortOrder) qs.set("sortOrder", String(query.sortOrder));

      const url = `/api/core/v1/amenity${qs.toString() ? `?${qs.toString()}` : ""}`;

      const response = await sendGet(url);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  createAmenity: async (data: AmenityRequest) => {
    try {
      const response = await sendPost('/api/core/v1/amenity', data);
      return response.data as AmenityData;
    } catch (error) {
      throw error;
    }

  },

  updateAmenity: async (amenityId: number, data: AmenityUpdate) => {
    try {
      const response = await sendPatch(`/api/core/v1/amenity/${amenityId}`, data);
      return response.data as AmenityData;
    } catch (error) {
      throw error;
    }

  },

  deleteAmenity: async (amenityId: number) => {
    try {
      const response = await sendDelete(`/api/core/v1/amenity/${amenityId}`);
      return response.data as AmenityData;
    } catch (error) {
      throw error;
    }
  },
}