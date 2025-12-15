"use client"

import type React from "react"

import {
  BedDouble,
  Bath,
  Car,
  Ruler,
  Calendar,
  ShieldCheck,
  Home,
  Compass,
  Maximize2,
  Sofa,
  Layers,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
}

export function PropertyDetailMain({ property }: Props) {
  const primaryImage =
    property.images.find((img) => img.isPrimary) || property.images[0]

  const otherImages = property.images.filter(
    (img) => img.id !== primaryImage?.id
  )

  return (
    <div className="space-y-6">
      {/* Image gallery */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        {primaryImage ? (
          <div className="relative mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryImage.imageUrl}
              alt={property.title}
              className="w-full h-72 sm:h-96 object-cover rounded-lg border border-gray-100"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              Hình ảnh chính
            </div>
          </div>
        ) : (
          <div className="w-full h-72 sm:h-96 flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
            Chưa có hình ảnh cho bất động sản này
          </div>
        )}

        {otherImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {otherImages.map((img) => (
              <button
                key={img.id ?? img.imageUrl} // ✅ đảm bảo key luôn có
                type="button"
                className="relative group rounded-md overflow-hidden border border-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.imageUrl}
                  alt={`Image ${img.id}`}
                  className="w-full h-20 sm:h-24 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Price + key info (mobile only) */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 xl:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wide text-gray-500">
            Giá rao bán
          </span>
          <span className="text-xs text-gray-400">
            Cập nhật:{" "}
            {new Date(property.updatedAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <p className="text-2xl font-semibold text-emerald-600">
          {formatCurrency(property.price)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {property.area
            ? `${formatNumber(property.area, "m²")} • ${property.bedroomNumber ||
              property.toiletNumber ||
              property.floorNumber
              ? [
                property.bedroomNumber
                  ? `${property.bedroomNumber} PN`
                  : null,
                property.toiletNumber
                  ? `${property.toiletNumber} WC`
                  : null,
                property.floorNumber
                  ? `${property.floorNumber} tầng`
                  : null,
              ]
                .filter(Boolean)
                .join(" • ")
              : "Thông số phòng chưa cập nhật"
            }`
            : "Diện tích chưa cập nhật"}
        </p>
      </section>

      {/* Description */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Mô tả chi tiết
        </h2>
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
          {property.description || "Chưa có mô tả chi tiết cho bất động sản này."}
        </p>
      </section>

      {/* Specs */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Thông tin cơ bản
          </h2>
          <Badge variant="outline" className="flex items-center gap-1">
            <Home className="w-3 h-3" />
            <span className="text-xs">
              {property.category?.categoryName || "Loại BĐS khác"}
            </span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <DetailSpecItem
            icon={<Ruler className="w-4 h-4 text-gray-600" />}
            label="Diện tích"
            value={formatNumber(property.area, "m²")}
          />
          <DetailSpecItem
            icon={<BedDouble className="w-4 h-4 text-gray-600" />}
            label="Phòng ngủ"
            value={property.bedroomNumber ?? "-"}
          />
          <DetailSpecItem
            icon={<Bath className="w-4 h-4 text-gray-600" />}
            label="Phòng tắm / WC"
            value={property.toiletNumber ?? "-"}
          />
          <DetailSpecItem
            icon={<Layers className="w-4 h-4 text-gray-600" />}
            label="Số tầng"
            value={property.floorNumber ?? "-"}
          />
          <DetailSpecItem
            icon={<Car className="w-4 h-4 text-gray-600" />}
            label="Chỗ đậu xe"
            value={
              property.parking == null
                ? "-"
                : property.parking
                  ? "Có"
                  : "Không"
            }
          />
          <DetailSpecItem
            icon={<Calendar className="w-4 h-4 text-gray-600" />}
            label="Năm xây dựng"
            value={property.yearBuilt ?? "-"}
          />
          <DetailSpecItem
            icon={<Compass className="w-4 h-4 text-gray-600" />}
            label="Hướng nhà"
            value={property.orientation || "-"}
          />
          <DetailSpecItem
            icon={<Maximize2 className="w-4 h-4 text-gray-600" />}
            label="Mặt tiền"
            value={formatNumber(property.frontage, "m")}
          />
          <DetailSpecItem
            icon={<Maximize2 className="w-4 h-4 text-gray-600" />}
            label="Lộ giới"
            value={formatNumber(property.roadWidth, "m")}
          />
          <DetailSpecItem
            icon={<Sofa className="w-4 h-4 text-gray-600" />}
            label="Nội thất"
            value={property.furnitureStatus || "Chưa cập nhật"}
          />
          <DetailSpecItem
            icon={<ShieldCheck className="w-4 h-4 text-gray-600" />}
            label="Pháp lý"
            value={property.legalStatus || "Chưa cập nhật"}
          />
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Tiện ích nội khu / tiện nghi
        </h2>
        {property.PropertyAmenities?.length ? (
          <div className="flex flex-wrap gap-2">
            {property.PropertyAmenities.map((item, index) => (
              <Badge
                key={
                  // ✅ ưu tiên id của bảng junction nếu có
                  (item as any).property_amenity_id ??
                  `${item.amenity.id}-${index}`
                }
                variant="outline"
                className="text-xs font-medium bg-gray-50 border-gray-200"
              >
                {item.amenity.name}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Chưa cập nhật tiện ích cho bất động sản này.
          </p>
        )}
      </section>

      {/* Utilities */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Khoảng cách tới tiện ích xung quanh
        </h2>
        {property.PropertyUtilities?.length ? (
          <div className="space-y-3">
            {property.PropertyUtilities.map((pu, index) => (
              <div
                key={
                  (pu as any).property_utility_id ??
                  `${pu.utility.id}-${index}`
                }
                className="flex items-start justify-between gap-3 border border-gray-100 rounded-md px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    {pu.isPrimary && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-100">
                        Chính
                      </span>
                    )}
                    {pu.utility.name}
                  </p>
                  {pu.note && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {pu.note}
                    </p>
                  )}
                </div>
                <div className="text-right text-xs text-gray-500">
                  {pu.distanceM != null && (
                    <p>
                      Khoảng cách:{" "}
                      <span className="font-medium text-gray-800">
                        {formatNumber(pu.distanceM, "m")}
                      </span>
                    </p>
                  )}
                  {pu.travelTimeS != null && (
                    <p>
                      Thời gian di chuyển:{" "}
                      <span className="font-medium text-gray-800">
                        {Math.round(pu.travelTimeS / 60)} phút
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Chưa có thông tin về tiện ích xung quanh.
          </p>
        )}
      </section>
    </div>
  )
}

function DetailSpecItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}
