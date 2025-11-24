"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PropertyListQuery } from "@/types/interfaces/api/property"
import { useState } from "react"

interface PropertyFiltersProps {
  onFilterChange: (query: PropertyListQuery) => void
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<PropertyListQuery>({
    pageIndex: 1,
    pageSize: 10,
  })

  const handleSearch = () => {
    onFilterChange(filters)
  }

  const handleInputChange = (field: keyof PropertyListQuery, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Search and Filters Row */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Tìm theo tên bất động sản..."
            className="w-full"
            value={filters.search || ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />
        </div>

        <select
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          value={filters.status || ""}
          onChange={(e) => handleInputChange("status", e.target.value || undefined)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Không hoạt động</option>
        </select>

        <Input
          type="number"
          placeholder="Giá từ..."
          className="w-32"
          value={filters.priceFrom || ""}
          onChange={(e) => handleInputChange("priceFrom", e.target.value ? Number(e.target.value) : undefined)}
        />

        <Input
          type="number"
          placeholder="Giá đến..."
          className="w-32"
          value={filters.priceTo || ""}
          onChange={(e) => handleInputChange("priceTo", e.target.value ? Number(e.target.value) : undefined)}
        />

        <Input
          type="number"
          placeholder="Tỉnh/thành"
          className="w-32"
          value={filters.province_id || ""}
          onChange={(e) => handleInputChange("province_id", e.target.value ? Number(e.target.value) : undefined)}
        />

        <Input
          type="number"
          placeholder="Quận/huyện"
          className="w-32"
          value={filters.district_id || ""}
          onChange={(e) => handleInputChange("district_id", e.target.value ? Number(e.target.value) : undefined)}
        />

        <Input
          type="number"
          placeholder="Phường/xã"
          className="w-32"
          value={filters.ward_id || ""}
          onChange={(e) => handleInputChange("ward_id", e.target.value ? Number(e.target.value) : undefined)}
        />

        <Button
          className="bg-gray-900 hover:bg-gray-800 text-white px-6"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </div>
  )
}