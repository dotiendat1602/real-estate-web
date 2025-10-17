"use client";

import { useMemo } from "react";

type Facility = { id: number; name: string; distanceKm: number; type: "school" | "hospital" | "park" | "mall" };

export default function NearbyFacilityTab({ searchQuery }: { searchQuery: string }) {
  // TODO: thay bằng API /facilities?search=
  const facilities: Facility[] = [
    { id: 21, name: "Vincom Mega Mall", distanceKm: 1.2, type: "mall" },
    { id: 22, name: "Trường THPT ABC", distanceKm: 0.8, type: "school" },
    { id: 23, name: "Bệnh viện XYZ", distanceKm: 2.1, type: "hospital" },
  ];

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return q ? facilities.filter((f) => f.name.toLowerCase().includes(q)) : facilities;
  }, [searchQuery]);

  return (
    <div className="px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((f) => (
          <div key={f.id} className="border rounded-lg p-4">
            <div className="text-sm text-gray-500 uppercase">{f.type}</div>
            <div className="font-medium">{f.name}</div>
            <div className="text-sm text-gray-600">{f.distanceKm} km</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-gray-500 py-8">Không có tiện ích phù hợp.</div>
        )}
      </div>
    </div>
  );
}
