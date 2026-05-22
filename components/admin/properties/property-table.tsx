"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";

import Pagination from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPrice } from "@/lib/utils";
import { withLocalePath } from "@/lib/utils/i18n";
import { PropertyData, PropertyListQuery } from "@/types/interfaces/api/property";

interface PropertyTableProps {
  data: PropertyData[];
  isLoading: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
  onPaginationChange: (query: PropertyListQuery) => void;
}

function formatDate(d?: string | Date | null) {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PropertyTable({
  data,
  isLoading,
  pagination,
  onPaginationChange,
}: PropertyTableProps) {
  const router = useRouter();
  const locale = useLocale();
  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (!data.length) {
    return <div className="text-center py-8 text-gray-500">Không có dữ liệu</div>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Ảnh</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tên</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Mã</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Loại</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Diện tích</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Giá</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Vị trí</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Trạng thái</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Ngày tạo
                <br />& Người tạo
              </th>
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {data.map((property) => {
              const images = property.images ?? [];
              const primaryImage = images.find((img) => img?.isPrimary) ?? images[0];
              const locationText =
                property.location?.trim() ||
                [property.ward?.name, property.district?.name, property.province?.name]
                  .filter(Boolean)
                  .join(", ") ||
                "-";
              const ownerName = property.owner?.name || "-";

              return (
                <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
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
                    <p className="text-sm font-medium text-gray-900">{property.title}</p>
                    <p className="text-xs text-gray-500">#{property.id}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600 max-w-xs line-clamp-2">#{property.id}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{property.category.categoryName}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{property.area}m²</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-blue-600">
                      {formatPrice(property.price)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600 max-w-xs">{locationText}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        property.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {property.status === "ACTIVE" ? "HOẠT ĐỘNG" : "KHÔNG HOẠT ĐỘNG"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-700">{formatDate(property.createdAt)}</p>
                    <p className="text-sm text-gray-500">{ownerName}</p>
                  </td>
                  <td className="py-4 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            router.push(
                              withLocalePath(`/admin/pages/properties/${property.id}`, locale)
                            )
                          }
                        >
                          Xem chi tiết
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.pageIndex}
        totalPages={totalPages}
        totalItems={pagination.total}
        pageSize={pagination.pageSize}
        onPageChange={(page) =>
          onPaginationChange({ pageIndex: page, pageSize: pagination.pageSize })
        }
        onPageSizeChange={(pageSize) => onPaginationChange({ pageIndex: 1, pageSize })}
        itemLabel="bất động sản"
      />
    </div>
  );
}
