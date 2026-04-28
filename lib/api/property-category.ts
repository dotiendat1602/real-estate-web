import { PropertyCategoryData, PropertyCategoryRequest, PropertyCategoryResponse, PropertyCategoryUpdate } from "@/types/interfaces/api/property-category";
import { sendDelete, sendGet, sendPatch, sendPost } from "./axios";

export const PropertyCategoryApi = {
  getListAllCategoryProperty: async (query?: { pageIndex?: number, pageSize?: number, sortKey?: string, sortOrder?: string, search?: string }): Promise<PropertyCategoryResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.sortKey) qs.set("sortKey", String(query.sortKey));
      if (query?.sortOrder) qs.set("sortOrder", String(query.sortOrder));

      const url = `/api/core/v1/property-category${qs.toString() ? `?${qs.toString()}` : ""}`;

      const response = await sendGet(url);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  createCategoryProperty: async (data: PropertyCategoryRequest) => {
    const response = await sendPost('/api/core/v1/property-category', data);
    return response.data as PropertyCategoryData;
  },

  updateCategoryProperty: async (categoryId: number, data: PropertyCategoryUpdate) => {
    const response = await sendPatch(`/api/core/v1/property-category/${categoryId}`, data);
    return response.data as PropertyCategoryData;
  },

  deleteCategoryProperty: async (categoryId: number) => {
    const response = await sendDelete(`/api/core/v1/property-category/${categoryId}`);
    return response.data as PropertyCategoryData;
  },
}