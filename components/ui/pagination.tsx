"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
  isLoading?: boolean;
  labels?: {
    showing?: string;
    totalPrefix?: string;
    empty?: string;
    rowsPerPage?: string;
    previous?: string;
    next?: string;
  };
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  itemLabel = "kết quả",
  isLoading = false,
  labels,
  className,
}: PaginationProps) {
  const computedTotalPages =
    totalPages ?? (pageSize && totalItems !== undefined ? Math.ceil(totalItems / pageSize) : 1);
  const safeTotalPages = Math.max(1, computedTotalPages || 1);
  const safeCurrentPage = Math.max(1, Math.min(currentPage || 1, safeTotalPages));
  const safePageSize = Math.max(1, pageSize || pageSizeOptions[0] || 10);
  const hasItems = (totalItems ?? 0) > 0;
  const copy = {
    showing: labels?.showing ?? "Hiển thị",
    totalPrefix: labels?.totalPrefix ?? "trong tổng số",
    empty: labels?.empty ?? "Không có",
    rowsPerPage: labels?.rowsPerPage ?? "Số dòng/trang",
    previous: labels?.previous ?? "Trước",
    next: labels?.next ?? "Sau",
  };

  const pageStart = Math.max(1, safeCurrentPage - 2);
  const pageEnd = Math.min(safeTotalPages, pageStart + 4);
  const adjustedStart = Math.max(1, pageEnd - 4);
  const visiblePages = Array.from(
    { length: pageEnd - adjustedStart + 1 },
    (_, index) => adjustedStart + index
  );

  const from = hasItems && totalItems !== undefined ? (safeCurrentPage - 1) * safePageSize + 1 : 0;
  const to =
    hasItems && totalItems !== undefined
      ? Math.min(safeCurrentPage * safePageSize, totalItems)
      : 0;

  const goToPage = (page: number) => {
    const nextPage = Math.max(1, Math.min(page, safeTotalPages));
    if (nextPage !== safeCurrentPage) onPageChange(nextPage);
  };

  if (safeTotalPages <= 1 && !onPageSizeChange && totalItems === undefined) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-zinc-200 pt-4 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        {totalItems !== undefined && (
          <span>
            {hasItems
              ? `${copy.showing} ${from}-${to} ${copy.totalPrefix} ${totalItems} ${itemLabel}`
              : `${copy.empty} ${itemLabel}`}
          </span>
        )}

        {onPageSizeChange && (
          <label className="flex items-center gap-2">
            <span>{copy.rowsPerPage}</span>
            <NativeSelect
              value={String(safePageSize)}
              onChange={(value) => onPageSizeChange(Number(value))}
              className="w-24"
              selectClassName="h-9"
              disabled={isLoading}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </NativeSelect>
          </label>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safeCurrentPage <= 1 || isLoading}
          onClick={() => goToPage(safeCurrentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          {copy.previous}
        </Button>

        <div className="flex items-center gap-1">
          {visiblePages.map((page) => (
            <Button
              key={page}
              type="button"
              variant={page === safeCurrentPage ? "default" : "outline"}
              size="sm"
              disabled={isLoading}
              onClick={() => goToPage(page)}
              className={cn("h-9 min-w-9 px-3", page === safeCurrentPage && "bg-zinc-900 text-white")}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safeCurrentPage >= safeTotalPages || isLoading}
          onClick={() => goToPage(safeCurrentPage + 1)}
        >
          {copy.next}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
