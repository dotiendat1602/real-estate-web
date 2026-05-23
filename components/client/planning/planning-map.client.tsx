"use client";

import { useMemo, useState } from "react";
import L from "leaflet";
import { Bike, HeartPulse, MapPinned, School, ShoppingCart, TreePine, Utensils } from "lucide-react";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { NearbyUtilityItem, NearbyUtilityProperty } from "@/components/client/post-detail/nearby-utilities-map";
import type { PropertyPlanningMapResponse } from "@/types/interfaces/api/planning";

type PlanningMapClientProps = {
  data?: PropertyPlanningMapResponse;
  property?: NearbyUtilityProperty | null;
  utilities?: NearbyUtilityItem[];
};

const propertyMarkerSvg = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42"><path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 26 16 26s16-14 16-26C32 7.2 24.8 0 16 0z" fill="#ef4444"/><circle cx="16" cy="16" r="6" fill="#fff"/></svg>',
);

const propertyIcon = new L.Icon({
  iconUrl: `data:image/svg+xml,${propertyMarkerSvg}`,
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -38],
});

const utilityIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 32],
  iconAnchor: [10, 32],
});

const CATEGORIES = [
  { key: "EDUCATION", label: "Trường học", icon: School },
  { key: "COMMERCIAL_SHOPPING", label: "Siêu thị", icon: ShoppingCart },
  { key: "PARK_PLAZA", label: "Công viên", icon: TreePine },
  { key: "HEALTHCARE", label: "Bệnh viện", icon: HeartPulse },
  { key: "DINING", label: "Nhà hàng", icon: Utensils },
] as const;

function toNumber(value?: number | string | null) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function utilityName(item: NearbyUtilityItem) {
  return item.utility?.utilityName || item.utility?.name || "Tiện ích";
}

function formatDistance(value?: number | string | null) {
  const meters = toNumber(value);
  if (meters === null) return "Không rõ";
  if (meters >= 1000) return `${(meters / 1000).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} km`;
  return `${meters.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} m`;
}

function formatTravelTime(seconds?: number | null) {
  if (!seconds && seconds !== 0) return "Không rõ";
  return `${Math.max(0, Math.round(seconds / 60))} phút`;
}

export default function PlanningMapClient({
  data,
  property,
  utilities = [],
}: PlanningMapClientProps) {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]["key"]>("EDUCATION");

  const propertyLat = toNumber(data?.property?.lat) ?? toNumber(property?.lat);
  const propertyLon = toNumber(data?.property?.lng) ?? toNumber(property?.lon);

  const grouped = useMemo(() => {
    const map = new Map<string, NearbyUtilityItem[]>();
    for (const category of CATEGORIES) map.set(category.key, []);

    for (const item of utilities) {
      const category = item.utility?.utilityCategory;
      if (!category || !map.has(category)) continue;
      map.get(category)?.push(item);
    }

    for (const category of CATEGORIES) {
      map.get(category.key)?.sort((a, b) => {
        const da = toNumber(a.distanceM) ?? Number.POSITIVE_INFINITY;
        const db = toNumber(b.distanceM) ?? Number.POSITIVE_INFINITY;
        return da - db;
      });
    }

    return map;
  }, [utilities]);

  const activeItems = grouped.get(activeCategory) ?? [];
  const activeMeta = CATEGORIES.find((category) => category.key === activeCategory) ?? CATEGORIES[0];
  const itemsWithCoords = activeItems.filter(
    (item) => toNumber(item.utility?.lat) !== null && toNumber(item.utility?.lon) !== null,
  );

  if (propertyLat === null || propertyLon === null) {
    return (
      <div className="h-[360px] rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300">
        Bất động sản chưa có tọa độ để hiển thị bản đồ.
      </div>
    );
  }

  return (
    <div className="relative z-0 isolate overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-[#262626] dark:bg-[#0a0a0a]">
      <div className="h-[360px] border-b border-zinc-200 dark:border-[#262626]">
        <MapContainer center={[propertyLat, propertyLon]} zoom={15} className="relative z-0 h-full w-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[propertyLat, propertyLon]} icon={propertyIcon}>
            <Popup>{property?.title || property?.location || "Vị trí bất động sản"}</Popup>
          </Marker>

          {(data?.layers || []).map((layer) => (
            <GeoJSON
              key={layer.id}
              data={layer.geojson}
              style={{
                color: layer.style.stroke,
                fillColor: layer.style.fill,
                fillOpacity: 0.35,
                weight: 2,
              }}
            />
          ))}

          {itemsWithCoords.map((item) => {
            const lat = toNumber(item.utility?.lat);
            const lon = toNumber(item.utility?.lon);
            if (lat === null || lon === null) return null;

            return (
              <Marker key={`${item.utility?.id}-${activeCategory}`} position={[lat, lon]} icon={utilityIcon}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold">{utilityName(item)}</div>
                    {item.utility?.location ? <div>{item.utility.location}</div> : null}
                    <div>{formatDistance(item.distanceM)}</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="overflow-x-auto border-b border-zinc-200 dark:border-[#262626]">
        <div className="flex min-w-max">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const active = category.key === activeCategory;
            const count = grouped.get(category.key)?.length ?? 0;

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => setActiveCategory(category.key)}
                className={[
                  "flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium transition-colors",
                  active
                    ? "border-red-500 text-zinc-950 dark:text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-white/55 dark:hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
                <span>{category.label}</span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-white/10 dark:text-white/60">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-h-[360px] overflow-y-auto p-5">
        <div className="mb-3 text-sm font-semibold text-zinc-500 dark:text-white/55">
          Có {activeItems.length} {activeMeta.label.toLowerCase()} xung quanh bất động sản
        </div>

        {activeItems.length ? (
          <div className="divide-y divide-zinc-200 dark:divide-[#262626]">
            {activeItems.map((item) => (
              <div key={item.utility?.id ?? utilityName(item)} className="grid grid-cols-[1fr_auto] gap-4 py-4">
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-zinc-950 dark:text-white">
                    {utilityName(item)}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-white/55">
                    {item.utility?.location || "Chưa có địa chỉ chi tiết"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                    {formatDistance(item.distanceM)}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-white/55">
                    <Bike className="h-4 w-4" />
                    {formatTravelTime(item.travelTimeS)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-28 items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 text-center text-sm text-zinc-500 dark:border-[#262626] dark:bg-[#111111] dark:text-white/50">
            Chưa có dữ liệu {activeMeta.label.toLowerCase()} cho bất động sản này.
          </div>
        )}

        {property?.location ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600 dark:bg-white/5 dark:text-white/60">
            <MapPinned className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{property.location}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
