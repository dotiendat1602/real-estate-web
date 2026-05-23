"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [role, setRole] = useState("all-roles");
  const [status, setStatus] = useState("all-status");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onApply?.({
      search: searchQuery.trim() || undefined,
      role: role === "all-roles" ? undefined : role,
      status: status === "all-status" ? undefined : status,
    });
  };

  return (
    <form className="mb-6 space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Input
          placeholder="Tìm theo email, tên, số điện thoại..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="flex-1 border-gray-200 bg-gray-50"
        />

        <NativeSelect
          value={role}
          onChange={setRole}
          className="w-full lg:w-[180px]"
          selectClassName="border-gray-200 bg-gray-50"
        >
          <option value="all-roles">Tất cả vai trò</option>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="AGENT">Agent</option>
          <option value="USER">User</option>
        </NativeSelect>

        <NativeSelect
          value={status}
          onChange={setStatus}
          className="w-full lg:w-[190px]"
          selectClassName="border-gray-200 bg-gray-50"
        >
          <option value="all-status">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Không hoạt động</option>
        </NativeSelect>

        <Button
          type="submit"
          className="cursor-pointer bg-gray-900 px-6 text-white hover:bg-gray-800"
        >
          Tìm kiếm
        </Button>
      </div>
    </form>
  );
}
