"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/select";

export function DepositFilters() {
  const [status, setStatus] = useState("all");

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1">
        <Input placeholder="Tìm theo property, buyer, seller..." className="w-full" />
      </div>
      <Input type="text" placeholder="dd/mm/yyyy" className="w-40" />
      <Input type="text" placeholder="dd/mm/yyyy" className="w-40" />

      <NativeSelect
        value={status}
        onChange={setStatus}
        className="w-48"
        selectClassName="bg-gray-50 border-gray-200"
        placeholder="Tất cả trạng thái"
      >
        <option value="all">Tất cả trạng thái</option>
        <option value="confirmed">Confirmed</option>
        <option value="refunded">Refunded</option>
        <option value="cancelled">Cancelled</option>
      </NativeSelect>

      <Button className="bg-gray-900 hover:bg-gray-800">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  );
}
