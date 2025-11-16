import { DefaultPaginationResponse } from "../common";

export interface RoleListQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface RoleInfoResponse {
  role_id: number;
  name: string;
  description: string;
}

export interface RoleListResponse extends DefaultPaginationResponse {
  data: RoleInfoResponse[];
}

export interface PermissionListQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface PermissionInfoResponse {
  permission_id: number;
  name: string;
  assignedRolesCount?: number;
}

export interface PermissionListResponse extends DefaultPaginationResponse {
  data: PermissionInfoResponse[];
}

export interface RolePermissionInfoResponse {
  role: {
    role_id: number;
    name: string;
  };
  permission: {
    permission_id: number;
    name: string;
  };
}

export interface RolePermissionListResponse extends DefaultPaginationResponse {
  data: RolePermissionInfoResponse[];
}

export interface AssignPermissionToRoleRequest {
  permissionIds: number[];
}
