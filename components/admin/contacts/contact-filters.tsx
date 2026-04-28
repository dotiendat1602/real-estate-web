"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { NativeSelect } from "@/components/ui/select";

export interface ContactFiltersState {
  search: string;
  status: string;
}

interface ContactFiltersProps {
  filters: ContactFiltersState;
  onFiltersChange: (filters: ContactFiltersState) => void;
  onApply: () => void;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Status" },
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

export function ContactFilters({ filters, onFiltersChange, onApply }: ContactFiltersProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3">
        <div>
          <Input
            type="text"
            placeholder="Search by name, email, phone, topic, subject..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") onApply();
            }}
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-10"
          />
        </div>

        <div>
          <NativeSelect
            value={filters.status}
            onChange={(value) => onFiltersChange({ ...filters, status: value })}
            className="w-full"
            selectClassName="bg-white border-gray-300 text-gray-900 h-10"
            aria-label="Status"
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
