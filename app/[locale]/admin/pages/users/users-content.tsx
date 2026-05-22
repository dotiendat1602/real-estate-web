"use client";

import { useState } from "react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PermissionMatrix } from "@/components/admin/users/permission-matrix";
import { RolePermissionSection } from "@/components/admin/users/role-permission-section";
import { UserFilters } from "@/components/admin/users/user-filters";
import { UserTable } from "@/components/admin/users/user-table";
import { useUsers } from "@/hooks/users/useUser";
import type { UserListQuery } from "@/types/interfaces/api/user";

export default function UsersPageContent() {
  const [query, setQuery] = useState<UserListQuery>({
    pageIndex: 1,
    pageSize: 10,
    sortKey: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading, isError, refetch, isFetching } = useUsers(query);

  const users = data?.data ?? [];
  const pageIndex = data?.pageIndex ?? query.pageIndex ?? 1;
  const pageSize = query.pageSize ?? 10;
  const totalItems = data?.totalItems ?? users.length;

  const handleApplyFilters = (filters: {
    search?: string;
    role?: string;
    status?: string;
  }) => {
    setQuery((prev) => ({
      ...prev,
      pageIndex: 1,
      search: filters.search,
      role: filters.role,
      status: filters.status,
    }));
  };

  const handlePageChange = (nextPage: number) => {
    setQuery((prev) => ({
      ...prev,
      pageIndex: nextPage,
    }));
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setQuery((prev) => ({
      ...prev,
      pageIndex: 1,
      pageSize: nextPageSize,
    }));
  };

  return (
    <main className="flex-1 overflow-auto">
      <AdminPageHeader
        title="Người dùng và phân quyền"
        description="Quản lý thông tin người dùng, vai trò và quyền truy cập hệ thống"
      />

      <div className="space-y-8 p-8">
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Danh sách người dùng
            </h2>
            {isFetching && (
              <span className="text-xs text-gray-400">
                Đang đồng bộ dữ liệu...
              </span>
            )}
          </div>

          <UserFilters onApply={handleApplyFilters} />

          <UserTable
            users={users}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </section>

        <RolePermissionSection />
        <PermissionMatrix />
      </div>
    </main>
  );
}
