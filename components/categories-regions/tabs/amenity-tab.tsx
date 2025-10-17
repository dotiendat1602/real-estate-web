"use client";

import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

type Row = { id: number; name: string; description?: string; createdDate?: string };

export default function AmenityTab({ searchQuery }: { searchQuery: string }) {
  // TODO: thay bằng fetch('/api/amenities?search=...')
  const [rows] = useState<Row[]>([
    { id: 11, name: "Hồ bơi" },
    { id: 12, name: "Phòng gym" },
    { id: 13, name: "Sân chơi trẻ em" },
  ]);
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return q ? rows.filter((r) => r.name.toLowerCase().includes(q)) : rows;
  }, [rows, searchQuery]);

  const allIds = filtered.map((r) => r.id);
  const all = allIds.length > 0 && allIds.every((id) => selected.includes(id));

  return (
    <>
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={all}
            onCheckedChange={() =>
              setSelected((prev) => (all ? prev.filter((id) => !allIds.includes(id)) : Array.from(new Set([...prev, ...allIds]))))
            }
          />
          <span className="text-sm text-gray-700">Chọn tất cả</span>
          <span className="text-sm text-gray-500">{selected.length} mục đã được chọn</span>
        </div>
      </div>

      <ul className="divide-y">
        {filtered.map((r) => (
          <li key={r.id} className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <Checkbox checked={selected.includes(r.id)} onCheckedChange={() =>
                setSelected((prev) => (prev.includes(r.id) ? prev.filter((x) => x !== r.id) : [...prev, r.id]))
              } />
              <span className="text-sm font-medium text-gray-900">{r.name}</span>
            </div>
            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
          </li>
        ))}
        {filtered.length === 0 && <li className="px-6 py-8 text-center text-sm text-gray-500">Không có tiện nghi.</li>}
      </ul>
    </>
  );
}
