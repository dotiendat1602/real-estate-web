import { Globe, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { DepositFilters } from "@/components/deposits-appointments/deposit/deposit-filters"
import { DepositTable } from "@/components/deposits-appointments/deposit/deposit-table"
import { AppointmentFilters } from "@/components/deposits-appointments/appointment/appointment-filters"
import { AppointmentTable } from "@/components/deposits-appointments/appointment/appointment-table"

export default function BookingsPage() {
  return (
    <ProtectedLayout>
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Đặt cọc và lịch hẹn</h1>
              <p className="text-sm text-gray-500 mt-1">Quản lý các giao dịch đặt cọc và lịch hẹn xem property</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Globe className="w-4 h-4 mr-2" />
                English
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Deposits Section */}
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Danh sách đặt cọc</h2>
            <DepositFilters />
            <DepositTable />
          </section>

          {/* Appointments Section */}
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Danh sách lịch hẹn</h2>
            <AppointmentFilters />
            <AppointmentTable />
          </section>
        </div>
      </main>
    </ProtectedLayout>
  )
}
