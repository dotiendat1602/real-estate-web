"use client"

import { ArrowLeft, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { PropertyData } from "@/types/interfaces/api/property"

interface PropertyDetailHeaderProps {
  property: PropertyData
  fullAddress: string
  onBack: () => void
  onEdit: () => void
  onOpenMap: () => void
}

export function PropertyDetailHeader({
  property,
  fullAddress,
  onBack,
  onEdit,
  onOpenMap,
}: PropertyDetailHeaderProps) {
  const statusColor =
    property.status === "ACTIVE"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-gray-50 text-gray-600 border-gray-200"

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="mt-1 mr-1"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                {property.title}
              </h1>
              <Badge
                variant="outline"
                className={`${statusColor} text-xs font-medium`}
              >
                {property.status === "ACTIVE" ? "Đang đăng" : "Ngừng đăng"}
              </Badge>
              {property.category?.categoryName && (
                <Badge variant="secondary" className="text-xs">
                  {property.category.categoryName}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {fullAddress && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{fullAddress}</span>
                </div>
              )}
              <span>•</span>
              <span>Mã BĐS: #{property.id}</span>
              <span>•</span>
              <span>
                Chủ sở hữu:{" "}
                <span className="font-medium text-gray-700">
                  {property.owner?.name || "—"}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="cursor-pointer" onClick={onEdit}>
            Chỉnh sửa
          </Button>
          <Button
            variant="default"
            className="cursor-pointer"
            onClick={onOpenMap}
            disabled={!property.lat || !property.lon}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Xem trên bản đồ
          </Button>
        </div>
      </div>
    </header>
  )
}
