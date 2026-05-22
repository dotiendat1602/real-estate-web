"use client";

import { useState } from "react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PropertyFilters } from "@/components/admin/properties/property-filters";
import { PropertyTable } from "@/components/admin/properties/property-table";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { useProperties } from "@/hooks/property/useProperty";
import { PropertyListQuery } from "@/types/interfaces/api/property";

export default function PropertiesPageContent() {
  const [query, setQuery] = useState<PropertyListQuery>({
    pageIndex: 1,
    pageSize: 10,
  });

  const { data, isLoading } = useProperties(query);

  const handleQueryChange = (partial: PropertyListQuery) => {
    setQuery((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  return (
    <ProtectedLayout>
      <main className="flex-1 overflow-auto">
        <AdminPageHeader
          title="Bất động sản"
          description="Quản lý thông tin, hình ảnh và trạng thái của các bất động sản"
        />

        <div className="p-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">Danh sách bất động sản</h2>

            <PropertyFilters onFilterChange={handleQueryChange} />
            <PropertyTable
              data={data?.data || []}
              isLoading={isLoading}
              pagination={{
                pageIndex: query.pageIndex || 1,
                pageSize: query.pageSize || 10,
                total: data?.totalItems || 0,
              }}
              onPaginationChange={handleQueryChange}
            />
          </div>
        </div>
      </main>
    </ProtectedLayout>
  );
}
