"use client";

import { ArrowLeft, MapPin } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PropertyData } from "@/types/interfaces/api/property";

interface PropertyDetailHeaderProps {
  property: PropertyData;
  fullAddress: string;
  onBack: () => void;
  onEdit: () => void;
  onOpenMap: () => void;
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
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-gray-200 bg-gray-50 text-gray-600";

  return (
    <AdminPageHeader
      title={property.title}
      description={[
        fullAddress,
        `Mã BĐS: #${property.id}`,
        `Chủ sở hữu: ${property.owner?.name || "-"}`,
      ].filter(Boolean).join(" • ")}
      actions={
        <>
          <Button variant="ghost" size="icon" className="cursor-pointer" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Badge variant="outline" className={`${statusColor} text-xs font-medium`}>
            {property.status === "ACTIVE" ? "Đang đăng" : "Ngừng đăng"}
          </Badge>
          {property.category?.categoryName ? (
            <Badge variant="secondary" className="text-xs">
              {property.category.categoryName}
            </Badge>
          ) : null}
          <Button variant="outline" className="cursor-pointer" onClick={onEdit}>
            Chỉnh sửa
          </Button>
          <Button
            className="cursor-pointer"
            onClick={onOpenMap}
            disabled={!property.lat || !property.lon}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Xem trên bản đồ
          </Button>
        </>
      }
    />
  );
}
