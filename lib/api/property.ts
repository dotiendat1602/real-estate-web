import { CreatePropertyRequest, PropertyData, PropertyListQuery, PropertyListResponse, UpdatePropertyRequest } from "@/types/interfaces/api/property";
import { sendDelete, sendGet, sendPatch, sendPost } from "./axios";

export const PropertiesApi = {
  getListProperty: async (query?: PropertyListQuery): Promise<PropertyListResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
      if (query?.status) qs.set("status", query.status);
      if (query?.priceFrom) qs.set("priceFrom", String(query.priceFrom));
      if (query?.priceTo) qs.set("priceTo", String(query.priceTo));
      if (query?.province_id) qs.set("province_id", String(query.province_id));
      if (query?.district_id) qs.set("district_id", String(query.district_id));
      if (query?.ward_id) qs.set("ward_id", String(query.ward_id));
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.sortKey) qs.set("sortKey", String(query.sortKey));
      if (query?.sortOrder) qs.set("sortOrder", String(query.sortOrder));

      const url = `/api/core/v1/property${qs.toString() ? `?${qs.toString()}` : ""}`;

      const response = await sendGet(url);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getOneProperty: async (propertyId: number): Promise<PropertyData> => {
    try {
      const response = await sendGet(`/api/core/v1/property/${propertyId}`);
      return response.data as PropertyData;
    } catch (error) {
      throw error;
    }
  },

  createProperty: async (data: CreatePropertyRequest): Promise<PropertyData> => {
    const response = await sendPost('/api/core/v1/property', data);
    return response.data as PropertyData;
  },

  updateProperty: async (propertyId: number, data: UpdatePropertyRequest): Promise<PropertyData> => {
    const response = await sendPatch(`/api/core/v1/property/${propertyId}`, data);
    return response.data as PropertyData;
  },

  deleteProperty: async (propertyId: number): Promise<PropertyData> => {
    const response = await sendDelete(`/api/core/v1/property/${propertyId}`);
    return response.data as PropertyData;
  },
}
