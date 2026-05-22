"use client";

import { useMemo } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  useAssignPermissionsToRole,
  usePermissions,
  useRoles,
  useRolesPermissions,
} from "@/hooks/roles-permissions/useRolePermission";
import { formatPermissionName, formatRoleName } from "@/lib/utils";
import type {
  PermissionListQuery,
  RoleListQuery,
} from "@/types/interfaces/api/roles-permissions";

export function PermissionMatrix() {
  const roleQuery: RoleListQuery = {
    pageIndex: 1,
    pageSize: 100,
    sortKey: "name",
    sortOrder: "asc",
  };

  const permissionQuery: PermissionListQuery = {
    pageIndex: 1,
    pageSize: 100,
    sortKey: "name",
    sortOrder: "asc",
  };

  const {
    data: roleData,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
  } = useRoles(roleQuery);

  const {
    data: permissionData,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
  } = usePermissions(permissionQuery);

  const {
    data: rolePermissionData,
    isLoading: isLoadingMapping,
    isError: isErrorMapping,
  } = useRolesPermissions();

  const assignMutation = useAssignPermissionsToRole();

  const roles = useMemo(() => {
    return (roleData?.data ?? []).filter((role) => role?.id !== undefined);
  }, [roleData?.data]);

  const permissions = useMemo(() => {
    return (permissionData?.data ?? []).filter(
      (permission) => permission?.id !== undefined
    );
  }, [permissionData?.data]);

  const pairs = useMemo(
    () => rolePermissionData?.data ?? [],
    [rolePermissionData?.data]
  );

  const rolePermissionByRoleId = useMemo(() => {
    const map = new Map<number, Set<number>>();

    for (const item of pairs) {
      if (!item?.role?.id || !item?.permission?.id) continue;

      const roleId = item.role.id;
      const permissionId = item.permission.id;
      if (!map.has(roleId)) {
        map.set(roleId, new Set());
      }
      map.get(roleId)?.add(permissionId);
    }

    return map;
  }, [pairs]);

  const handleTogglePermission = (roleId: number, permissionId: number) => {
    const currentSet = new Set(rolePermissionByRoleId.get(roleId) ?? []);

    if (currentSet.has(permissionId)) {
      currentSet.delete(permissionId);
    } else {
      currentSet.add(permissionId);
    }

    assignMutation.mutate({
      roleId,
      permissionIds: Array.from(currentSet),
    });
  };

  const isLoading = isLoadingRoles || isLoadingPermissions || isLoadingMapping;
  const isError = isErrorRoles || isErrorPermissions || isErrorMapping;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        Ma trận quyền theo vai trò
      </h2>

      {isLoading ? (
        <p className="text-sm text-gray-500">Đang tải ma trận quyền...</p>
      ) : isError ? (
        <p className="text-sm text-red-500">
          Lỗi tải dữ liệu vai trò/quyền hạn. Vui lòng thử lại.
        </p>
      ) : roles.length === 0 || permissions.length === 0 ? (
        <p className="text-sm text-gray-500">
          Chưa có cấu hình vai trò/quyền hạn nào.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="min-w-[200px] px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Vai trò / Quyền
                </th>
                {permissions.map((permission, index) => (
                  <th
                    key={`header-permission-${permission.id ?? `temp-${index}`}`}
                    className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-gray-700"
                  >
                    {formatPermissionName(permission.name)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role, roleIndex) => {
                const assignedSetForRole =
                  rolePermissionByRoleId.get(role.id) ?? new Set<number>();

                return (
                  <tr
                    key={`role-${role.id ?? `temp-${roleIndex}`}`}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {formatRoleName(role.name)}
                    </td>

                    {permissions.map((permission, permIndex) => {
                      const isChecked = assignedSetForRole.has(permission.id);

                      return (
                        <td
                          key={`role-${role.id ?? `temp-${roleIndex}`}-permission-${permission.id ?? `temp-${permIndex}`}`}
                          className="px-4 py-4 text-center"
                        >
                          <div className="flex justify-center">
                            <Checkbox
                              checked={isChecked}
                              disabled={assignMutation.isPending}
                              onCheckedChange={() =>
                                handleTogglePermission(role.id, permission.id)
                              }
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {assignMutation.isError && (
        <p className="mt-2 text-xs text-red-500">
          Cập nhật quyền thất bại. Vui lòng thử lại.
        </p>
      )}
    </section>
  );
}
