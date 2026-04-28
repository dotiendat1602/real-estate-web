"use client";

import { useState } from "react";
import { MoreVertical, PencilLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  AppointmentDataListItem,
  AppointmentListQuery,
} from "@/types/interfaces/api/appointment";
import { AppointmentStatus } from "@/types/enums/appointment";
import { UpdateAppointmentModal } from "./update-appointment-modal";
import { useAppointments } from "@/hooks/appointment/useAppointment";

interface AppointmentTableProps {
  query: AppointmentListQuery;
  onChangeQuery: (partial: Partial<AppointmentListQuery>) => void;
}

export function AppointmentTable({
  query,
  onChangeQuery,
}: AppointmentTableProps) {
  const { data, isLoading, isError } = useAppointments(query);

  const appointments: AppointmentDataListItem[] = data?.data ?? [];
  const pageIndex = data?.pageIndex ?? query.pageIndex ?? 1;
  const totalPage = data?.totalPages ?? 1;

  const [editingId, setEditingId] = useState<number>(0);

  const handleSort = (key: string) => {
    const currentKey = query.sortKey;
    const currentOrder = query.sortOrder;

    let nextOrder: "asc" | "desc" = "asc";
    if (currentKey === key) {
      nextOrder = currentOrder === "asc" ? "desc" : "asc";
    }

    onChangeQuery({
      sortKey: key,
      sortOrder: nextOrder,
      pageIndex: 1,
    });
  };

  const handleChangePage = (page: number) => {
    if (page < 1 || page > totalPage) return;
    onChangeQuery({ pageIndex: page });
  };

  const handleOpenEdit = (id: number) => {
    setEditingId(id);
  };

  const renderStatusBadgeClass = (st: string) => {
    if (st === AppointmentStatus.SCHEDULED)
      return "bg-blue-100 text-blue-700";
    if (st === AppointmentStatus.COMPLETED)
      return "bg-green-100 text-green-700";
    if (st === AppointmentStatus.RESCHEDULED)
      return "bg-yellow-100 text-yellow-700";
    if (st === AppointmentStatus.CANCELED)
      return "bg-red-100 text-white-700";
    return "";
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 text-center text-sm text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        Có lỗi khi tải danh sách lịch hẹn. Vui lòng thử lại.
      </p>
    );
  }

  if (!appointments.length) {
    return (
      <p className="text-sm text-gray-500">
        Chưa có lịch hẹn xem property nào.
      </p>
    );
  }

  return (
    <>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer"
                onClick={() => handleSort("scheduledAt")}
              >
                Thời gian
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Tên post
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Người mua
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Địa điểm
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer"
                onClick={() => handleSort("appointmentStatus")}
              >
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Ghi chú
              </th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.map((appointment) => {
              const scheduled = new Date(appointment.scheduledAt);
              const dateStr = scheduled.toLocaleDateString("vi-VN");
              const timeStr = scheduled.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm text-gray-900">{dateStr}</div>
                      <div className="text-xs text-gray-500">{timeStr}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {appointment.post?.postTitle ?? "-"}
                      </div>
                      {/* nếu có code thì show ở đây */}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm text-gray-900">
                        {appointment.buyer?.name}
                      </div>
                      {appointment.buyer?.phone && (
                        <div className="text-xs text-gray-500">
                          {appointment.buyer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm text-gray-900">
                        {appointment.location || "-"}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      className={renderStatusBadgeClass(
                        appointment.appointmentStatus,
                      )}
                    >
                      {appointment.appointmentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600">
                      {appointment.notes || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenEdit(appointment.id)}
                    >
                      <PencilLine className="h-4 w-4 text-gray-400" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 text-sm text-gray-600">
          <span>
            Trang {pageIndex} / {totalPage}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pageIndex <= 1}
              onClick={() => handleChangePage(pageIndex - 1)}
            >
              Trang trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pageIndex >= totalPage}
              onClick={() => handleChangePage(pageIndex + 1)}
            >
              Trang sau
            </Button>
          </div>
        </div>
      </div>

      <UpdateAppointmentModal
        appointmentId={editingId}
        open={!!editingId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingId(0);
          }
        }}
      />
    </>
  );
}
