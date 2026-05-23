"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyListQuery } from "@/types/interfaces/api/property";

interface MyPropertiesFiltersProps {
  onFilterChange: (query: PropertyListQuery) => void;
}

export function MyPropertiesFilters({ onFilterChange }: MyPropertiesFiltersProps) {
  const [filters, setFilters] = useState<PropertyListQuery>({
    pageIndex: 1,
    pageSize: 10,
  });
  const [priceError, setPriceError] = useState("");

  const handleInputChange = (field: keyof PropertyListQuery, value: unknown) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (field: "priceFrom" | "priceTo", value: string) => {
    const nextValue = value ? Number(value) : undefined;
    handleInputChange(field, nextValue);
    if (nextValue !== undefined && nextValue < 0) setPriceError("Giá không được nhập số âm.");
    else setPriceError("");
  };

  const handleSearch = () => {
    if (Number(filters.priceFrom ?? 0) < 0 || Number(filters.priceTo ?? 0) < 0) {
      setPriceError("Giá không được nhập số âm.");
      return;
    }

    setPriceError("");
    onFilterChange(filters);
  };

  return (
    <div className="mb-6 space-y-2">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Tìm theo tên bất động sản..."
            className="w-full bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg placeholder:text-white/40"
            value={filters.search || ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        <select
          className="w-full lg:w-[220px] bg-[#0a0a0a] border border-[#262626] text-white h-11 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/60"
          value={(filters.status as string | undefined) || ""}
          onChange={(e) => handleInputChange("status", e.target.value || undefined)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Không hoạt động</option>
        </select>

        <Input
          type="number"
          min={0}
          placeholder="Giá từ..."
          className="w-full lg:w-40 bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg placeholder:text-white/40"
          value={(filters.priceFrom as number | undefined) ?? ""}
          onChange={(e) => handlePriceChange("priceFrom", e.target.value)}
        />

        <Input
          type="number"
          min={0}
          placeholder="Giá đến..."
          className="w-full lg:w-40 bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg placeholder:text-white/40"
          value={(filters.priceTo as number | undefined) ?? ""}
          onChange={(e) => handlePriceChange("priceTo", e.target.value)}
        />

        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white h-11 px-6 rounded-lg"
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
      </div>

      {priceError && <p className="text-sm text-red-400">{priceError}</p>}
    </div>
  );
}
