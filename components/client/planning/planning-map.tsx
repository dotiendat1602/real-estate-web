"use client";

import dynamic from "next/dynamic";
import { PropertyPlanningMapResponse } from "@/types/interfaces/api/planning";

const PlanningMapClient = dynamic(() => import("./planning-map.client"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] rounded-xl border border-zinc-700 bg-zinc-900/70 p-4 text-zinc-300">
      Đang tải bản đồ quy hoạch...
    </div>
  ),
});

type PlanningMapProps = {
  data?: PropertyPlanningMapResponse;
};

export function PlanningMap({ data }: PlanningMapProps) {
  return <PlanningMapClient data={data} />;
}
