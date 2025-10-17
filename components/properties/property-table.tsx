"use client"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import Image from "next/image"

const properties = [
  {
    id: "VP001",
    name: "Căn hộ Vinhomes Grand Park",
    image: "https://placeholder.svg?height=60&width=80&query=modern+apartment+building",
    info: "Căn hộ 2 phòng ngủ, 2WC, full nội thất,...",
    type: "Căn hộ",
    area: "65m2",
    price: "500,000,000 VND",
    location: "Tây Mỗ, Nam Từ Liêm, Hà Nội",
    status: "HOẠT ĐỘNG",
    createdDate: "15/01/2025",
    createdBy: "Nguyễn Văn A",
  },
  {
    id: "VP001",
    name: "Căn hộ Vinhomes Grand Park",
    image: "https://placeholder.svg?height=60&width=80&query=modern+apartment+building",
    info: "Căn hộ 2 phòng ngủ, 2WC, full nội thất,...",
    type: "Căn hộ",
    area: "65m2",
    price: "500,000,000 VND",
    location: "Tây Mỗ, Nam Từ Liêm, Hà Nội",
    status: "HOẠT ĐỘNG",
    createdDate: "15/01/2025",
    createdBy: "Nguyễn Văn A",
  },
  {
    id: "VP001",
    name: "Căn hộ Vinhomes Grand Park",
    image: "https://placeholder.svg?height=60&width=80&query=modern+apartment+building",
    info: "Căn hộ 2 phòng ngủ, 2WC, full nội thất,...",
    type: "Căn hộ",
    area: "65m2",
    price: "500,000,000 VND",
    location: "Tây Mỗ, Nam Từ Liêm, Hà Nội",
    status: "HOẠT ĐỘNG",
    createdDate: "15/01/2025",
    createdBy: "Nguyễn Văn A",
  },
  {
    id: "VP001",
    name: "Căn hộ Vinhomes Grand Park",
    image: "https://placeholder.svg?height=60&width=80&query=modern+apartment+building",
    info: "Căn hộ 2 phòng ngủ, 2WC, full nội thất,...",
    type: "Căn hộ",
    area: "65m2",
    price: "500,000,000 VND",
    location: "Tây Mỗ, Nam Từ Liêm, Hà Nội",
    status: "HOẠT ĐỘNG",
    createdDate: "15/01/2025",
    createdBy: "Nguyễn Văn A",
  },
]

export function PropertyTable() {
  const [selectedAll, setSelectedAll] = useState(true)
  const [selectedItems, setSelectedItems] = useState<string[]>(properties.map((_, i) => i.toString()))

  const handleSelectAll = () => {
    if (selectedAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(properties.map((_, i) => i.toString()))
    }
    setSelectedAll(!selectedAll)
  }

  const handleSelectItem = (index: string) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((i) => i !== index))
    } else {
      setSelectedItems([...selectedItems, index])
    }
  }

  return (
    <div className="space-y-4">
      {/* Select All Row */}
      <div className="flex items-center gap-3 py-3 border-b border-gray-200">
        <Checkbox checked={selectedAll} onCheckedChange={handleSelectAll} />
        <span className="text-sm font-medium text-gray-900">Chọn tất cả</span>
        <span className="text-sm text-gray-500">{properties.length} mục đã được chọn</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-12"></th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Ảnh</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tên</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Thông tin</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Loại</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Diện tích</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Giá</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Vị trí</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Trạng thái</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Ngày tạo
                <br />& Người tạo
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <Checkbox
                    checked={selectedItems.includes(index.toString())}
                    onCheckedChange={() => handleSelectItem(index.toString())}
                  />
                </td>
                <td className="py-4 px-4">
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.name}
                      width={80}
                      height={60}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{property.name}</p>
                    <p className="text-xs text-gray-500">#{property.id}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-gray-600 max-w-xs">{property.info}</p>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-700">{property.type}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-700">{property.area}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-blue-600">{property.price}</span>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-gray-600 max-w-xs">{property.location}</p>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                    {property.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm text-gray-700">{property.createdDate}</p>
                    <p className="text-sm text-gray-500">{property.createdBy}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
