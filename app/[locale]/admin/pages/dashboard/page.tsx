import { DashboardLayout } from "@/components/layout/DashboardLayout"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { ActivityFeed } from "@/components/admin/dashboard/activity-feed"
import { KPICards } from "@/components/admin/dashboard/kpi-card"

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <DashboardLayout>
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <DashboardHeader></DashboardHeader>

          {/* Main Content */}
          <main className="p-8">
            <KPICards />
            <ActivityFeed />
          </main>
        </div>
      </DashboardLayout>
    </ProtectedLayout>
  )
}
