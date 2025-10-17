import { Bell, Globe } from "lucide-react"
import ProtectedLayout from "@/components/layouts/ProtectedLayout"
import { PostFilters } from "@/components/posts/post-filters"
import { PostTable } from "@/components/posts/post-table"

export default function PostPage() {
  return (
    <ProtectedLayout>
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Duyệt bài</h1>
              <p className="text-sm text-gray-500 mt-1">
                Quản lý và phê duyệt các tin đăng bất động sản của người dùng
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Danh sách bài duyệt bài</h2>

            <PostFilters />
            <PostTable />
          </div>
        </div>
      </main>
    </ProtectedLayout>
  )
}
