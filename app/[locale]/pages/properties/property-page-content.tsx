"use client"

import { Globe, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { PropertyFilters } from "@/components/properties/property-filters"
import { PropertyTable } from "@/components/properties/property-table"
import { useProperties } from "@/hooks/property/useProperty"
import { useState } from "react"
import { PropertyListQuery } from "@/types/interfaces/api/property"

export default function PropertiesPageContent() {
  const [query, setQuery] = useState<PropertyListQuery>({
    pageIndex: 1,
    pageSize: 10,
  })

  const { data, isLoading, error } = useProperties(query)

  return (
    <ProtectedLayout>
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Bất động sản</h1>
              <p className="text-sm text-gray-500 mt-1">
                Quản lý thông tin, hình ảnh và trạng thái của các bất động sản
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Danh sách bất động sản</h2>

            <PropertyFilters onFilterChange={setQuery} />
            <PropertyTable
              data={data?.data || []}
              isLoading={isLoading}
              pagination={{
                pageIndex: query.pageIndex || 1,
                pageSize: query.pageSize || 10,
                total: data?.totalItems || 0,
              }}
              onPaginationChange={setQuery}
            />
          </div>
        </div>
      </main>
    </ProtectedLayout>
  )
}
