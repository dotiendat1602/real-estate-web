// hooks/authorization/useRolesPermissions.ts
"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  RoleListQuery,
  RoleListResponse,
  PermissionListQuery,
  PermissionListResponse,
  RolePermissionListResponse,
} from "@/types/interfaces/api/roles-permissions";
import { RolesPermissionsApi } from "@/lib/api/roles-permissions";

export const roleKeys = {
  all: ["role"] as const,
  list: (q: RoleListQuery = {}) => [...roleKeys.all, "list", q] as const,
};

export const permissionKeys = {
  all: ["permission"] as const,
  list: (q: PermissionListQuery = {}) => [...permissionKeys.all, "list", q] as const,
};

export const rolePermissionKeys = {
  all: ["role-permission"] as const,
  list: () => [...rolePermissionKeys.all, "list"] as const,
};

// ========== QUERIES ==========

export function useRoles(query: RoleListQuery) {
  return useQuery<RoleListResponse>({
    queryKey: roleKeys.list(query),
    queryFn: () => RolesPermissionsApi.getAllRoles(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function usePermissions(query: PermissionListQuery) {
  return useQuery<PermissionListResponse>({
    queryKey: permissionKeys.list(query),
    queryFn: () => RolesPermissionsApi.getAllPermissions(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useRolesPermissions() {
  return useQuery<RolePermissionListResponse>({
    queryKey: rolePermissionKeys.list(),
    queryFn: () => RolesPermissionsApi.getAllRolesPermissions(),
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// ========== MUTATION ==========

export function useAssignPermissionsToRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { roleId: number; permissionIds: number[] }) =>
      RolesPermissionsApi.assignPermissionsToRole(payload.roleId, payload.permissionIds),
    onSuccess: () => {
      // qc.invalidateQueries({ queryKey: roleKeys.all });
      // qc.invalidateQueries({ queryKey: permissionKeys.all });
      qc.invalidateQueries({ queryKey: rolePermissionKeys.all });
    },
    retry: false,
  });
}
