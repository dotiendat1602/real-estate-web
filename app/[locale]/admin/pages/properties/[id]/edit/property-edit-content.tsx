"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { usePropertyDetail, useUpdateProperty } from "@/hooks/property/useProperty"
import type { UpdatePropertyRequest } from "@/types/interfaces/api/property"
import { PropertyEditModal } from "@/components/admin/properties/edit/property-edit-modal"

export default function PropertyEditContent({ id, locale }: { id: string; locale: string }) {
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

  const updateMutation = useUpdateProperty()

  const handleSubmit = (values: UpdatePropertyRequest) => {
    if (!property) return
    updateMutation.mutate(
      {
        id: property.id,
        data: values,
      },
      {
        onSuccess: () => {
          // Sau khi update xong thì quay lại trang detail
          router.push(`/${locale}/admin/pages/properties/${property.id}`)
        },
      },
    )
  }

  // Loading state
  if (!propertyId || isLoading) {
    return (
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            <div>
              <div className="h-5 w-52 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-64 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </header>
        <div className="p-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`skeleton-field-${i}`} className="h-10 bg-gray-100 rounded animate-pulse" />
              ))}
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
                className="mr-2 cursor-pointer"
                onClick={() => router.push("/admin/pages/properties")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Chỉnh sửa bất động sản
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

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="mt-1 mr-1 cursor-pointer"
              onClick={() => router.push(`/admin/pages/properties/${property.id}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Chỉnh sửa bất động sản
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Cập nhật thông tin chi tiết và trạng thái cho mã BĐS #{property.id}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 items-start">
          {/* Form chính */}
          <PropertyEditModal
            property={property}
            onSubmit={handleSubmit}
            isSubmitting={updateMutation.isPending}
          />

          {/* Cột phải: info hệ thống đơn giản */}
          <aside className="hidden xl:block space-y-6">
            <section className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Thông tin hiện tại
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
                  <span>Chủ sở hữu</span>
                  <span className="text-gray-800 truncate max-w-[170px] text-right">
                    {property.owner?.name || "—"}
                  </span>
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}
