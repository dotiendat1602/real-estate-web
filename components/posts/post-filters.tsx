"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";

export function PostFilters() {
  const [purpose, setPurpose] = React.useState("all-purpose");
  const [status, setStatus] = React.useState("all-status");

  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Ô tìm kiếm */}
      <div className="flex-1">
        <Input
          placeholder="Tìm theo tiêu đề bài đăng..."
          className="bg-gray-50 border-gray-200"
        />
      </div>

      {/* Chọn mục đích */}
      <NativeSelect
        value={purpose}
        onChange={setPurpose}
        className="w-[180px]"
        placeholder="Tất cả mục đích"
      >
        <option value="all-purpose">Tất cả mục đích</option>
        <option value="sale">Bán</option>
        <option value="rent">Cho thuê</option>
      </NativeSelect>

      {/* Chọn trạng thái */}
      <NativeSelect
        value={status}
        onChange={setStatus}
        className="w-[180px]"
        placeholder="Tất cả trạng thái"
      >
        <option value="all-status">Tất cả trạng thái</option>
        <option value="pending">Chờ duyệt</option>
        <option value="approved">Đã duyệt</option>
        <option value="rejected">Từ chối</option>
      </NativeSelect>

      {/* Nút tìm kiếm */}
      <Button className="bg-gray-900 hover:bg-gray-800 text-white">
        Search
      </Button>
    </div>
  );
}
