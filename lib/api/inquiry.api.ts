import {
  CreateInquiryRequest,
  CreateInquiryResponse,
  GetAllLeadsQuery,
  GetAllLeadsResponse,
  LeadDetailResponse,
  UpdateLeadRequest,
  UpdateLeadResponse,
  UpdateLeadStatusRequest,
  AssignLeadRequest,
  AssignLeadResponse,
  GetMyLeadsQuery,
  GetMyLeadsResponse,
} from "@/types/interfaces/api/inquiry.interface";
import { sendDelete, sendGet, sendPatch, sendPost } from "./axios";

export const InquiryApi = {
  // ============= PUBLIC API - Create Inquiry (Lead) =============
  createInquiry: async (data: CreateInquiryRequest): Promise<CreateInquiryResponse> => {
    try {
      const response = await sendPost("/api/core/v1/leads", data);
      return response.data as CreateInquiryResponse;
    } catch (error) {
      throw error;
    }
  },

  // ============= ADMIN/AGENT APIs (require MANAGE_LEADS permission) =============

  // Get all leads with filters
  getAllLeads: async (query?: GetAllLeadsQuery): Promise<GetAllLeadsResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.sortKey) qs.set("sortKey", query.sortKey);
      if (query?.sortOrder) qs.set("sortOrder", query.sortOrder);
      if (query?.status) qs.set("status", query.status);
      if (query?.postId) qs.set("postId", String(query.postId));
      if (query?.buyerId) qs.set("buyerId", String(query.buyerId));
      if (query?.agentId) qs.set("agentId", String(query.agentId));

      const url = `/api/core/v1/leads${qs.toString() ? `?${qs.toString()}` : ""}`;
      const response = await sendGet(url);
      return response.data as GetAllLeadsResponse;
    } catch (error) {
      throw error;
    }
  },

  // Get lead detail by ID
  getLeadDetail: async (leadId: number): Promise<LeadDetailResponse> => {
    try {
      const response = await sendGet(`/api/core/v1/leads/${leadId}`);
      return response.data as LeadDetailResponse;
    } catch (error) {
      throw error;
    }
  },

  // Update lead (note, status)
  updateLead: async (leadId: number, data: UpdateLeadRequest): Promise<UpdateLeadResponse> => {
    try {
      const response = await sendPatch(`/api/core/v1/leads/${leadId}`, data);
      return response.data as UpdateLeadResponse;
    } catch (error) {
      throw error;
    }
  },

  // Update lead status only
  updateLeadStatus: async (leadId: number, data: UpdateLeadStatusRequest): Promise<UpdateLeadResponse> => {
    try {
      const response = await sendPatch(`/api/core/v1/leads/${leadId}/status`, data);
      return response.data as UpdateLeadResponse;
    } catch (error) {
      throw error;
    }
  },

  // Assign lead to agent
  assignLead: async (leadId: number, data: AssignLeadRequest): Promise<AssignLeadResponse> => {
    try {
      const response = await sendPatch(`/api/core/v1/leads/${leadId}/assign`, data);
      return response.data as AssignLeadResponse;
    } catch (error) {
      throw error;
    }
  },

  // Delete lead
  deleteLead: async (leadId: number): Promise<void> => {
    try {
      await sendDelete(`/api/core/v1/leads/${leadId}`);
    } catch (error) {
      throw error;
    }
  },

  // ============= USER API - Get my leads =============

  // Get my leads (for authenticated buyer)
  getMyLeads: async (query?: GetMyLeadsQuery): Promise<GetMyLeadsResponse> => {
    try {
      const qs = new URLSearchParams();
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.sortKey) qs.set("sortKey", query.sortKey);
      if (query?.sortOrder) qs.set("sortOrder", query.sortOrder);

      const url = `/api/core/v1/leads/me${qs.toString() ? `?${qs.toString()}` : ""}`;
      const response = await sendGet(url);
      return response.data as GetMyLeadsResponse;
    } catch (error) {
      throw error;
    }
  },
};
