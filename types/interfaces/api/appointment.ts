import { AppointmentStatus } from "@/types/enums/appointment";
import { DefaultPaginationResponse } from "../common";

export interface AppointmentListQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
}

export interface AppointmentListResponse extends DefaultPaginationResponse {
  data: AppointmentDataListItem[];
}

export interface AppointmentDataListItem {
  id: number;
  scheduledAt: Date;
  location?: string;
  appointmentStatus: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  post: {
    id: number;
    postTitle: string;
  };
  buyer: {
    id: number;
    name: string;
    phone?: string;
  };
  seller: {
    id: number;
    name: string;
    phone?: string;
  };
}

export interface UpdateAppointmentRequest {
  scheduledAt?: Date;
  location?: string;
  status?: AppointmentStatus;
  notes?: string;
}
