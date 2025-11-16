"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select";

type UserFiltersProps = {
  onApply?: (filters: {
    search?: string;
    role?: string;
    status?: string;
  }) => void;
};

export function UserFilters({ onApply }: UserFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // controlled state cho 3 select
  const [role, setRole] = useState("all-roles");
  const [status, setStatus] = useState("all-status");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onApply?.({
      search: searchQuery || undefined,
      role: role === "all-roles" ? undefined : role,
      status: status === "all-status" ? undefined : status,
    });
  };

  return (
    <form className="space-y-4 mb-6" onSubmit={handleSubmit}>
      <div className="flex items-center gap-3">
        {/* Ô tìm kiếm */}
        <Input
          placeholder="Tìm theo email, tên, số điện thoại..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-gray-50 border-gray-200"
        />

        {/* Vai trò */}
        <NativeSelect
          value={role}
          onChange={setRole}
          className="w-[180px]"
          selectClassName="bg-gray-50 border-gray-200"
          placeholder="Tất cả vai trò"
        >
          <option value="all-roles">Tất cả vai trò</option>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="agent">Agent</option>
          <option value="USER">User</option>
        </NativeSelect>

        {/* Trạng thái hoạt động */}
        <NativeSelect
          value={status}
          onChange={setStatus}
          className="w-[180px]"
          selectClassName="bg-gray-50 border-gray-200"
          placeholder="Tất cả trạng thái"
        >
          <option value="all-status">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Không hoạt động</option>
        </NativeSelect>

        {/* Nút tìm kiếm */}
        <Button
          type="submit"
          className="bg-gray-900 hover:bg-gray-800 text-white px-6"
        >
          Search
        </Button>
      </div>
    </form>
  );
}
