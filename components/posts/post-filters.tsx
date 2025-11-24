"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { PostListQuery } from "@/types/interfaces/api/post";
import { useState } from "react";

interface PostFiltersProps {
  query: PostListQuery;
  onChangeQuery: (partial: Partial<PostListQuery>) => void;
}

export function PostFilters({ query, onChangeQuery }: PostFiltersProps) {
  const [search, setSearch] = useState(query.search ?? "");
  const [purpose, setPurpose] = useState(
    query.type ? query.type.toLowerCase() : "all-purpose"
  );
  const [status, setStatus] = useState(
    query.status ? query.status.toLowerCase() : "all-status"
  );

  const handleSearchClick = () => {
    const partial: Partial<PostListQuery> = {};

    partial.search = search || undefined;

    // map purpose -> type
    if (purpose === "all-purpose") {
      partial.type = undefined;
    } else if (purpose === "sale") {
      partial.type = "SALE";
    } else if (purpose === "rent") {
      partial.type = "RENT";
    }

    // map status
    if (status === "all-status") {
      partial.status = undefined;
    } else if (status === "pending") {
      partial.status = "PENDING";
    } else if (status === "approved") {
      partial.status = "APPROVED";
    } else if (status === "rejected") {
      partial.status = "REJECTED";
    }

    onChangeQuery(partial);
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Ô tìm kiếm */}
      <div className="flex-1">
        <Input
          placeholder="Tìm theo tiêu đề bài đăng..."
          className="bg-gray-50 border-gray-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchClick();
          }}
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
      <Button
        className="bg-gray-900 hover:bg-gray-800 text-white"
        onClick={handleSearchClick}
      >
        Search
      </Button>
    </div>
  );
}
