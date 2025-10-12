import { Bell, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KPICards } from "@/components/dashboard/kpi-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { DashboardHeader } from "@/components/dashboard/header"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"

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
