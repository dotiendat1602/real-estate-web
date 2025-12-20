import { DefaultPaginationResponse } from "@/types/interfaces/common";


export interface CreateContactRequest {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  topic: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ContactListQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: string;
}

export interface ContactListResponse extends DefaultPaginationResponse {
  data: ContactResponse[];
}

export interface UpdateContactStatusRequest {
  status: string;
}
