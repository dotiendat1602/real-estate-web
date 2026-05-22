"use client";

import { useMemo, useState } from "react";

import {
  PermissionListQuery,
  RoleListQuery,
} from "@/types/interfaces/api/roles-permissions";
import { usePermissions, useRoles } from "@/hooks/roles-permissions/useRolePermission";
import { formatPermissionName, formatRoleName } from "@/lib/utils";

export function RolePermissionSection() {
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

  const roles = useMemo(() => {
    return (roleData?.data ?? []).filter((role) => role?.id !== undefined);
  }, [roleData?.data]);

  const permissions = useMemo(() => {
    return (permissionData?.data ?? []).filter(
      (permission) => permission?.id !== undefined
    );
  }, [permissionData?.data]);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        Vai trò và quyền hạn
      </h2>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="overflow-x-auto">
          <h3 className="mb-4 text-base font-medium text-gray-900">
            Danh sách vai trò
          </h3>

          {isLoadingRoles ? (
            <p className="text-sm text-gray-500">Đang tải vai trò...</p>
          ) : isErrorRoles ? (
            <p className="text-sm text-red-500">
              Lỗi tải danh sách vai trò. Vui lòng thử lại.
            </p>
          ) : (
            <table className="w-full min-w-[420px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Tên vai trò
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
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
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {formatRoleName(role.name)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {role.description || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      Không có vai trò nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="overflow-x-auto">
          <h3 className="mb-4 text-base font-medium text-gray-900">
            Danh sách quyền hạn
          </h3>

          {isLoadingPermissions ? (
            <p className="text-sm text-gray-500">Đang tải quyền hạn...</p>
          ) : isErrorPermissions ? (
            <p className="text-sm text-red-500">
              Lỗi tải danh sách quyền hạn. Vui lòng thử lại.
            </p>
          ) : (
            <table className="w-full min-w-[420px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Tên quyền hạn
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Số vai trò đang dùng
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
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {formatPermissionName(permission.name)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {typeof permission.assignedRolesCount === "number"
                          ? `Được gán cho ${permission.assignedRolesCount} vai trò`
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-4 text-center text-sm text-gray-500"
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
