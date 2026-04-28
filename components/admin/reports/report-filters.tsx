"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { ReportListQuery } from "@/types/interfaces/api/post";

interface ReportFiltersProps {
  query: ReportListQuery;
  onChangeQuery: (partial: Partial<ReportListQuery>) => void;
}

export function ReportFilters({ query, onChangeQuery }: ReportFiltersProps) {
  const hasActiveFilters = !!query.search;

  const handleClearFilters = () => {
    onChangeQuery({
      search: undefined,
      pageIndex: 1,
    });
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm theo ID bài đăng, lý do..."
          value={query.search ?? ""}
          onChange={(e) => onChangeQuery({ search: e.target.value, pageIndex: 1 })}
          className="pl-9"
        />
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}
