"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { useDistricts, useProvinces, useWards } from "@/hooks/categories-regions/useLocation";
import { PostListQuery } from "@/types/interfaces/api/post";
import { useState } from "react";

interface PostFiltersProps {
  query: PostListQuery;
  onChangeQuery: (partial: Partial<PostListQuery>) => void;
}

export function PostFilters({ query, onChangeQuery }: PostFiltersProps) {
  const [search, setSearch] = useState(query.search ?? "");
  const [purpose, setPurpose] = useState(query.type ?? "all-purpose");
  const [provinceId, setProvinceId] = useState(query.provinceId ? String(query.provinceId) : "");
  const [districtId, setDistrictId] = useState(query.districtId ? String(query.districtId) : "");
  const [wardId, setWardId] = useState(query.wardId ? String(query.wardId) : "");

  const provincesQ = useProvinces();
  const districtsQ = useDistricts(provinceId ? Number(provinceId) : undefined);
  const wardsQ = useWards(districtId ? Number(districtId) : undefined);

  const handleSearchClick = () => {
    onChangeQuery({
      search: search || undefined,
      type: purpose === "all-purpose" ? undefined : purpose,
      provinceId: provinceId ? Number(provinceId) : undefined,
      districtId: districtId ? Number(districtId) : undefined,
      wardId: wardId ? Number(wardId) : undefined,
    });
  };

  const handleClearLocation = () => {
    setProvinceId("");
    setDistrictId("");
    setWardId("");
    onChangeQuery({
      provinceId: undefined,
      districtId: undefined,
      wardId: undefined,
    });
  };

  return (
    <div className="mb-6 grid gap-3 lg:grid-cols-[minmax(220px,1fr)_180px_170px_180px_180px_auto_auto]">
      <Input
        placeholder="Tìm theo tiêu đề, nội dung hoặc địa chỉ..."
        className="bg-gray-50 border-gray-200"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearchClick();
        }}
      />

      <NativeSelect
        value={purpose}
        onChange={setPurpose}
      >
        <option value="all-purpose">Tất cả mục đích</option>
        <option value="SALE">Bán</option>
        <option value="RENT">Cho thuê</option>
        <option value="OTHER">Khác</option>
      </NativeSelect>

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

      <Button
        className="bg-gray-900 hover:bg-gray-800 text-white"
        onClick={handleSearchClick}
      >
        Tìm kiếm
      </Button>

      <Button
        variant="outline"
        onClick={handleClearLocation}
        disabled={!provinceId && !districtId && !wardId}
      >
        Xóa vị trí
      </Button>
    </div>
  );
}
