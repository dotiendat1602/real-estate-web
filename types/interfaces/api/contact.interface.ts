// types/interfaces/api/contacts.interface.ts
import { DefaultPaginationResponse } from "../common";

export enum ContactStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

// ============= CREATE CONTACT (PUBLIC) =============
export interface CreateContactRequest {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  subject: string;
  message: string;
}

export interface CreateContactResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  topic: string;
  subject: string;
  status: string;
  createdAt: Date;
}

// ============= GET ALL CONTACTS (ADMIN) =============
export interface GetAllContactsQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: string;
}

export interface ContactListItem {
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

export interface GetAllContactsResponse extends DefaultPaginationResponse {
  data: ContactListItem[];
}

// ============= GET CONTACT DETAIL =============
export interface ContactDetailResponse {
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

// ============= UPDATE CONTACT STATUS =============
export interface UpdateContactStatusRequest {
  status: string;
}

export interface UpdateContactStatusResponse {
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
}
