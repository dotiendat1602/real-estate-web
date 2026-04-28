import { AppointmentDataListItem, AppointmentListQuery, AppointmentListResponse, UpdateAppointmentRequest } from "@/types/interfaces/api/appointment";
import { sendGet, sendPatch } from "./axios";

export const AppointmentsApi = {
  getListAppointment: async (query?: AppointmentListQuery): Promise<AppointmentListResponse> => {
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

      const url = `/api/core/v1/appointment${qs.toString() ? `?${qs.toString()}` : ""}`;

      const response = await sendGet(url);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getOneAppointment: async (appointmentId: number): Promise<AppointmentDataListItem> => {
    try {
      const response = await sendGet(`/api/core/v1/appointment/${appointmentId}`);
      return response.data as AppointmentDataListItem;
    } catch (error) {
      throw error;
    }
  },

  updateAppointment: async (appointmentId: number, data: UpdateAppointmentRequest): Promise<AppointmentDataListItem> => {
    try {
      const response = await sendPatch(`/api/core/v1/appointment/${appointmentId}`, data);
      return response.data as AppointmentDataListItem;
    } catch (error) {
      throw error;
    }
  },
}
