"use client";

import dynamic from "next/dynamic";

import type { NearbyUtilityItem, NearbyUtilityProperty } from "@/components/client/post-detail/nearby-utilities-map";
import type { PropertyPlanningMapResponse } from "@/types/interfaces/api/planning";

const PlanningMapClient = dynamic(() => import("./planning-map.client"), {
  ssr: false,
  loading: () => (
    <div className="h-[560px] rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300">
      Đang tải bản đồ...
    </div>
  ),
});

type PlanningMapProps = {
  data?: PropertyPlanningMapResponse;
  property?: NearbyUtilityProperty | null;
  utilities?: NearbyUtilityItem[];
};

export function PlanningMap({ data, property, utilities = [] }: PlanningMapProps) {
  return <PlanningMapClient data={data} property={property} utilities={utilities} />;
}
