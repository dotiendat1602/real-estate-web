"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostListQuery } from "@/types/interfaces/api/post";
import { useState } from "react";
import { NativeSelect } from "@/components/ui/select";

interface MyPostsFiltersProps {
  onFilterChange: (query: PostListQuery) => void;
}

export function MyPostsFilters({ onFilterChange }: MyPostsFiltersProps) {
  const [filters, setFilters] = useState<PostListQuery>({
    pageIndex: 1,
    pageSize: 10,
  });

  const handleSearch = () => onFilterChange(filters);

  const handleInputChange = (field: keyof PostListQuery, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Tìm theo tiêu đề bài đăng..."
            className="w-full bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg placeholder:text-white/40"
            value={filters.search || ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />
        </div>

        <NativeSelect
          value={(filters.type as string) || ""}
          onChange={(v) => handleInputChange("type", v || undefined)}
          placeholder="Tất cả loại"
          selectClassName="bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg min-w-[160px]"
        >
          <option value="">Tất cả loại</option>
          <option value="SALE">Bán</option>
          <option value="RENT">Cho thuê</option>
        </NativeSelect>

        <NativeSelect
          value={(filters.status as string) || ""}
          onChange={(v) => handleInputChange("status", v || undefined)}
          placeholder="Tất cả trạng thái"
          selectClassName="bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg min-w-[180px]"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="DRAFT">Nháp</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Bị từ chối</option>
          <option value="ARCHIVED">Đã lưu trữ</option>
        </NativeSelect>

        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white h-11 px-6 rounded-lg"
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
