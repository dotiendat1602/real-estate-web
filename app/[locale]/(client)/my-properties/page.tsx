"use client";

import { useState } from "react";
import { Plus, Bell, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/property/useProperty";
import { PropertyListQuery } from "@/types/interfaces/api/property";
import { MyPropertiesTable } from "@/components/client/my-properties/my-properties-table";
import { MyPropertiesFilters } from "@/components/client/my-properties/my-properties-filters";
import { useRouter } from "next/navigation";

export default function MyPropertiesPage() {
  const router = useRouter();
  const [query, setQuery] = useState<PropertyListQuery>({
    pageIndex: 1,
    pageSize: 10,
    sortKey: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading, isError, refetch } = useProperties(query);

  const properties = data?.data ?? [];
  const pagination = {
    pageIndex: data?.pageIndex ?? query.pageIndex ?? 1,
    pageSize: query.pageSize ?? 10,
    total: data?.totalItems ?? 0,
  };

  const handleFilterChange = (newQuery: PropertyListQuery) => {
    setQuery((prev) => ({
      ...prev,
      ...newQuery,
      pageIndex: 1,
    }));
  };

  const handlePaginationChange = (newQuery: PropertyListQuery) => {
    setQuery((prev) => ({
      ...prev,
      ...newQuery,
    }));
  };

  return (
    <main className="flex-1 overflow-auto bg-[#0a0a0a] text-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-10 space-y-6">
        {/* Header */}
        <header className="bg-[#141414] border border-[#262626] rounded-2xl px-6 md:px-8 py-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Bất động sản của tôi
              </h1>
              <p className="text-sm text-white/60 mt-1">
                Quản lý các bất động sản bạn đã đăng
              </p>
            </div>
          </div>
        </header>

        {/* Content card */}
        <section className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">
                Danh sách bất động sản
              </h2>
              <p className="text-sm text-white/60 mt-1">
                Tìm kiếm, lọc và quản lý tin đăng
              </p>
            </div>

            <Button
              onClick={() => router.push("/my-properties/create")}
              className="bg-purple-600 hover:bg-purple-700 text-white h-11 px-5 rounded-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm mới
            </Button>
          </div>

          <MyPropertiesFilters onFilterChange={handleFilterChange} />

          <MyPropertiesTable
            data={properties}
            isLoading={isLoading}
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
          />
        </section>
      </div>
    </main>
  );
}
