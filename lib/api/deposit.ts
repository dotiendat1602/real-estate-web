import { CreateDepositRequest, DepositDetailResponse, DepositListQuery, DepositListResponse, UpdateDepositRequest } from "@/types/interfaces/api/deposit";
import { sendDelete, sendGet, sendPatch, sendPost } from "./axios";

export const DepositsApi = {
  getListDeposit: async (query?: DepositListQuery): Promise<DepositListResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.pageIndex) qs.set("pageIndex", query.pageIndex.toString());
      if (query?.pageSize) qs.set("pageSize", query.pageSize.toString());
      if (query?.sortKey) qs.set("sortKey", query.sortKey);
      if (query?.sortOrder) qs.set("sortOrder", query.sortOrder);
      if (query?.search) qs.set("search", query.search);
      if (query?.status) qs.set("status", query.status);
      if (query?.date_from) qs.set("date_from", query.date_from);
      if (query?.date_to) qs.set("date_to", query.date_to);

      const url = `/api/core/v1/deposit${qs.toString() ? `?${qs.toString()}` : ""}`;

      const response = await sendGet(url);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getOneDeposit: async (depositId: number): Promise<DepositDetailResponse> => {
    try {
      const response = await sendGet(`/api/core/v1/deposit/${depositId}`);
      return response.data as DepositDetailResponse;
    } catch (error) {
      throw error;
    }
  },

  createDeposit: async (data: CreateDepositRequest): Promise<DepositDetailResponse> => {
    const response = await sendPost('/api/core/v1/deposit', data);
    return response.data as DepositDetailResponse;
  },

  updateDeposit: async (depositId: number, data: UpdateDepositRequest): Promise<DepositDetailResponse> => {
    const response = await sendPatch(`/api/core/v1/deposit/${depositId}`, data);
    return response.data as DepositDetailResponse;
  },
}
