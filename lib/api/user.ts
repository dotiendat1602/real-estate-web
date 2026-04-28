import { AgentResponse, ChangePasswordRequest, CreateUserRequest, FeaturedAgentsQuery, FeaturedAgentsResponse, UpdateProfileRequest, UpdateUserRequest, UserInfoResponse, UserListQuery, UserListResponse } from "@/types/interfaces/api/user";
import { sendDelete, sendGet, sendPatch, sendPost } from "./axios";

export const UsersApi = {
  me: async () => {
    try {
      const response = await sendGet('/api/core/v1/users/me');
      return response.data as UserInfoResponse;
    } catch (error) {
      throw error;
    }
  },

  updatedProfile: async (data: UpdateProfileRequest) => {
    try {
      const response = await sendPatch('/api/core/v1/users/profile', data);
      return response.data as UserInfoResponse;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (data: ChangePasswordRequest) => {
    try {
      const response = await sendPatch('/api/core/v1/users/change-password', data);
      return response.data as UserInfoResponse;
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async (query?: UserListQuery) => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.sortKey) qs.set("sortKey", String(query.sortKey));
      if (query?.sortOrder) qs.set("sortOrder", String(query.sortOrder));
      if (query?.status) qs.set("status", query.status);
      if (query?.role) qs.set("role", query.role);

      const url = `/api/core/v1/users${qs.toString() ? `?${qs.toString()}` : ""}`;
      const response = await sendGet(url);
      return response.data as UserListResponse;
    } catch (error) {
      throw error;
    }
  },

  getOneUser: async (userId: number) => {
    try {
      const response = await sendGet(`/api/core/v1/users/${userId}`);
      return response.data as UserInfoResponse;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (data: CreateUserRequest) => {
    try {
      const response = await sendPost('/api/core/v1/users', data);
      return response.data as UserInfoResponse;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (userId: number, data: UpdateUserRequest) => {
    try {
      const response = await sendPatch(`/api/core/v1/users/${userId}`, data);
      return response.data as UserInfoResponse;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (userId: number) => {
    try {
      const response = await sendDelete(`/api/core/v1/users/${userId}`);
      return response.data as UserInfoResponse;
    } catch (error) {
      throw error;
    }
  },

  // AGENT
  getFeaturedAgents: async (query?: FeaturedAgentsQuery) => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.area) qs.set("area", query.area);
      if (query?.tag) qs.set("tag", query.tag);

      const url = `/api/core/v1/users/agents/featured${qs.toString() ? `?${qs.toString()}` : ""}`;
      const response = await sendGet(url);
      return response.data as FeaturedAgentsResponse;
    } catch (error) {
      throw error;
    }
  },

  getAgentDetail: async (agentId: number) => {
    try {
      const response = await sendGet(`/api/core/v1/users/agents/${agentId}`);
      return response.data as AgentResponse;
    } catch (error) {
      throw error;
    }
  },
}