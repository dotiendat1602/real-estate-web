"use client"

import { MapPin, Ruler, BedDouble, Bath, Car } from "lucide-react"
import type { PropertyData } from "@/types/interfaces/api/property"

function formatCurrency(value?: number) {
  if (value == null) return "-"
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value?: number, suffix?: string) {
  if (value == null) return "-"
  return `${value.toLocaleString("vi-VN")}${suffix ? ` ${suffix}` : ""}`
}

interface Props {
  property: PropertyData
  fullAddress: string
}

export function PropertyDetailSidebar({ property, fullAddress }: Props) {
  return (
    <>
      <section className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wide text-gray-500">
            Giá rao bán
          </span>
          <span className="text-xs text-gray-400">
            Cập nhật:{" "}
            {new Date(property.updatedAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <p className="text-3xl font-semibold text-emerald-600">
          {formatCurrency(property.price)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Đã bao gồm thuế & phí (nếu có)
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <SidebarInfoItem
            icon={<Ruler className="w-4 h-4 text-gray-500" />}
            label="Diện tích"
            value={formatNumber(property.area, "m²")}
          />
          <SidebarInfoItem
            icon={<BedDouble className="w-4 h-4 text-gray-500" />}
            label="Phòng ngủ"
            value={property.bedroomNumber ?? "-"}
          />
          <SidebarInfoItem
            icon={<Bath className="w-4 h-4 text-gray-500" />}
            label="Phòng tắm / WC"
            value={property.toiletNumber ?? "-"}
          />
          <SidebarInfoItem
            icon={<Car className="w-4 h-4 text-gray-500" />}
            label="Đậu xe"
            value={
              property.parking == null
                ? "-"
                : property.parking
                  ? "Có"
                  : "Không"
            }
          />
        </div>

        {fullAddress && (
          <div className="mt-5 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
            <p className="text-sm text-gray-800 flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
              <span>{fullAddress}</span>
            </p>
          </div>
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">
            Toạ độ bản đồ
          </h2>

          {property.lat != null && property.lon != null && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${property.lat},${property.lon}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-700 hover:text-emerald-800"
            >
              Mở Google Maps
            </a>
          )}
        </div>

        {property.lat != null && property.lon != null ? (
          <div className="space-y-2 text-sm">
            <p className="flex items-center justify-between">
              <span className="text-gray-500">Lat</span>
              <span className="font-mono text-gray-900">
                {property.lat}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-gray-500">Lon</span>
              <span className="font-mono text-gray-900">
                {property.lon}
              </span>
            </p>

            <div className="mt-3 overflow-hidden rounded-md border border-gray-200">
              <iframe
                title="Google Map Preview"
                src={`https://www.google.com/maps?q=${property.lat},${property.lon}&z=17&output=embed`}
                className="w-full h-56"
                loading="lazy"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Chưa có thông tin toạ độ. Hãy cập nhật Lat/Lon để hiển thị bản đồ.
          </p>
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          Thông tin hệ thống
        </h2>
        <div className="space-y-2 text-xs text-gray-500">
          <p className="flex items-center justify-between">
            <span>Ngày tạo</span>
            <span className="text-gray-800">
              {new Date(property.createdAt).toLocaleString("vi-VN")}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span>Cập nhật lần cuối</span>
            <span className="text-gray-800">
              {new Date(property.updatedAt).toLocaleString("vi-VN")}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span>Trạng thái</span>
            <span className="text-gray-800">{property.status}</span>
          </p>
        </div>
      </section>
    </>
  )
}

function SidebarInfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}
