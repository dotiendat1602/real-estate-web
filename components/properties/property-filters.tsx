"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function PropertyFilters() {
  return (
    <div className="space-y-4 mb-6">
      {/* Search and Filters Row */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input type="text" placeholder="Tìm theo tên bất động sản..." className="w-full" />
        </div>

        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200">
          <option>Tất cả trạng thái</option>
          <option>Hoạt động</option>
          <option>Không hoạt động</option>
        </select>

        <Input type="text" placeholder="Giá từ..." className="w-32" />

        <Input type="text" placeholder="Giá đến..." className="w-32" />

        <Button variant="outline" className="whitespace-nowrap bg-transparent">
          Chọn tỉnh/thành
        </Button>

        <Button variant="outline" className="whitespace-nowrap bg-transparent">
          Chọn quận/huyện
        </Button>

        <Button variant="outline" className="whitespace-nowrap bg-transparent">
          Chọn phường/xã
        </Button>

        <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6">Search</Button>
      </div>
    </div>
  )
}
