"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
import { PropertyPlanningMapResponse } from "@/types/interfaces/api/planning";

type PlanningMapClientProps = {
  data?: PropertyPlanningMapResponse;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function PlanningMapClient({ data }: PlanningMapClientProps) {
  const lat = data?.property?.lat;
  const lng = data?.property?.lng;

  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return (
      <div className="h-[360px] rounded-xl border border-zinc-700 bg-zinc-900/70 p-4 text-zinc-300">
        Property chưa có tọa độ để hiển thị bản đồ.
      </div>
    );
  }

  return (
    <div className="h-[360px] overflow-hidden rounded-xl border border-zinc-700">
      <MapContainer center={[lat, lng]} zoom={15} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]} icon={markerIcon}>
          <Popup>Vị trí bất động sản</Popup>
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
      </MapContainer>
    </div>
  );
}
