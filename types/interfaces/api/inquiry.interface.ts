import { DefaultPaginationResponse } from "../common";

export enum LeadStatus {
  NEW = "NEW", // Mới tạo, chưa xử lý
  CONTACTED = "CONTACTED", // Đã liên hệ
  FOLLOW_UP = "FOLLOW_UP", // Đang theo dõi / chờ phản hồi
  NEGOTIATION = "NEGOTIATION", // Đang thương lượng
  CONVERTED = "CONVERTED", // Đã chuyển đổi thành giao dịch
  LOST = "LOST", // Mất lead / không tiềm năng
  ARCHIVED = "ARCHIVED", // Lưu trữ, không hoạt động
}

// ============= CREATE INQUIRY (LEAD) =============
export interface CreateInquiryRequest {
  postId: number;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export interface CreateInquiryResponse {
  id: number;
  postId: number;
  buyerId: number | null;
  agentId: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  note: string | null;
  status: LeadStatus;
  createdAt: Date;
}

// ============= GET ALL LEADS (ADMIN/AGENT) =============
export interface GetAllLeadsQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: LeadStatus;
  postId?: number;
  buyerId?: number;
  agentId?: number;
}

export interface LeadListItem {
  id: number;
  postId: number;
  buyerId: number | null;
  agentId: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  note: string | null;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
  post: {
    id: number;
    postTitle: string;
    postStatus: string;
    createdById: number;
  };
  buyer: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  } | null;
  agent: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  } | null;
}

export interface GetAllLeadsResponse extends DefaultPaginationResponse {
  data: LeadListItem[];
}

// ============= GET LEAD DETAIL =============
export interface LeadDetailResponse {
  id: number;
  postId: number;
  buyerId: number | null;
  agentId: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  note: string | null;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
  post: {
    id: number;
    postTitle: string;
    postStatus: string;
    createdById: number;
    property: {
      id: number;
      title: string;
      price: number;
      location: string;
    } | null;
  };
  buyer: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  } | null;
  agent: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  } | null;
}

// ============= UPDATE LEAD =============
export interface UpdateLeadRequest {
  status?: LeadStatus;
  note?: string;
}

export interface UpdateLeadResponse {
  id: number;
  postId: number;
  buyerId: number | null;
  agentId: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  note: string | null;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ============= UPDATE LEAD STATUS =============
export interface UpdateLeadStatusRequest {
  status: LeadStatus;
}

// ============= ASSIGN LEAD =============
export interface AssignLeadRequest {
  agentId: number;
}

export interface AssignLeadResponse {
  id: number;
  postId: number;
  buyerId: number | null;
  agentId: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  note: string | null;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ============= GET MY LEADS (FOR BUYER) =============
export interface GetMyLeadsQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
}

export interface MyLeadItem {
  id: number;
  postId: number;
  buyerId: number | null;
  agentId: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  note: string | null;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
  post: {
    id: number;
    postTitle: string;
    postStatus: string;
    property: {
      id: number;
      title: string;
      price: number;
      location: string;
    } | null;
  };
  agent: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  } | null;
}

export interface GetMyLeadsResponse extends DefaultPaginationResponse {
  data: MyLeadItem[];
}
