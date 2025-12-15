"use client"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { PropertyData, PropertyListQuery } from "@/types/interfaces/api/property"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

interface PropertyTableProps {
  data: PropertyData[]
  isLoading: boolean
  pagination: {
    pageIndex: number
    pageSize: number
    total: number
  }
  onPaginationChange: (query: PropertyListQuery) => void
}

function formatDate(d?: string | Date | null) {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "-";
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const HH = String(dt.getHours()).padStart(2, "0");
  const MM = String(dt.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
}

export function PropertyTable({ data, isLoading, pagination, onPaginationChange }: PropertyTableProps) {
  const router = useRouter();

  const [selectedAll, setSelectedAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const handleSelectAll = () => {
    if (selectedAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(data.map(item => item.id))
    }
    setSelectedAll(!selectedAll)
  }

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const totalPages = Math.ceil(pagination.total / pagination.pageSize)

  const handlePageChange = (newPage: number) => {
    onPaginationChange({ pageIndex: newPage, pageSize: pagination.pageSize })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>
  }

  if (!data.length) {
    return <div className="text-center py-8 text-gray-500">Không có dữ liệu</div>
  }

  return (
    <div className="space-y-4">
      {/* Select All Row */}
      <div className="flex items-center gap-3 py-3 border-b border-gray-200">
        <Checkbox checked={selectedAll} onCheckedChange={handleSelectAll} />
        <span className="text-sm font-medium text-gray-900">Chọn tất cả</span>
        <span className="text-sm text-gray-500">{selectedItems.length} mục đã được chọn</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-12"></th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Ảnh</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tên</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Thông tin</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Loại</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Diện tích</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Giá</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Vị trí</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Trạng thái</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Ngày tạo
                <br />& Người tạo
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((property) => {
              const primaryImage = property.images.find(img => img.isPrimary) || property.images[0]

              return (
                <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <Checkbox
                      checked={selectedItems.includes(property.id)}
                      onCheckedChange={() => handleSelectItem(property.id)}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.imageUrl}
                          alt={property.title}
                          width={80}
                          height={60}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{property.title}</p>
                      <p className="text-xs text-gray-500">#{property.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600 max-w-xs line-clamp-2">
                      {property.description}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{property.category.categoryName}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{property.area}m²</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-blue-600">{formatPrice(property.price)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600 max-w-xs">
                      {property.location || `${property.ward?.name}, ${property.district?.name}, ${property.province?.name}`}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${property.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                      }`}>
                      {property.status === 'ACTIVE' ? 'HOẠT ĐỘNG' : 'KHÔNG HOẠT ĐỘNG'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-gray-700">
                        {formatDate(new Date(property.createdAt))}
                      </p>
                      <p className="text-sm text-gray-500">{property.owner.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer text-gray-400 h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem className="cursor-pointer"
                          onClick={() => router.push(`/pages/properties/${property.id}`)}
                        >
                          Xem chi tiết
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600 cursor-pointer"
                        // onClick={() => onDelete?.(property.property_id)}
                        >
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-500">
          Hiển thị {((pagination.pageIndex - 1) * pagination.pageSize) + 1} đến {Math.min(pagination.pageIndex * pagination.pageSize, pagination.total)} trong tổng số {pagination.total} kết quả
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-700">
            Trang {pagination.pageIndex} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.pageIndex + 1)}
            disabled={pagination.pageIndex >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
