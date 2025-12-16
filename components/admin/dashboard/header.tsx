import { Bell, Globe } from "lucide-react";
import { Button } from "../ui/button";

export function DashboardHeader() {
  return (
    <header className="border-b bg-white px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bảng điều khiển</h1>
          <p className="text-sm text-gray-500 mt-1">Hiển thị KPI quan trọng và nhật ký hoạt động mới nhất</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Globe className="h-5 w-5" />
          </Button>
          <span className="text-sm text-gray-700">English</span>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}