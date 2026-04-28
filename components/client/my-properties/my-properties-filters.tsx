"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyListQuery } from "@/types/interfaces/api/property";
import { useState } from "react";

interface MyPropertiesFiltersProps {
  onFilterChange: (query: PropertyListQuery) => void;
}

export function MyPropertiesFilters({ onFilterChange }: MyPropertiesFiltersProps) {
  const [filters, setFilters] = useState<PropertyListQuery>({
    pageIndex: 1,
    pageSize: 10,
  });

  const handleSearch = () => {
    onFilterChange(filters);
  };

  const handleInputChange = (field: keyof PropertyListQuery, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Tìm theo tên bất động sản..."
            className="w-full bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg placeholder:text-white/40"
            value={filters.search || ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />
        </div>

        <select
          className="w-full lg:w-[220px] bg-[#0a0a0a] border border-[#262626] text-white h-11 rounded-lg px-4 text-sm
                     focus:outline-none focus:ring-2 focus:ring-purple-600/60"
          value={(filters.status as any) || ""}
          onChange={(e) => handleInputChange("status", e.target.value || undefined)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Không hoạt động</option>
        </select>

        <Input
          type="number"
          placeholder="Giá từ..."
          className="w-full lg:w-40 bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg placeholder:text-white/40"
          value={(filters.priceFrom as any) || ""}
          onChange={(e) =>
            handleInputChange(
              "priceFrom",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        />

        <Input
          type="number"
          placeholder="Giá đến..."
          className="w-full lg:w-40 bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg placeholder:text-white/40"
          value={(filters.priceTo as any) || ""}
          onChange={(e) =>
            handleInputChange(
              "priceTo",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        />

        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white h-11 px-6 rounded-lg"
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
