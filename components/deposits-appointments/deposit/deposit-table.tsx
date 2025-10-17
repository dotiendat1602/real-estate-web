"use client"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const deposits = [
  {
    id: 1,
    propertyName: "Căn hộ Vinhomes Grand Park",
    propertyCode: "#VP001",
    buyer: "Nguyễn Văn A",
    buyerPhone: "0907234567",
    seller: "Trần Thị B",
    sellerPhone: "0912345678",
    amount: "500,000,000 VND",
    status: "CONFIRMED",
    statusColor: "bg-green-100 text-green-700",
    transactionCode: "TXN123456789",
    expiry: "15/01/2025",
  },
  {
    id: 2,
    propertyName: "Nhà phố Thảo Điền",
    propertyCode: "#TD002",
    buyer: "Lê Văn C",
    buyerPhone: "0923456789",
    seller: "Phạm Thị D",
    sellerPhone: "0934567890",
    amount: "1,200,000,000 VND",
    status: "REFUNDED",
    statusColor: "bg-yellow-100 text-yellow-700",
    transactionCode: "TXN123456790",
    expiry: "20/01/2025",
  },
  {
    id: 3,
    propertyName: "Biệt thự Phú Mỹ Hưng",
    propertyCode: "#PMH003",
    buyer: "Hoàng Văn E",
    buyerPhone: "0945678901",
    seller: "Võ Thị F",
    sellerPhone: "0956789012",
    amount: "500,000,000 VND",
    status: "CANCELLED",
    statusColor: "bg-red-100 text-red-700",
    transactionCode: "TXN123456791",
    expiry: "25/01/2025",
  },
]

export function DepositTable() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Tên property</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Người mua</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Người bán</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Số tiền cọc</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Trạng thái</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Mã giao dịch</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Hết hạn</th>
            <th className="px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {deposits.map((deposit) => (
            <tr key={deposit.id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <div>
                  <div className="font-medium text-gray-900">{deposit.propertyName}</div>
                  <div className="text-sm text-gray-500">{deposit.propertyCode}</div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div>
                  <div className="text-sm text-gray-900">{deposit.buyer}</div>
                  <div className="text-xs text-gray-500">{deposit.buyerPhone}</div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div>
                  <div className="text-sm text-gray-900">{deposit.seller}</div>
                  <div className="text-xs text-gray-500">{deposit.sellerPhone}</div>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm font-medium text-blue-600">{deposit.amount}</span>
              </td>
              <td className="px-4 py-4">
                <Badge className={deposit.statusColor}>{deposit.status}</Badge>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-gray-600">{deposit.transactionCode}</span>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-gray-600">{deposit.expiry}</span>
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
