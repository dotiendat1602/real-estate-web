"use client";

import dynamic from "next/dynamic";

export type NearbyUtilityProperty = {
  lat?: number | string | null;
  lon?: number | string | null;
  location?: string | null;
  title?: string | null;
};

export type NearbyUtilityItem = {
  distanceM?: number | string | null;
  travelTimeS?: number | null;
  utility?: {
    id: number;
    name?: string | null;
    utilityName?: string | null;
    utilityCategory?: string | null;
    lat?: number | string | null;
    lon?: number | string | null;
    location?: string | null;
  } | null;
};

const NearbyUtilitiesMapClient = dynamic(() => import("./nearby-utilities-map.client"), {
  ssr: false,
  loading: () => (
    <div className="h-[540px] rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-[#262626] dark:bg-[#0a0a0a] dark:text-white/60">
      Đang tải tiện ích xung quanh...
    </div>
  ),
});

type NearbyUtilitiesMapProps = {
  property?: NearbyUtilityProperty | null;
  utilities?: NearbyUtilityItem[];
};

export function NearbyUtilitiesMap({ property, utilities = [] }: NearbyUtilitiesMapProps) {
  return <NearbyUtilitiesMapClient property={property} utilities={utilities} />;
}
