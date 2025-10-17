"use client"
import { Checkbox } from "@/components/ui/checkbox"

const roles = [
  { id: 1, name: "Admin", description: "Quản trị hệ thống" },
  { id: 2, name: "Manager", description: "Quản lý văn" },
  { id: 3, name: "Agent", description: "Môi giới" },
  { id: 4, name: "Viewer", description: "Chỉ xem" },
]

const permissions = [
  { id: 1, code: "property_view" },
  { id: 2, code: "property_create" },
  { id: 3, code: "property_edit" },
  { id: 4, code: "property_approved" },
  { id: 5, code: "user_manage" },
  { id: 6, code: "role_manage" },
  { id: 7, code: "payment_manage" },
]

export function PermissionMatrix() {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Ma trận quyền (Roles x Permissions)</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 min-w-[200px]">Vai trò / Quyền</th>
              {permissions.map((permission) => (
                <th key={permission.id} className="text-center py-3 px-4 text-sm font-medium text-gray-700">
                  {permission.code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{role.name}</div>
                    <div className="text-xs text-gray-500">{role.description}</div>
                  </div>
                </td>
                {permissions.map((permission) => (
                  <td key={permission.id} className="py-4 px-4 text-center">
                    <div className="flex justify-center">
                      <Checkbox defaultChecked />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
