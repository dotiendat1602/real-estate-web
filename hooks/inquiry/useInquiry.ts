"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
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
import { InquiryApi } from "@/lib/api/inquiry.api";

/**
 * Query keys
 * - Tách keys theo list/all/detail/me để invalidate có mục tiêu.
 * - Dùng query object làm phần của key để cache theo filter.
 */
export const inquiryKeys = {
  all: ["inquiries"] as const,

  // Admin/Agent lists
  lists: () => [...inquiryKeys.all, "lists"] as const,
  list: (query?: GetAllLeadsQuery) => [...inquiryKeys.lists(), query ?? {}] as const,

  // Detail
  details: () => [...inquiryKeys.all, "details"] as const,
  detail: (leadId: number) => [...inquiryKeys.details(), leadId] as const,

  // Buyer "me"
  me: () => [...inquiryKeys.all, "me"] as const,
  myList: (query?: GetMyLeadsQuery) => [...inquiryKeys.me(), query ?? {}] as const,
};

// =========================
// MUTATIONS
// =========================

/** PUBLIC: create inquiry */
export function useCreateInquiry() {
  const qc = useQueryClient();

  return useMutation<CreateInquiryResponse, any, CreateInquiryRequest>({
    mutationFn: (data) => InquiryApi.createInquiry(data),

    onSuccess: async (created) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: inquiryKeys.lists() }),
        qc.invalidateQueries({ queryKey: inquiryKeys.me() }),
      ]);

      await qc.invalidateQueries({ queryKey: inquiryKeys.all });
    },
  });
}

/** ADMIN/AGENT: update lead (status/note) */
export function useUpdateLead() {
  const qc = useQueryClient();

  return useMutation<
    UpdateLeadResponse,
    any,
    { leadId: number; data: UpdateLeadRequest }
  >({
    mutationFn: ({ leadId, data }) => InquiryApi.updateLead(leadId, data),

    onSuccess: async (updated, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: inquiryKeys.detail(vars.leadId) }),
        qc.invalidateQueries({ queryKey: inquiryKeys.lists() }),
        qc.invalidateQueries({ queryKey: inquiryKeys.me() }),
      ]);
    },
  });
}

/** ADMIN/AGENT: update lead status only */
export function useUpdateLeadStatus() {
  const qc = useQueryClient();

  return useMutation<
    UpdateLeadResponse,
    any,
    { leadId: number; data: UpdateLeadStatusRequest }
  >({
    mutationFn: ({ leadId, data }) => InquiryApi.updateLeadStatus(leadId, data),

    onSuccess: async (updated, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: inquiryKeys.detail(vars.leadId) }),
        qc.invalidateQueries({ queryKey: inquiryKeys.lists() }),
        qc.invalidateQueries({ queryKey: inquiryKeys.me() }),
      ]);
    },
  });
}

/** ADMIN/AGENT: assign lead */
export function useAssignLead() {
  const qc = useQueryClient();

  return useMutation<AssignLeadResponse, any, { leadId: number; data: AssignLeadRequest }>({
    mutationFn: ({ leadId, data }) => InquiryApi.assignLead(leadId, data),

    onSuccess: async (_assigned, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: inquiryKeys.detail(vars.leadId) }),
        qc.invalidateQueries({ queryKey: inquiryKeys.lists() }),
      ]);
    },
  });
}

/** ADMIN/AGENT: delete lead */
export function useDeleteLead() {
  const qc = useQueryClient();

  return useMutation<void, any, { leadId: number }>({
    mutationFn: ({ leadId }) => InquiryApi.deleteLead(leadId),

    onSuccess: async (_v, vars) => {
      // xóa xong: remove cache detail + refresh lists/me
      qc.removeQueries({ queryKey: inquiryKeys.detail(vars.leadId) });

      await Promise.all([
        qc.invalidateQueries({ queryKey: inquiryKeys.lists() }),
        qc.invalidateQueries({ queryKey: inquiryKeys.me() }),
      ]);
    },
  });
}

// =========================
// QUERIES
// =========================

/** ADMIN/AGENT: get all leads (with filters) */
export function useAllLeads(query?: GetAllLeadsQuery, opts?: { enabled?: boolean }) {
  return useQuery<GetAllLeadsResponse, any>({
    queryKey: inquiryKeys.list(query),
    queryFn: () => InquiryApi.getAllLeads(query),
    enabled: opts?.enabled ?? true,
    // tuỳ bạn: giữ data cũ khi đổi filter/paging
    // placeholderData: (prev) => prev,
  });
}

/** ADMIN/AGENT: lead detail */
export function useLeadDetail(leadId: number, opts?: { enabled?: boolean }) {
  return useQuery<LeadDetailResponse, any>({
    queryKey: inquiryKeys.detail(leadId),
    queryFn: () => InquiryApi.getLeadDetail(leadId),
    enabled: (opts?.enabled ?? true) && Number.isFinite(leadId) && leadId > 0,
  });
}

/** BUYER: my leads */
export function useMyLeads(query?: GetMyLeadsQuery, opts?: { enabled?: boolean }) {
  return useQuery<GetMyLeadsResponse, any>({
    queryKey: inquiryKeys.myList(query),
    queryFn: () => InquiryApi.getMyLeads(query),
    enabled: opts?.enabled ?? true,
    // placeholderData: (prev) => prev,
  });
}
