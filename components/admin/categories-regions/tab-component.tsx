"use client";

import { JSX, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TabDef, TabId } from "@/types/interfaces/category-region";
import CategoryPropertyTab from "./tabs/category-property-tab";
import AmenityTab from "./tabs/amenity-tab";
import NearbyFacilityTab from "./tabs/nearby-facility-tab";

const TABS: TabDef[] = [
  { id: "categories-property", label: "Danh mục bất động sản" },
  { id: "amenities", label: "Tiện nghi căn" },
  { id: "nearby-facilities", label: "Tiện ích xung quanh" },
];


const TAB_COMPONENTS: Record<TabId, (props: { searchQuery: string }) => JSX.Element> = {
  "categories-property": CategoryPropertyTab,
  "amenities": AmenityTab,
  "nearby-facilities": NearbyFacilityTab,
};

export default function TabsComponent() {
  const [activeTab, setActiveTab] = useState<TabId>("categories-property");
  const [search, setSearch] = useState("");

  const Active = useMemo(() => TAB_COMPONENTS[activeTab], [activeTab]);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Danh mục và tiện ích xung quanh</h2>
      </div>

      {/* Tabs + Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Button className="bg-gray-900 hover:bg-gray-800 text-white" onClick={() => {/* trigger search API if cần */ }}>
            Search
          </Button>
        </div>

        <div className="mt-4">
          <Input
            placeholder={
              activeTab === "categories-property"
                ? "Tìm theo loại bất động sản..."
                : activeTab === "amenities"
                  ? "Tìm tiện nghi..."
                  : "Tìm tiện ích xung quanh..."
            }
            className="max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Active Tab */}
      <Active searchQuery={search} />
    </div>
  );
}
