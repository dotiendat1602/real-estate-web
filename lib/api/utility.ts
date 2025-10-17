import { UtilityData, UtilityRequest, UtilityResponse, UtilityUpdate } from "@/types/interfaces/api/utility";
import { sendDelete, sendGet, sendPatch, sendPost } from "./axios";

export const UtilityApi = {
  getListAllUtility: async (query?: { pageIndex?: number, pageSize?: number, sortKey?: string, sortOrder?: string, search?: string }): Promise<UtilityResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.sortKey) qs.set("sortKey", String(query.sortKey));
      if (query?.sortOrder) qs.set("sortOrder", String(query.sortOrder));

      const url = `/api/core/v1/property-utility${qs.toString() ? `?${qs.toString()}` : ""}`;

      const response = await sendGet(url);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  createUtility: async (data: UtilityRequest) => {
    try {
      const response = await sendPost('/api/core/v1/property-utility', data);
      return response.data as UtilityData;
    } catch (error) {
      throw error;
    }

  },

  updateUtility: async (utilityId: number, data: UtilityUpdate) => {
    try {
      const response = await sendPatch(`/api/core/v1/property-utility/${utilityId}`, data);
      return response.data as UtilityData;
    } catch (error) {
      throw error;
    }

  },

  deleteUtility: async (utilityId: number) => {
    try {
      const response = await sendDelete(`/api/core/v1/property-utility/${utilityId}`);
      return response.data as UtilityData;
    } catch (error) {
      throw error;
    }
  },
}