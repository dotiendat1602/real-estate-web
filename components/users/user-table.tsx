"use client"
import { useState } from "react"
import { MoreVertical } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const users = [
  {
    id: 1,
    email: "myemail@gmail.com",
    name: "Nguyễn Văn A",
    phone: "0912345678",
    role: "ADMIN",
    activationStatus: "ĐÃ KÍCH HOẠT",
    activityStatus: "HOẠT ĐỘNG",
  },
  {
    id: 2,
    email: "myemail@gmail.com",
    name: "Nguyễn Văn A",
    phone: "0912345678",
    role: "ADMIN",
    activationStatus: "ĐÃ KÍCH HOẠT",
    activityStatus: "HOẠT ĐỘNG",
  },
  {
    id: 3,
    email: "myemail@gmail.com",
    name: "Nguyễn Văn A",
    phone: "0912345678",
    role: "ADMIN",
    activationStatus: "ĐÃ KÍCH HOẠT",
    activityStatus: "HOẠT ĐỘNG",
  },
  {
    id: 4,
    email: "myemail@gmail.com",
    name: "Nguyễn Văn A",
    phone: "0912345678",
    role: "ADMIN",
    activationStatus: "ĐÃ KÍCH HOẠT",
    activityStatus: "HOẠT ĐỘNG",
  },
]

export function UserTable() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((user) => user.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  return (
    <div className="space-y-4">
      {/* Select All */}
      <div className="flex items-center gap-3 py-3 border-b border-gray-200">
        <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
        <span className="text-sm text-gray-600">Chọn tất cả</span>
        <span className="text-sm text-gray-400">16 mục đã được chọn</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-12"></th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tên</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Số điện thoại</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Vai trò</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Trạng thái hoạt động</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Trạng thái</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">{user.email}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{user.name}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{user.phone}</td>
                <td className="py-4 px-4">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{user.role}</Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{user.activationStatus}</Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{user.activityStatus}</Badge>
                </td>
                <td className="py-4 px-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
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
