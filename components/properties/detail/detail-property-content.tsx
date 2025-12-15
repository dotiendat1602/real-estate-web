"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { usePropertyDetail } from "@/hooks/property/useProperty"
import { PropertyDetailHeader } from "./detail-property-header"
import { PropertyDetailMain } from "./detail-property-main"
import { PropertyDetailSidebar } from "./detail-property-sidebar"


export default function PropertyDetailPage({ id, locale }: { id: string; locale: string }) {
  const router = useRouter()

  const propertyId = useMemo(() => {
    if (!id) return null
    const n = Number(id)
    return Number.isNaN(n) ? null : n
  }, [id])

  const {
    data: property,
    isLoading,
    error,
  } = usePropertyDetail(propertyId || 0)

  // Loading state
  if (!propertyId || isLoading) {
    return (
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            <div>
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-64 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </header>
        <div className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="h-72 w-full bg-gray-200 rounded-lg animate-pulse mb-6" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={`skeleton-img-${i}`}
                    className="h-20 bg-gray-100 rounded-md animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
              <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={`skeleton-info-${i}`}
                    className="h-4 w-full bg-gray-100 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Error / not found
  if (error || !property) {
    return (
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => router.push("/properties")}
              >
                ←
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Chi tiết bất động sản
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Không tìm thấy bất động sản hoặc có lỗi khi tải dữ liệu
                </p>
              </div>
            </div>
          </div>
        </header>
        <div className="p-8">
          <div className="bg-white border border-red-200 text-red-700 rounded-lg p-6">
            <p>Có lỗi xảy ra khi tải dữ liệu bất động sản. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </main>
    )
  }

  const fullAddress = [
    property.location,
    property.ward?.name,
    property.district?.name,
    property.province?.name,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <main className="flex-1 overflow-auto">
      <PropertyDetailHeader
        property={property}
        fullAddress={fullAddress}
        onBack={() => router.push("/pages/properties")}
        onEdit={() => router.push(`/pages/properties/${property.id}/edit`)}
        onOpenMap={() => {
          if (property.lat && property.lon) {
            window.open(
              `https://www.google.com/maps?q=${property.lat},${property.lon}`,
              "_blank"
            )
          }
        }}
      />

      <div className="p-8">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 items-start">
          <PropertyDetailMain property={property} />

          <aside className="hidden xl:block space-y-6">
            <PropertyDetailSidebar property={property} fullAddress={fullAddress} />
          </aside>
        </div>
      </div>
    </main>
  )
}
