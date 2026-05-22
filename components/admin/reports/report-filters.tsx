"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { ReportStatus, type ReportListQuery } from "@/types/interfaces/api/post";

interface ReportFiltersProps {
  query: ReportListQuery;
  onChangeQuery: (partial: Partial<ReportListQuery>) => void;
}

export function ReportFilters({ query, onChangeQuery }: ReportFiltersProps) {
  const hasActiveFilters = !!query.search || !!query.status;

  const handleClearFilters = () => {
    onChangeQuery({
      search: undefined,
      status: undefined,
      pageIndex: 1,
    });
  };

  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Tìm theo ID bài đăng, lý do..."
          value={query.search ?? ""}
          onChange={(event) =>
            onChangeQuery({ search: event.target.value, pageIndex: 1 })
          }
          className="pl-9"
        />
      </div>

      <NativeSelect
        value={query.status ?? "all"}
        onChange={(value) =>
          onChangeQuery({
            status: value === "all" ? undefined : value,
            pageIndex: 1,
          })
        }
        className="w-full lg:w-[220px]"
        selectClassName="bg-white"
      >
        <option value="all">Tất cả báo cáo</option>
        <option value={ReportStatus.PENDING}>Chưa xử lý</option>
        <option value={ReportStatus.RESOLVED}>Đã xử lý</option>
      </NativeSelect>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="cursor-pointer gap-2"
        >
          <X className="h-4 w-4" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}
