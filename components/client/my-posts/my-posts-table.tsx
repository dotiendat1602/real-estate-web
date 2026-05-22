"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { PostDataListItem, PostListQuery } from "@/types/interfaces/api/post";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPrice } from "@/lib/utils";
import { EditPostDialog } from "./edit-post-dialog";
import Pagination from "@/components/ui/pagination";

interface MyPostsTableProps {
  data: PostDataListItem[];
  isLoading: boolean;
  pagination: { pageIndex: number; pageSize: number; total: number };
  onPaginationChange: (query: PostListQuery) => void;
}

function formatDate(d?: string | Date | null) {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "-";
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const HH = String(dt.getHours()).padStart(2, "0");
  const MM = String(dt.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
}

const POST_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Nháp",
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
  ARCHIVED: "Đã lưu trữ",
};

const POST_TYPE_LABELS: Record<string, string> = {
  SALE: "Bán",
  RENT: "Cho thuê",
};

function statusPillClass(status?: string) {
  switch (status) {
    case "APPROVED":
      return "bg-green-50 border-green-200 text-green-700 dark:bg-green-600/10 dark:border-green-600/25 dark:text-green-200";
    case "PENDING":
      return "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-600/10 dark:border-yellow-600/25 dark:text-yellow-200";
    case "REJECTED":
      return "bg-red-50 border-red-200 text-red-700 dark:bg-red-600/10 dark:border-red-600/25 dark:text-red-200";
    case "ARCHIVED":
      return "bg-zinc-100 border-zinc-200 text-zinc-700 dark:bg-white/5 dark:border-[#262626] dark:text-white/70";
    default:
      return "bg-zinc-100 border-zinc-200 text-zinc-700 dark:bg-white/5 dark:border-[#262626] dark:text-white/70";
  }
}

export function MyPostsTable({
  data,
  isLoading,
  pagination,
  onPaginationChange,
}: MyPostsTableProps) {
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostDataListItem | null>(
    null
  );

  const handleSelectAll = () => {
    if (selectedAll) setSelectedItems([]);
    else setSelectedItems(data.map((item) => item.id));
    setSelectedAll(!selectedAll);
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id))
      setSelectedItems(selectedItems.filter((i) => i !== id));
    else setSelectedItems([...selectedItems, id]);
  };

  const handleEdit = (post: PostDataListItem) => {
    setSelectedPost(post);
    setEditDialogOpen(true);
  };

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));

  if (isLoading) {
    return <div className="py-8 text-center text-zinc-500 dark:text-white/60">Đang tải...</div>;
  }

  if (!data.length) {
    return <div className="py-8 text-center text-zinc-500 dark:text-white/60">Không có dữ liệu</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {/* Select All */}
        <div className="flex items-center gap-3 border-b border-zinc-200 py-3 dark:border-[#262626]">
          <Checkbox checked={selectedAll} onCheckedChange={handleSelectAll} />
          <span className="text-sm font-medium text-zinc-900 dark:text-white">Chọn tất cả</span>
          <span className="text-sm text-zinc-500 dark:text-white/60">
            {selectedItems.length} mục đã được chọn
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-[#262626] dark:bg-[#0a0a0a]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-[#262626] dark:bg-[#0f0f0f]">
                <th className="w-12 px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-white/70" />
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-white/70">
                  Ảnh BĐS
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-white/70">
                  Tiêu đề bài đăng
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-white/70">
                  Bất động sản
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-white/70">
                  Loại
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-white/70">
                  Giá
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-white/70">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-white/70">
                  Ngày tạo
                </th>
                <th className="w-12" />
              </tr>
            </thead>

            <tbody>
              {data.map((post) => {
                const primaryImage =
                  post.property.images?.find((img) => img.isPrimary) ||
                  post.property.images?.[0];

                return (
                  <tr
                    key={post.id}
                    className="border-b border-zinc-100 hover:bg-zinc-50 dark:border-[#141414] dark:hover:bg-white/[0.03]"
                  >
                    <td className="py-4 px-4">
                      <Checkbox
                        checked={selectedItems.includes(post.id)}
                        onCheckedChange={() => handleSelectItem(post.id)}
                      />
                    </td>

                    <td className="py-4 px-4">
                      <div className="h-14 w-20 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-[#262626] dark:bg-white/5">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.imageUrl}
                            alt={post.property.title}
                            width={80}
                            height={60}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-zinc-100 dark:bg-white/5" />
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-zinc-950 dark:text-white">
                          {post.postTitle}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-white/50">#{post.id}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <p className="text-sm text-zinc-700 dark:text-white/70">
                        {post.property.title}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-sm text-zinc-700 dark:text-white/70">
                        {POST_TYPE_LABELS[post.postType] || post.postType}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                        {formatPrice(post.property.price)}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={
                          "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border " +
                          statusPillClass(post.postStatus)
                        }
                      >
                        {POST_STATUS_LABELS[post.postStatus || ""] ||
                          post.postStatus}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <p className="text-sm text-zinc-700 dark:text-white/70">
                        {formatDate(new Date(post.createdAt))}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-36 border-zinc-200 bg-white text-zinc-900 dark:border-[#262626] dark:bg-[#141414] dark:text-white"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer focus:bg-zinc-100 dark:focus:bg-white/5"
                            onClick={() => handleEdit(post)}
                          >
                            Chỉnh sửa
                          </DropdownMenuItem>

                          <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 dark:text-red-300 dark:focus:bg-white/5">
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={pagination.pageIndex}
          totalPages={totalPages}
          totalItems={pagination.total}
          pageSize={pagination.pageSize}
          onPageChange={(page) => onPaginationChange({ pageIndex: page, pageSize: pagination.pageSize })}
          onPageSizeChange={(pageSize) => onPaginationChange({ pageIndex: 1, pageSize })}
          itemLabel="bài đăng"
        />
      </div>

      {selectedPost && (
        <EditPostDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          post={selectedPost}
        />
      )}
    </>
  );
}
