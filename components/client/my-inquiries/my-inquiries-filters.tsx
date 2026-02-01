"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select";
import { Search } from "lucide-react";
import { LeadStatus } from "@/types/interfaces/api/inquiry.interface";

export interface InquiryFilters {
  search: string;
  status: LeadStatus | "ALL";
}

interface MyInquiriesFiltersProps {
  filters: InquiryFilters;
  onFiltersChange: (filters: InquiryFilters) => void;
  onApply: () => void;
}

const STATUS_OPTIONS: { value: LeadStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: LeadStatus.NEW, label: "Mới" },
  { value: LeadStatus.CONTACTED, label: "Đã liên hệ" },
  { value: LeadStatus.FOLLOW_UP, label: "Đang theo dõi" },
  { value: LeadStatus.NEGOTIATION, label: "Đang thương lượng" },
  { value: LeadStatus.CONVERTED, label: "Đã chuyển đổi" },
  { value: LeadStatus.LOST, label: "Mất" },
  { value: LeadStatus.ARCHIVED, label: "Lưu trữ" },
];

export function MyInquiriesFilters({
  filters,
  onFiltersChange,
  onApply,
}: MyInquiriesFiltersProps) {
  return (
    <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_auto] gap-4">
        <div>
          <Input
            type="text"
            placeholder="Search by name, email, phone, message..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") onApply();
            }}
            className="bg-[#0a0a0a] border-[#262626] text-white h-10"
          />
        </div>

        <div>
          <NativeSelect
            value={filters.status}
            onChange={(v) =>
              onFiltersChange({ ...filters, status: v as LeadStatus | "ALL" })
            }
            className="w-full"
            selectClassName="bg-[#0a0a0a] border-[#262626] text-white h-10"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div>
          <Button
            onClick={onApply}
            className="bg-purple-600 hover:bg-purple-700 text-white h-10 w-full md:w-auto"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
