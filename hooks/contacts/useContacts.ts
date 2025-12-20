"use client";

import { ContactsApi } from "@/lib/api/contacts";
import {
  ContactListQuery,
  ContactListResponse,
  ContactResponse,
  CreateContactRequest,
  UpdateContactStatusRequest
} from "@/types/interfaces/api/contacts";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const contactKeys = {
  all: ["contacts"] as const,
  list: (q: ContactListQuery = {}) => [...contactKeys.all, "list", q] as const,
  detail: (id: number) => [...contactKeys.all, "detail", id] as const,
};

export function useContacts(query: ContactListQuery) {
  return useQuery<ContactListResponse>({
    queryKey: contactKeys.list(query),
    queryFn: () => ContactsApi.getAllContacts(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useContactDetail(contactId: number) {
  return useQuery<ContactResponse>({
    queryKey: contactKeys.detail(contactId),
    queryFn: () => ContactsApi.getContactDetail(contactId),
    staleTime: 60_000,
    enabled: !!contactId,
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContactRequest) => ContactsApi.createContact(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
}

export function useUpdateContactStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: UpdateContactStatusRequest }) =>
      ContactsApi.updateContactStatus(payload.id, payload.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: contactKeys.all });
      qc.invalidateQueries({ queryKey: contactKeys.detail(variables.id) });
    },
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ContactsApi.deleteContact(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
}
