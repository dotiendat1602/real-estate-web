"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { PropertyData, PropertyListQuery } from "@/types/interfaces/api/property";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPrice } from "@/lib/utils";
import { withLocalePath } from "@/lib/utils/i18n";

interface MyPropertiesTableProps {
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
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const HH = String(dt.getHours()).padStart(2, "0");
  const MM = String(dt.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
}

export function MyPropertiesTable({
  data,
  isLoading,
  pagination,
  onPaginationChange,
}: MyPropertiesTableProps) {
  const router = useRouter();
  const locale = useLocale();

  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleSelectAll = () => {
    if (selectedAll) setSelectedItems([]);
    else setSelectedItems(data.map((item) => item.id));
    setSelectedAll(!selectedAll);
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) setSelectedItems(selectedItems.filter((i) => i !== id));
    else setSelectedItems([...selectedItems, id]);
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  const handlePageChange = (newPage: number) => {
    onPaginationChange({ pageIndex: newPage, pageSize: pagination.pageSize });
  };

  if (isLoading) {
    return <div className="text-center py-8 text-white/60">Đang tải...</div>;
  }

  if (!data.length) {
    return <div className="text-center py-10 text-white/60">Không có dữ liệu</div>;
  }

  return (
    <div className="space-y-4">
      {/* Select All Row */}
      <div className="flex items-center gap-3 py-3 border-b border-[#262626]">
        <Checkbox checked={selectedAll} onCheckedChange={handleSelectAll} />
        <span className="text-sm font-medium text-white">Chọn tất cả</span>
        <span className="text-sm text-white/60">
          {selectedItems.length} mục đã được chọn
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#262626] bg-[#0a0a0a]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#262626]">
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70 w-12" />
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Ảnh</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Tên</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Mã</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Loại</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Diện tích</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Giá</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Vị trí</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Trạng thái</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Ngày tạo</th>
              <th className="w-12" />
            </tr>
          </thead>

          <tbody>
            {data.map((property) => {
              const primaryImage =
                property.images.find((img) => img.isPrimary) || property.images[0];

              return (
                <tr
                  key={property.id}
                  className="border-b border-[#1f1f1f] hover:bg-white/[0.03] transition-colors"
                >
                  <td className="py-4 px-4">
                    <Checkbox
                      checked={selectedItems.includes(property.id)}
                      onCheckedChange={() => handleSelectItem(property.id)}
                    />
                  </td>

                  <td className="py-4 px-4">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-[#141414] border border-[#262626]">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.imageUrl}
                          alt={property.title}
                          width={80}
                          height={60}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#141414]" />
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-white">{property.title}</p>
                      <p className="text-xs text-white/50">#{property.id}</p>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <p className="text-sm text-white/60 max-w-xs line-clamp-2">
                      #{property.id}
                    </p>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-sm text-white/70">
                      {property.category.categoryName}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-sm text-white/70">{property.area}m²</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold text-purple-300">
                      {formatPrice(property.price)}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <p className="text-sm text-white/60 max-w-xs">
                      {property.location ||
                        `${property.ward?.name}, ${property.district?.name}, ${property.province?.name}`}
                    </p>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={
                        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border " +
                        (property.status === "ACTIVE"
                          ? "bg-green-500/10 border-green-500/25 text-green-300"
                          : "bg-white/5 border-[#262626] text-white/70")
                      }
                    >
                      {property.status === "ACTIVE" ? "HOẠT ĐỘNG" : "KHÔNG HOẠT ĐỘNG"}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <p className="text-sm text-white/70">
                      {formatDate(new Date(property.createdAt))}
                    </p>
                  </td>

                  <td className="py-4 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer text-white/60 hover:text-white hover:bg-white/5 h-8 w-8"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-32 bg-[#141414] border border-[#262626] text-white"
                      >
                        <DropdownMenuItem
                          className="cursor-pointer focus:bg-white/5"
                          onClick={() =>
                            router.push(withLocalePath(`/my-properties/edit/${property.id}`, locale))
                          }
                        >
                          Chỉnh sửa
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-red-400 cursor-pointer focus:bg-white/5">
                          Xóa
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

      {/* Pagination */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4">
        <div className="text-sm text-white/50">
          Hiển thị{" "}
          {(pagination.pageIndex - 1) * pagination.pageSize + 1} đến{" "}
          {Math.min(pagination.pageIndex * pagination.pageSize, pagination.total)}{" "}
          trong tổng số {pagination.total} kết quả
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex === 1}
            className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm text-white/70">
            Trang {pagination.pageIndex} / {totalPages || 1}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.pageIndex + 1)}
            disabled={pagination.pageIndex >= totalPages}
            className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
