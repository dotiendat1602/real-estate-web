"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select";

import { AppointmentListQuery } from "@/types/interfaces/api/appointment";
import { AppointmentStatus } from "@/types/enums/appointment";

interface AppointmentFiltersProps {
  query: AppointmentListQuery;
  onChangeQuery: (partial: Partial<AppointmentListQuery>) => void;
}

export function AppointmentFilters({
  query,
  onChangeQuery,
}: AppointmentFiltersProps) {
  const [searchInput, setSearchInput] = useState(query.search ?? "");

  useEffect(() => {
    setSearchInput(query.search ?? "");
  }, [query.search]);

  const handleApplySearch = () => {
    onChangeQuery({
      search: searchInput || undefined,
      pageIndex: 1,
    });
  };

  const handleChangeStatus = (value: string) => {
    onChangeQuery({
      status: value === "all" ? undefined : value,
      pageIndex: 1,
    });
  };

  const handleChangeDateFrom = (value: string) => {
    onChangeQuery({
      date_from: value || undefined,
      pageIndex: 1,
    });
  };

  const handleChangeDateTo = (value: string) => {
    onChangeQuery({
      date_to: value || undefined,
      pageIndex: 1,
    });
  };

  const handleReset = () => {
    setSearchInput("");
    onChangeQuery({
      search: undefined,
      status: undefined,
      date_from: undefined,
      date_to: undefined,
      pageIndex: 1,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search */}
      <div className="flex-1 min-w-[220px]">
        <Input
          placeholder="Tìm theo property, buyer, seller..."
          className="w-full"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleApplySearch();
          }}
        />
      </div>

      {/* Date from */}
      <Input
        type="date"
        className="w-40"
        value={query.date_from ?? ""}
        onChange={(e) => handleChangeDateFrom(e.target.value)}
      />

      {/* Date to */}
      <Input
        type="date"
        className="w-40"
        value={query.date_to ?? ""}
        onChange={(e) => handleChangeDateTo(e.target.value)}
      />

      {/* Status */}
      <NativeSelect
        value={query.status ?? "all"}
        onChange={handleChangeStatus}
        className="w-48"
        selectClassName="bg-gray-50 border-gray-200"
        placeholder="Tất cả trạng thái"
      >
        <option value="all">Tất cả trạng thái</option>
        <option value={AppointmentStatus.SCHEDULED}>Scheduled</option>
        <option value={AppointmentStatus.COMPLETED}>Completed</option>
        <option value={AppointmentStatus.RESCHEDULED}>Rescheduled</option>
        {/* nếu có CANCELED thì thêm ở đây */}
      </NativeSelect>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          className="bg-gray-900 hover:bg-gray-800"
          onClick={handleApplySearch}
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button
          variant="outline"
          className="border-gray-200"
          onClick={handleReset}
        >
          Xoá lọc
        </Button>
      </div>
    </div>
  );
}
