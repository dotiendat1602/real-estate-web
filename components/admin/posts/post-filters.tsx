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

  const handleSearchClick = () => {
    const partial: Partial<PostListQuery> = {};

    partial.search = search || undefined;

    // map purpose -> type
    if (purpose === "all-purpose") {
      partial.type = undefined;
    } else if (purpose === "SALE") {
      partial.type = "SALE";
    } else if (purpose === "RENT") {
      partial.type = "RENT";
    } else if (purpose === "OTHER") {
      partial.type = "OTHER";
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

      <NativeSelect
        value={purpose}
        onChange={setPurpose}
        className="w-[180px]"
        placeholder="Tất cả mục đích"
      >
        <option value="all-purpose">Tất cả mục đích</option>
        <option value="SALE">Bán</option>
        <option value="RENT">Cho thuê</option>
        <option value="OTHER">Khác</option>
      </NativeSelect>

      <Button
        className="bg-gray-900 hover:bg-gray-800 text-white"
        onClick={handleSearchClick}
      >
        Tìm kiếm
      </Button>
    </div>
  );
}
