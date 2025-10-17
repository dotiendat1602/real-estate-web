import { Bell, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { UserFilters } from "@/components/users/user-filters"
import { UserTable } from "@/components/users/user-table"
import { RolePermissionSection } from "@/components/users/role-permission-section"
import { PermissionMatrix } from "@/components/users/permission-matrix"

export default function UsersPage() {
  return (
    <ProtectedLayout>
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Người dùng và phân quyền</h1>
              <p className="text-sm text-gray-500 mt-1">
                Quản lý thông tin người dùng, vai trò và quyền truy cập hệ thống
              </p>
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

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* User List Section */}
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Danh sách người dùng</h2>
            <UserFilters />
            <UserTable />
          </section>

          {/* Roles and Permissions Section */}
          <RolePermissionSection />

          {/* Permission Matrix Section */}
          <PermissionMatrix />
        </div>
      </main>
    </ProtectedLayout>
  )
}
