"use client";

import { Bell, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserFilters } from "@/components/users/user-filters"
import { UserTable } from "@/components/users/user-table"
import { RolePermissionSection } from "@/components/users/role-permission-section"
import { PermissionMatrix } from "@/components/users/permission-matrix"
import { useState } from "react";
import { useUsers } from "@/hooks/users/useUser";
import { UserListQuery } from "@/types/interfaces/api/user";

export default function UsersPageContent() {
  // --- User Section ---
  const [query, setQuery] = useState<UserListQuery>({
    pageIndex: 1,
    pageSize: 10,
    sortKey: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading, isError, refetch, isFetching } = useUsers(query);

  const users = data?.data ?? [];
  const pageIndex = data?.pageIndex ?? query.pageIndex ?? 1;
  const pageSize = 10;
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

  // --- Role and Permission Section ---

  const handlePageChange = (nextPage: number) => {
    setQuery((prev) => ({
      ...prev,
      pageIndex: nextPage,
    }));
  };

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Người dùng và phân quyền</h1>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý thông tin người dùng, vai trò và quyền truy cập hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Globe className="h-5 w-5" />
            </Button>
            <span className="text-sm text-gray-700">English</span>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* User List Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
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
          />
        </section>

        {/* Roles and Permissions Section */}
        <RolePermissionSection />

        {/* Permission Matrix Section */}
        <PermissionMatrix />
      </div>
    </main>
  )
}
