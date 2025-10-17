"use client";
import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { NativeSelect } from "@/components/ui/select";

const roles = [
  { id: 1, name: "Admin", description: "Quản trị hệ thống" },
  { id: 2, name: "Manager", description: "Quản lý văn" },
  { id: 3, name: "Agent", description: "Môi giới" },
  { id: 4, name: "Viewer", description: "Chỉ xem" },
];

const permissions = [
  { id: 1, code: "property_view", description: "Xem bất động sản" },
  { id: 2, code: "property_edit", description: "Sửa bất động sản" },
  { id: 3, code: "property_approved", description: "Duyệt bài" },
  { id: 4, code: "user_manage", description: "Quản lý người dùng" },
];

export function RolePermissionSection() {
  const [searchQuery, setSearchQuery] = useState("");

  // các select state
  const [role1, setRole1] = useState("all-role1");
  const [role2, setRole2] = useState("all-role2");
  const [status, setStatus] = useState("all-status");

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Vai trò và quyền hạn</h2>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <Input
          placeholder="Tìm theo property_name, property_code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-gray-50 border-gray-200"
        />

        {/* NativeSelect 1 */}
        <NativeSelect
          value={role1}
          onChange={setRole1}
          className="w-[200px]"
          selectClassName="bg-gray-50 border-gray-200"
          placeholder="All:property_role1"
        >
          <option value="all-role1">All:property_role1</option>
          {/* Thêm option thực tế nếu có */}
        </NativeSelect>

        {/* NativeSelect 2 */}
        <NativeSelect
          value={role2}
          onChange={setRole2}
          className="w-[200px]"
          selectClassName="bg-gray-50 border-gray-200"
          placeholder="All:property_role2"
        >
          <option value="all-role2">All:property_role2</option>
          {/* Thêm option thực tế nếu có */}
        </NativeSelect>

        {/* NativeSelect trạng thái */}
        <NativeSelect
          value={status}
          onChange={setStatus}
          className="w-[180px]"
          selectClassName="bg-gray-50 border-gray-200"
          placeholder="Tất cả trạng thái"
        >
          <option value="all-status">Tất cả trạng thái</option>
          {/* nếu sau này có: pending/approved/rejected thì thêm */}
          {/* <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option> */}
        </NativeSelect>

        <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6">
          Search
        </Button>
      </div>

      {/* Two Tables Side by Side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Roles Table */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-4">Danh sách vai trò</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-12"></th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tên role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Mô tả</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <Checkbox />
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{role.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{role.description}</td>
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

        {/* Permissions Table */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-4">Danh sách quyền hạn</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-12"></th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Mã quyền hạn</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Mô tả</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission) => (
                <tr key={permission.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <Checkbox />
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{permission.code}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{permission.description}</td>
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
    </section>
  );
}
