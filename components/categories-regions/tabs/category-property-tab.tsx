"use client";

import { useState, useMemo } from "react";
import { useCategoriesProperty, useDeleteCategoryProperty } from "@/hooks/categories-regions/useCategoryProperty";
import { Button } from "@/components/ui/button";

export default function CategoryPropertyTab({ searchQuery }: { searchQuery: string }) {
  // Tuỳ backend, chỉnh pageIndex 1-based hoặc 0-based cho đúng
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  // Debounce search (đơn giản)
  const debouncedSearch = useMemo(() => searchQuery.trim(), [searchQuery]);

  const { data, isLoading, isError, refetch, isFetching } = useCategoriesProperty({
    search: debouncedSearch || undefined,
    pageIndex,
    pageSize,
    sortKey: "createdAt",
    sortOrder: "desc",
  });

  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategoryProperty();

  const items = data?.data ?? [];
  const total = data?.totalItems ?? 0;

  if (isLoading) return <div className="p-4">Đang tải danh mục…</div>;
  if (isError) return <div className="p-4 text-red-600">Lỗi tải danh mục.</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">
          {isFetching ? "Đang đồng bộ…" : `Tổng: ${total} danh mục`}
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      <ul className="divide-y border rounded-lg">
        {items.map((it) => (
          <li key={it.category_id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium text-gray-900">{it.category_name}</div>
              {it.category_description && <div className="text-sm text-gray-600">{it.category_description}</div>}
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                disabled={deleting}
                onClick={() => deleteCategory(it.category_id)}
              >
                Xoá
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination đơn giản */}
      <div className="flex items-center justify-end gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
          disabled={pageIndex <= 1}
        >
          Trang trước
        </Button>
        <span className="text-sm px-2">Trang {pageIndex}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((p) => p + 1)}
          disabled={items.length < pageSize}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}