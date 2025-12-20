import {
  ContactListQuery,
  ContactListResponse,
  ContactResponse,
  CreateContactRequest,
  UpdateContactStatusRequest
} from "@/types/interfaces/api/contacts";
import { sendDelete, sendGet, sendPatch, sendPost } from "./axios";

export const ContactsApi = {
  createContact: async (data: CreateContactRequest) => {
    try {
      const response = await sendPost('/api/core/v1/contacts', data);
      return response.data as ContactResponse;
    } catch (error) {
      throw error;
    }
  },

  // Admin APIs (require auth)
  getAllContacts: async (query?: ContactListQuery) => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.sortKey) qs.set("sortKey", String(query.sortKey));
      if (query?.sortOrder) qs.set("sortOrder", String(query.sortOrder));
      if (query?.status) qs.set("status", query.status);

      const url = `/api/core/v1/contacts${qs.toString() ? `?${qs.toString()}` : ""}`;
      const response = await sendGet(url);
      return response.data as ContactListResponse;
    } catch (error) {
      throw error;
    }
  },

  getContactDetail: async (contactId: number) => {
    try {
      const response = await sendGet(`/api/core/v1/contacts/${contactId}`);
      return response.data as ContactResponse;
    } catch (error) {
      throw error;
    }
  },

  updateContactStatus: async (contactId: number, data: UpdateContactStatusRequest) => {
    try {
      const response = await sendPatch(`/api/core/v1/contacts/${contactId}/status`, data);
      return response.data as ContactResponse;
    } catch (error) {
      throw error;
    }
  },

  deleteContact: async (contactId: number) => {
    try {
      const response = await sendDelete(`/api/core/v1/contacts/${contactId}`);
      return response.data as ContactResponse;
    } catch (error) {
      throw error;
    }
  },
};
