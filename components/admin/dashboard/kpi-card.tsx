import { FileText } from "lucide-react"
import { Card } from "@/components/ui/card"

const kpiData = [
  {
    title: "Số bài chờ duyệt",
    value: "16",
    subtitle: "Cần duyệt ngay...",
    updated: "Updated 8 minutes ago",
  },
  {
    title: "Số lịch hẹn hôm nay",
    value: "09",
    subtitle: "Kiểm tra ngay...",
    updated: "Updated 8 minutes ago",
  },
  {
    title: "Số leads mới",
    value: "24",
    subtitle: "Kiểm tra ngay",
    updated: "Updated 8 minutes ago",
  },
]

export function KPICards() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">KPI Quan Trọng</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</h3>
                <p className="text-xs text-gray-400">{kpi.updated}</p>
              </div>
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="mb-2">
              <p className="text-4xl font-bold text-gray-900">{kpi.value}</p>
            </div>
            <p className="text-sm text-gray-500">{kpi.subtitle}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
