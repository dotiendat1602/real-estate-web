"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select";

export function UserFilters() {
  const [searchQuery, setSearchQuery] = useState("");

  // controlled state cho 3 select
  const [role, setRole] = useState("all-roles");
  const [status, setStatus] = useState("all-status");
  const [activation, setActivation] = useState("all-activation");

  return (
    <div className="space-y-4 mb-6">
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
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="agent">Agent</option>
          <option value="viewer">Viewer</option>
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
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </NativeSelect>

        {/* Kích hoạt tài khoản */}
        <NativeSelect
          value={activation}
          onChange={setActivation}
          className="w-[180px]"
          selectClassName="bg-gray-50 border-gray-200"
          placeholder="Tất cả trạng thái"
        >
          <option value="all-activation">Tất cả trạng thái</option>
          <option value="activated">Đã kích hoạt</option>
          <option value="not-activated">Chưa kích hoạt</option>
        </NativeSelect>

        {/* Nút tìm kiếm */}
        <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6">
          Search
        </Button>
      </div>
    </div>
  );
}
