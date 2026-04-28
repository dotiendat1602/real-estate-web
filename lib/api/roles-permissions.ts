import { PermissionListQuery, PermissionListResponse, RoleListQuery, RoleListResponse, RolePermissionListResponse } from "@/types/interfaces/api/roles-permissions";
import { sendGet, sendPost } from "./axios";

export const RolesPermissionsApi = {
  getAllRoles: async (query?: RoleListQuery) => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.sortKey) qs.set("sortKey", String(query.sortKey));
      if (query?.sortOrder) qs.set("sortOrder", String(query.sortOrder));

      const url = `/api/core/v1/authorization/roles${qs.toString() ? `?${qs.toString()}` : ""}`;
      const response = await sendGet(url);
      return response.data as RoleListResponse;
    } catch (error) {
      throw error;
    }
  },

  getAllPermissions: async (query?: PermissionListQuery) => {
    try {
      const qs = new URLSearchParams();
      if (query?.search) qs.set("search", query.search);
      if (query?.pageIndex) qs.set("pageIndex", String(query.pageIndex));
      if (query?.pageSize) qs.set("pageSize", String(query.pageSize));
      if (query?.sortKey) qs.set("sortKey", String(query.sortKey));
      if (query?.sortOrder) qs.set("sortOrder", String(query.sortOrder));

      const url = `/api/core/v1/authorization/permissions${qs.toString() ? `?${qs.toString()}` : ""}`;
      const response = await sendGet(url);
      return response.data as PermissionListResponse;
    } catch (error) {
      throw error;
    }
  },

  getAllRolesPermissions: async () => {
    try {
      const response = await sendGet(`/api/core/v1/authorization/roles/permissions`);
      return response.data as RolePermissionListResponse;
    } catch (error) {
      throw error;
    }
  },

  assignPermissionsToRole: async (roleId: number, permissionIds: number[]) => {
    try {
      const url = `/api/core/v1/authorization/assign-permissions-to-role/${roleId}`;
      const body = {
        permissionIds,
      };
      const response = await sendPost(url, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
