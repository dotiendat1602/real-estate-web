"use client"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const appointments = [
  {
    id: 1,
    postName: "Căn hộ Vinhomes Grand Park",
    postCode: "#VP001",
    buyer: "Nguyễn Văn A",
    buyerPhone: "0907234567",
    dateTime: "28/09/2024",
    time: "14:30",
    location: "Tại dự án",
    locationDetail: "Quận 9, TP.HCM",
    status: "SCHEDULED",
    statusColor: "bg-blue-100 text-blue-700",
    notes: "Khách yêu cầu xem căn góc",
  },
  {
    id: 2,
    postName: "Nhà phố Thảo Điền",
    postCode: "#TD002",
    buyer: "Lê Văn C",
    buyerPhone: "0923456789",
    dateTime: "29/09/2024",
    time: "10:00",
    location: "Văn phòng",
    locationDetail: "Quận 2, TP.HCM",
    status: "COMPLETED",
    statusColor: "bg-green-100 text-green-700",
    notes: "Đã ký hợp đồng",
  },
  {
    id: 3,
    postName: "Biệt thự Phú Mỹ Hưng",
    postCode: "#PMH003",
    buyer: "Hoàng Văn E",
    buyerPhone: "0945678901",
    dateTime: "30/09/2024",
    time: "16:00",
    location: "Tại dự án",
    locationDetail: "Quận 7, TP.HCM",
    status: "RESCHEDULED",
    statusColor: "bg-yellow-100 text-yellow-700",
    notes: "Khách bận, dời sang tuần sau",
  },
]

export function AppointmentTable() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Tên post</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Người mua</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Thời gian</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Địa điểm</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Trạng thái</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Ghi chú</th>
            <th className="px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <div>
                  <div className="font-medium text-gray-900">{appointment.postName}</div>
                  <div className="text-sm text-gray-500">{appointment.postCode}</div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div>
                  <div className="text-sm text-gray-900">{appointment.buyer}</div>
                  <div className="text-xs text-gray-500">{appointment.buyerPhone}</div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div>
                  <div className="text-sm text-gray-900">{appointment.dateTime}</div>
                  <div className="text-xs text-gray-500">{appointment.time}</div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div>
                  <div className="text-sm text-gray-900">{appointment.location}</div>
                  <div className="text-xs text-gray-500">{appointment.locationDetail}</div>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge className={appointment.statusColor}>{appointment.status}</Badge>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-gray-600">{appointment.notes}</span>
              </td>
              <td className="px-4 py-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
