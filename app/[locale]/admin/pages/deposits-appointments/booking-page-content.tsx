"use client";

import { useState } from "react";
import { Bell, Globe } from "lucide-react";

import { AppointmentFilters } from "@/components/admin/deposits-appointments/appointment/appointment-filters";
import { AppointmentTable } from "@/components/admin/deposits-appointments/appointment/appointment-table";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { Button } from "@/components/ui/button";
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
        <header className="border-b border-gray-200 bg-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Lịch hẹn</h1>
              <p className="mt-1 text-sm text-gray-500">
                Quản lý các lịch hẹn xem bất động sản
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Globe className="mr-2 h-4 w-4" />
                English
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

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
