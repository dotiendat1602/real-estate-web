"use client";

import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useRoles,
  usePermissions,
  useRolesPermissions,
  useAssignPermissionsToRole,
} from "@/hooks/roles-permissions/useRolePermission";
import { formatPermissionName, formatRoleName } from "@/lib/utils";
import {
  RoleListQuery,
  PermissionListQuery,
} from "@/types/interfaces/api/roles-permissions";

export function PermissionMatrix() {
  // Lấy full list roles
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

  // Mapping role-permission hiện tại
  const {
    data: rolePermissionData,
    isLoading: isLoadingMapping,
    isError: isErrorMapping,
  } = useRolesPermissions();

  const assignMutation = useAssignPermissionsToRole();

  const roles = roleData?.data ?? [];
  const permissions = permissionData?.data ?? [];
  const pairs = rolePermissionData?.data ?? [];

  // Map roleId -> Set(permissionId) để biết ô nào đang được gán
  const rolePermissionByRoleId = useMemo(() => {
    const map = new Map<number, Set<number>>();
    for (const item of pairs) {
      const rId = item.role.id;
      const pId = item.permission.id;
      if (!map.has(rId)) {
        map.set(rId, new Set());
      }
      map.get(rId)!.add(pId);
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

    const permissionIds = Array.from(currentSet);
    assignMutation.mutate({ roleId, permissionIds });
  };

  const isLoading = isLoadingRoles || isLoadingPermissions || isLoadingMapping;
  const isError = isErrorRoles || isErrorPermissions || isErrorMapping;

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Ma trận quyền (Roles x Permissions)
      </h2>

      {isLoading ? (
        <p className="text-sm text-gray-500">Đang tải ma trận quyền...</p>
      ) : isError ? (
        <p className="text-sm text-red-500">
          Lỗi tải dữ liệu roles/permissions. Vui lòng thử lại.
        </p>
      ) : roles.length === 0 || permissions.length === 0 ? (
        <p className="text-sm text-gray-500">
          Chưa có cấu hình role/permission nào.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 min-w-[200px]">
                  Vai trò / Quyền
                </th>
                {permissions.map((permission) => (
                  <th
                    key={permission.id}
                    className="text-center py-3 px-4 text-xs font-medium text-gray-700 whitespace-nowrap"
                  >
                    {formatPermissionName(permission.name)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => {
                const assignedSetForRole =
                  rolePermissionByRoleId.get(role.id) ?? new Set<number>();

                return (
                  <tr
                    key={role.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatRoleName(role.name)}
                        </div>
                      </div>
                    </td>

                    {permissions.map((permission) => {
                      const isChecked = assignedSetForRole.has(
                        permission.id,
                      );

                      return (
                        <td
                          key={permission.id}
                          className="py-4 px-4 text-center"
                        >
                          <div className="flex justify-center">
                            <Checkbox
                              checked={isChecked}
                              disabled={assignMutation.isPending}
                              onCheckedChange={() =>
                                handleTogglePermission(
                                  role.id,
                                  permission.id,
                                )
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
