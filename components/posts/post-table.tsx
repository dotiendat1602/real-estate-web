"use client"

import { useState } from "react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const mockPosts = [
  {
    id: "1",
    user: "Nguyễn Văn A",
    userId: "#VP001",
    image: "",
    title: "Tiêu đề đã - Căn hộ 2 phòng ngủ Vinhomes",
    description: "Tôi cần bán căn hộ 2 phòng ngủ tại",
    price: "500,000,000 VND",
    purpose: "CHO THUÊ",
    status: "APPROVED",
  },
  {
    id: "2",
    user: "Nguyễn Văn A",
    userId: "#VP001",
    image: "",
    title: "Tiêu đề đã - Căn hộ 2 phòng ngủ Vinhomes",
    description: "Tôi cần bán căn hộ 2 phòng ngủ tại",
    price: "500,000,000 VND",
    purpose: "CHO THUÊ",
    status: "APPROVED",
  },
  {
    id: "3",
    user: "Nguyễn Văn A",
    userId: "#VP001",
    image: "",
    title: "Tiêu đề đã - Căn hộ 2 phòng ngủ Vinhomes",
    description: "Tôi cần bán căn hộ 2 phòng ngủ tại",
    price: "500,000,000 VND",
    purpose: "CHO THUÊ",
    status: "APPROVED",
  },
  {
    id: "4",
    user: "Nguyễn Văn A",
    userId: "#VP001",
    image: "",
    title: "Tiêu đề đã - Căn hộ 2 phòng ngủ Vinhomes",
    description: "Tôi cần bán căn hộ 2 phòng ngủ tại",
    price: "500,000,000 VND",
    purpose: "CHO THUÊ",
    status: "APPROVED",
  },
]

export function PostTable() {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(mockPosts.map((post) => post.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectPost = (id: string) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter((postId) => postId !== id))
    } else {
      setSelectedPosts([...selectedPosts, id])
    }
  }

  return (
    <div>
      {/* Select All Row */}
      <div className="flex items-center gap-3 py-3 border-b border-gray-200 mb-4">
        <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
        <span className="text-sm text-gray-600">Chọn tất cả</span>
        <span className="text-sm text-gray-400">16 mục đã được chọn</span>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[50px_120px_100px_200px_150px_150px_120px_120px_150px] gap-4 px-4 py-3 bg-gray-50 rounded-t-lg border border-gray-200 text-sm font-medium text-gray-700">
        <div></div>
        <div>Người dùng</div>
        <div>Ảnh</div>
        <div>Tiêu đề</div>
        <div>Mô tả</div>
        <div>Giá</div>
        <div>Mục đích</div>
        <div>Trạng thái</div>
        <div>Hành động</div>
      </div>

      {/* Table Rows */}
      <div className="border-x border-b border-gray-200 rounded-b-lg">
        {mockPosts.map((post, index) => (
          <div
            key={post.id}
            className={`grid grid-cols-[50px_120px_100px_200px_150px_150px_120px_120px_150px] gap-4 px-4 py-4 items-center ${index !== mockPosts.length - 1 ? "border-b border-gray-100" : ""
              }`}
          >
            <Checkbox checked={selectedPosts.includes(post.id)} onCheckedChange={() => handleSelectPost(post.id)} />

            <div>
              <p className="text-sm font-medium text-gray-900">{post.user}</p>
              <p className="text-xs text-gray-500">{post.userId}</p>
            </div>

            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
              <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>

            <div>
              <p className="text-sm text-gray-900 line-clamp-2">{post.title}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-blue-600">{post.price}</p>
            </div>

            <div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">{post.purpose}</Badge>
            </div>

            <div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">{post.status}</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3">
                DUYỆT
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 text-xs h-7 px-3 bg-transparent"
              >
                TỪ CHỐI
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm text-gray-600">{selectedPosts.length} bài được chọn</span>
          <div className="flex items-center gap-3">
            <Button className="bg-green-600 hover:bg-green-700 text-white">DUYỆT TẤT CẢ</Button>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent">
              TỪ CHỐI TẤT CẢ
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
