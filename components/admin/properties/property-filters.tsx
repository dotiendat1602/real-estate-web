"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { useDistricts, useProvinces, useWards } from "@/hooks/categories-regions/useLocation";
import { PropertyListQuery } from "@/types/interfaces/api/property";

interface PropertyFiltersProps {
  onFilterChange: (query: PropertyListQuery) => void;
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<PropertyListQuery>({
    pageIndex: 1,
    pageSize: 10,
  });
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [wardId, setWardId] = useState("");
  const [priceError, setPriceError] = useState("");

  const provincesQ = useProvinces();
  const districtsQ = useDistricts(provinceId ? Number(provinceId) : undefined);
  const wardsQ = useWards(districtId ? Number(districtId) : undefined);

  const handleInputChange = (field: keyof PropertyListQuery, value: unknown) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const parsePrice = (value: string) => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const validatePrices = () => {
    const priceFrom = Number(filters.priceFrom ?? 0);
    const priceTo = Number(filters.priceTo ?? 0);

    if (priceFrom < 0 || priceTo < 0) {
      setPriceError("Giá không được nhập số âm.");
      return false;
    }

    setPriceError("");
    return true;
  };

  const handleSearch = () => {
    if (!validatePrices()) return;

    onFilterChange({
      ...filters,
      pageIndex: 1,
      provinceId: provinceId ? Number(provinceId) : undefined,
      districtId: districtId ? Number(districtId) : undefined,
      wardId: wardId ? Number(wardId) : undefined,
    });
  };

  const handleClearLocation = () => {
    setProvinceId("");
    setDistrictId("");
    setWardId("");
    onFilterChange({
      ...filters,
      pageIndex: 1,
      provinceId: undefined,
      districtId: undefined,
      wardId: undefined,
    });
  };

  return (
    <div className="mb-6 space-y-2">
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_180px_140px_140px_170px_180px_180px_auto_auto]">
        <Input
          type="text"
          placeholder="Tìm theo tên bất động sản..."
          className="bg-gray-50 border-gray-200"
          value={filters.search || ""}
          onChange={(e) => handleInputChange("search", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />

        <NativeSelect
          value={(filters.status as string | undefined) || ""}
          onChange={(value) => handleInputChange("status", value || undefined)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Không hoạt động</option>
        </NativeSelect>

        <Input
          type="number"
          min={0}
          placeholder="Giá từ..."
          value={filters.priceFrom ?? ""}
          onChange={(e) => {
            const nextValue = parsePrice(e.target.value);
            handleInputChange("priceFrom", nextValue);
            if (nextValue !== undefined && nextValue < 0) setPriceError("Giá không được nhập số âm.");
            else setPriceError("");
          }}
        />

        <Input
          type="number"
          min={0}
          placeholder="Giá đến..."
          value={filters.priceTo ?? ""}
          onChange={(e) => {
            const nextValue = parsePrice(e.target.value);
            handleInputChange("priceTo", nextValue);
            if (nextValue !== undefined && nextValue < 0) setPriceError("Giá không được nhập số âm.");
            else setPriceError("");
          }}
        />

        <NativeSelect
          value={provinceId}
          onChange={(value) => {
            setProvinceId(value);
            setDistrictId("");
            setWardId("");
          }}
        >
          <option value="">Tất cả tỉnh/thành</option>
          {provincesQ.data?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </NativeSelect>

        <NativeSelect
          value={districtId}
          onChange={(value) => {
            setDistrictId(value);
            setWardId("");
          }}
          disabled={!provinceId}
        >
          <option value="">Tất cả quận/huyện</option>
          {districtsQ.data?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </NativeSelect>

        <NativeSelect
          value={wardId}
          onChange={setWardId}
          disabled={!districtId}
        >
          <option value="">Tất cả phường/xã</option>
          {wardsQ.data?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </NativeSelect>

        <Button className="bg-gray-900 hover:bg-gray-800 text-white" onClick={handleSearch}>
          Tìm kiếm
        </Button>

        <Button
          variant="outline"
          onClick={handleClearLocation}
          disabled={!provinceId && !districtId && !wardId}
        >
          Xóa tìm kiếm
        </Button>
      </div>

      {priceError && <p className="text-sm text-red-600">{priceError}</p>}
    </div>
  );
}
