"use client";

import { useMemo, useState } from "react";
import {
  RoleListQuery,
  PermissionListQuery,
} from "@/types/interfaces/api/roles-permissions";
import { usePermissions, useRoles } from "@/hooks/roles-permissions/useRolePermission";
import { formatPermissionName, formatRoleName } from "@/lib/utils";

export function RolePermissionSection() {
  // Query state cho API
  const [roleQuery] = useState<RoleListQuery>({
    pageIndex: 1,
    pageSize: 10,
    sortKey: "name",
    sortOrder: "asc",
  });

  const [permissionQuery] = useState<PermissionListQuery>({
    pageIndex: 1,
    pageSize: 10,
    sortKey: "name",
    sortOrder: "asc",
  });

  // Call API roles
  const {
    data: roleData,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
  } = useRoles(roleQuery);

  // Call API permissions
  const {
    data: permissionData,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
  } = usePermissions(permissionQuery);

  // Filter out items with undefined id
  const roles = useMemo(() => {
    return (roleData?.data ?? []).filter(role => role?.id !== undefined);
  }, [roleData?.data]);

  const permissions = useMemo(() => {
    return (permissionData?.data ?? []).filter(permission => permission?.id !== undefined);
  }, [permissionData?.data]);

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Vai trò và quyền hạn
      </h2>

      {/* Two Tables Side by Side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Roles Table */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-4">
            Danh sách vai trò
          </h3>

          {isLoadingRoles ? (
            <p className="text-sm text-gray-500">Đang tải roles...</p>
          ) : isErrorRoles ? (
            <p className="text-sm text-red-500">
              Lỗi tải danh sách roles. Vui lòng thử lại.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Tên role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Mô tả
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles.map((role, index) => (
                    <tr
                      key={`role-list-${role.id ?? `temp-${index}`}`}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {formatRoleName(role.name)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {role.description || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key="roles-empty">
                    <td
                      colSpan={2}
                      className="py-4 px-4 text-sm text-gray-500 text-center"
                    >
                      Không có vai trò nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Permissions Table */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-4">
            Danh sách quyền hạn
          </h3>

          {isLoadingPermissions ? (
            <p className="text-sm text-gray-500">Đang tải permissions...</p>
          ) : isErrorPermissions ? (
            <p className="text-sm text-red-500">
              Lỗi tải danh sách permissions. Vui lòng thử lại.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Tên quyền hạn
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Số role đang dùng
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissions.length > 0 ? (
                  permissions.map((permission, index) => (
                    <tr
                      key={`permission-list-${permission.id ?? `temp-${index}`}`}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {formatPermissionName(permission.name)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {typeof permission.assignedRolesCount === "number"
                          ? `Được gán cho ${permission.assignedRolesCount} vai trò`
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key="permissions-empty">
                    <td
                      colSpan={2}
                      className="py-4 px-4 text-sm text-gray-500 text-center"
                    >
                      Không có quyền hạn nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
