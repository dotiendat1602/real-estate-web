"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateContactRequest,
  CreateContactResponse,
  GetAllContactsQuery,
  GetAllContactsResponse,
  ContactDetailResponse,
  UpdateContactStatusRequest,
  UpdateContactStatusResponse,
} from "@/types/interfaces/api/contact.interface";
import { ContactsApi } from "@/lib/api/contacts";

/**
 * Query keys
 */
export const contactsKeys = {
  all: ["contacts"] as const,
  lists: () => [...contactsKeys.all, "lists"] as const,
  list: (query?: GetAllContactsQuery) => [...contactsKeys.lists(), query ?? {}] as const,
  details: () => [...contactsKeys.all, "details"] as const,
  detail: (contactId: number) => [...contactsKeys.details(), contactId] as const,
};

/** PUBLIC: create contact */
export function useCreateContact() {
  const qc = useQueryClient();

  return useMutation<CreateContactResponse, any, CreateContactRequest>({
    mutationFn: (data) => ContactsApi.createContact(data),

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: contactsKeys.lists() });
    },
  });
}

/** ADMIN: update contact status */
export function useUpdateContactStatus() {
  const qc = useQueryClient();

  return useMutation<
    UpdateContactStatusResponse,
    any,
    { contactId: number; data: UpdateContactStatusRequest }
  >({
    mutationFn: ({ contactId, data }) => ContactsApi.updateContactStatus(contactId, data),

    onSuccess: async (updated, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: contactsKeys.detail(vars.contactId) }),
        qc.invalidateQueries({ queryKey: contactsKeys.lists() }),
      ]);
    },
  });
}

/** ADMIN: delete contact */
export function useDeleteContact() {
  const qc = useQueryClient();

  return useMutation<ContactDetailResponse, any, { contactId: number }>({
    mutationFn: ({ contactId }) => ContactsApi.deleteContact(contactId),

    onSuccess: async (_v, vars) => {
      qc.removeQueries({ queryKey: contactsKeys.detail(vars.contactId) });
      await qc.invalidateQueries({ queryKey: contactsKeys.lists() });
    },
  });
}

/** ADMIN: get all contacts with filters */
export function useAllContacts(query?: GetAllContactsQuery, opts?: { enabled?: boolean }) {
  return useQuery<GetAllContactsResponse, any>({
    queryKey: contactsKeys.list(query),
    queryFn: () => ContactsApi.getAllContacts(query),
    enabled: opts?.enabled ?? true,
  });
}

/** ADMIN: contact detail */
export function useContactDetail(contactId: number, opts?: { enabled?: boolean }) {
  return useQuery<ContactDetailResponse, any>({
    queryKey: contactsKeys.detail(contactId),
    queryFn: () => ContactsApi.getContactDetail(contactId),
    enabled: (opts?.enabled ?? true) && Number.isFinite(contactId) && contactId > 0,
  });
}
