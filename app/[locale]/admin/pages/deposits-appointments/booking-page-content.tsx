"use client";

import { useState } from "react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AppointmentFilters } from "@/components/admin/deposits-appointments/appointment/appointment-filters";
import { AppointmentTable } from "@/components/admin/deposits-appointments/appointment/appointment-table";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { AppointmentListQuery } from "@/types/interfaces/api/appointment";

export default function BookingsPageContent() {
  const [queryAppointment, setQueryAppointment] = useState<AppointmentListQuery>({
    pageIndex: 1,
    pageSize: 10,
    sortKey: "createdAt",
    sortOrder: "desc",
  });

  const handleChangeQueryAppointment = (partial: Partial<AppointmentListQuery>) => {
    setQueryAppointment((prev) => ({
      ...prev,
      ...partial,
      pageIndex:
        partial.search !== undefined || partial.status !== undefined
          ? 1
          : partial.pageIndex ?? prev.pageIndex,
    }));
  };

  return (
    <ProtectedLayout>
      <main className="flex-1 overflow-auto">
        <AdminPageHeader
          title="Lịch hẹn"
          description="Quản lý các lịch hẹn xem bất động sản"
        />

        <div className="space-y-8 p-8">
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">Danh sách lịch hẹn</h2>
            <AppointmentFilters query={queryAppointment} onChangeQuery={handleChangeQueryAppointment} />
            <AppointmentTable query={queryAppointment} onChangeQuery={handleChangeQueryAppointment} />
          </section>
        </div>
      </main>
    </ProtectedLayout>
  );
}
