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
  appointment_id: number;
  scheduledAt: Date;
  location?: string;
  appointmentStatus: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  post: {
    post_id: number;
    postTitle: string;
  };
  buyer: {
    user_id: number;
    name: string;
    phone?: string;
  };
  seller: {
    user_id: number;
    name: string;
    phone?: string;
  };
}

// export interface CreatePostRequest {
//   property_id: number;
//   postTitle: string;
//   postType?: string;
//   postContent?: string;
//   postStatus: string;
// }

export interface UpdateAppointmentRequest {
  scheduledAt?: Date;
  location?: string;
  status?: AppointmentStatus;
  notes?: string;
}
