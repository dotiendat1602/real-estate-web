"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
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
      return "bg-green-600/10 border-green-600/25 text-green-200";
    case "PENDING":
      return "bg-yellow-600/10 border-yellow-600/25 text-yellow-200";
    case "REJECTED":
      return "bg-red-600/10 border-red-600/25 text-red-200";
    case "ARCHIVED":
      return "bg-white/5 border-[#262626] text-white/70";
    default:
      return "bg-white/5 border-[#262626] text-white/70";
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

  const handlePageChange = (newPage: number) => {
    onPaginationChange({ pageIndex: newPage, pageSize: pagination.pageSize });
  };

  if (isLoading) {
    return <div className="text-center py-8 text-white/60">Đang tải...</div>;
  }

  if (!data.length) {
    return <div className="text-center py-8 text-white/60">Không có dữ liệu</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {/* Select All */}
        <div className="flex items-center gap-3 py-3 border-b border-[#262626]">
          <Checkbox checked={selectedAll} onCheckedChange={handleSelectAll} />
          <span className="text-sm font-medium text-white">Chọn tất cả</span>
          <span className="text-sm text-white/60">
            {selectedItems.length} mục đã được chọn
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-[#262626] bg-[#0a0a0a]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626] bg-[#0f0f0f]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-white/70 w-12" />
                <th className="text-left py-3 px-4 text-xs font-semibold text-white/70">
                  Ảnh BĐS
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white/70">
                  Tiêu đề bài đăng
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white/70">
                  Bất động sản
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white/70">
                  Loại
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white/70">
                  Giá
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white/70">
                  Trạng thái
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white/70">
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
                    className="border-b border-[#141414] hover:bg-white/[0.03]"
                  >
                    <td className="py-4 px-4">
                      <Checkbox
                        checked={selectedItems.includes(post.id)}
                        onCheckedChange={() => handleSelectItem(post.id)}
                      />
                    </td>

                    <td className="py-4 px-4">
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-white/5 border border-[#262626]">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.imageUrl}
                            alt={post.property.title}
                            width={80}
                            height={60}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/5" />
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {post.postTitle}
                        </p>
                        <p className="text-xs text-white/50">#{post.id}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <p className="text-sm text-white/70">
                        {post.property.title}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-sm text-white/70">
                        {POST_TYPE_LABELS[post.postType] || post.postType}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-purple-300">
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
                      <p className="text-sm text-white/70">
                        {formatDate(new Date(post.createdAt))}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer text-white/60 hover:text-white hover:bg-white/5 h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-36 bg-[#141414] border-[#262626] text-white"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer focus:bg-white/5"
                            onClick={() => handleEdit(post)}
                          >
                            Chỉnh sửa
                          </DropdownMenuItem>

                          <DropdownMenuItem className="text-red-300 cursor-pointer focus:bg-white/5">
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <div className="text-sm text-white/60">
            Hiển thị{" "}
            {(pagination.pageIndex - 1) * pagination.pageSize + 1} đến{" "}
            {Math.min(pagination.pageIndex * pagination.pageSize, pagination.total)}{" "}
            trong tổng số {pagination.total} kết quả
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.pageIndex - 1)}
              disabled={pagination.pageIndex === 1}
              className="border-[#262626] bg-transparent text-white hover:bg-white/5"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-white/70">
              Trang {pagination.pageIndex} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.pageIndex + 1)}
              disabled={pagination.pageIndex >= totalPages}
              className="border-[#262626] bg-transparent text-white hover:bg-white/5"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
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
