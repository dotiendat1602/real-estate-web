"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostListQuery } from "@/types/interfaces/api/post";
import { useApprovePost, usePosts, useRejectPost, useUpdatePost } from "@/hooks/post/usePost";
import { PostDetailModal } from "./detail/post-detail-modal";

interface PostTableProps {
  query: PostListQuery;
  onChangeQuery: (partial: Partial<PostListQuery>) => void;
}

export function PostTable({ query, onChangeQuery }: PostTableProps) {
  const { data, isLoading, isError } = usePosts(query);
  const updatePostMutation = useUpdatePost();
  const approvePostMutation = useApprovePost();
  const rejectPostMutation = useRejectPost();

  const posts = data?.data ?? [];
  const totalItems = data?.totalItems ?? 0;
  const pageIndex = data?.pageIndex ?? query.pageIndex ?? 1;
  const totalPages = data?.totalPages ?? 1;

  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const allIds = useMemo(() => posts.map((p) => p.id), [posts]);
  const selectAll = allIds.length > 0 && selectedPosts.length === allIds.length;

  // state cho modal chi tiết
  const [detailId, setDetailId] = useState<number | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(allIds);
    }
  };

  const handleSelectPost = (id: number) => {
    setSelectedPosts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleApprove = (id: number) => {
    approvePostMutation.mutate(id);
  };

  const handleReject = (id: number) => {
    rejectPostMutation.mutate({ id, reason: "Không hợp lệ" });
  };

  const handleBulkApprove = () => {
    selectedPosts.forEach((id) => {
      approvePostMutation.mutate(id);
    });
  };

  const handleBulkReject = () => {
    selectedPosts.forEach((id) => {
      rejectPostMutation.mutate({ id, reason: "Không hợp lệ" });
    });
  };

  const handlePrevPage = () => {
    if (pageIndex <= 1) return;
    onChangeQuery({ pageIndex: pageIndex - 1 });
    setSelectedPosts([]);
  };

  const handleNextPage = () => {
    if (pageIndex >= totalPages) return;
    onChangeQuery({ pageIndex: pageIndex + 1 });
    setSelectedPosts([]);
  };

  const openDetailModal = (id: number) => {
    setDetailId(id);
    setOpenDetail(true);
  };

  return (
    <div>
      {/* Select All Row */}
      <div className="flex items-center gap-3 py-3 border-b border-gray-200 mb-4">
        <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
        <span className="text-sm text-gray-600">Chọn tất cả</span>
        <span className="text-sm text-gray-400">
          {selectedPosts.length} mục đã được chọn
        </span>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[50px_120px_100px_200px_150px_150px_120px_160px_180px] gap-4 px-4 py-3 bg-gray-50 rounded-t-lg border border-gray-200 text-sm font-medium text-gray-700">
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
        {isLoading && (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            Đang tải dữ liệu...
          </div>
        )}

        {isError && !isLoading && (
          <div className="px-4 py-6 text-center text-sm text-red-500">
            Có lỗi xảy ra khi tải danh sách bài đăng
          </div>
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            Không có bài đăng nào
          </div>
        )}

        {!isLoading &&
          !isError &&
          posts.map((post, index) => {
            const primaryImage =
              post.property?.images?.find((img) => img.isPrimary) ??
              post.property?.images?.[0];

            const status =
              (post as any).postStatus ?? "PENDING";

            return (
              <div
                key={post.id}
                className={`grid grid-cols-[50px_120px_100px_200px_150px_150px_120px_160px_180px] gap-4 px-4 py-4 items-center ${index !== posts.length - 1 ? "border-b border-gray-100" : ""
                  }`}
              >
                <Checkbox
                  checked={selectedPosts.includes(post.id)}
                  onCheckedChange={() => handleSelectPost(post.id)}
                />

                {/* User */}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {post.createdBy?.name ?? "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    #{post.createdBy?.id ?? "—"}
                  </p>
                </div>

                {/* Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.imageUrl}
                      alt={post.postTitle}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/placeholder.svg"
                      alt="No image"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Title */}
                <div>
                  <p className="text-sm text-gray-900 line-clamp-2">
                    {post.postTitle}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.property?.title ?? ""}
                  </p>
                </div>

                {/* Price */}
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    {post.property?.price
                      ? `${post.property.price.toLocaleString("vi-VN")} VND`
                      : "—"}
                  </p>
                </div>

                {/* Purpose */}
                <div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                    {post.postType}
                  </Badge>
                </div>

                {/* Status */}
                <div>
                  <Badge
                    className={
                      status === "APPROVED"
                        ? "bg-green-100 text-green-700 hover:bg-green-100 border-0"
                        : status === "REJECTED"
                          ? "bg-red-100 text-red-700 hover:bg-red-100 border-0"
                          : status === "PUBLISHED"
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border-0"
                            : status === "DRAFT"
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-100 border-0"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0"
                    }
                  >
                    {status}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 px-3"
                    onClick={() => openDetailModal(post.id)}
                  >
                    XEM CHI TIẾT
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-3"
                    onClick={() => handleApprove(post.id)}
                    disabled={approvePostMutation.isPending}
                  >
                    DUYỆT
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 text-xs h-7 px-3 bg-transparent"
                    onClick={() => handleReject(post.id)}
                    disabled={rejectPostMutation.isPending}
                  >
                    TỪ CHỐI
                  </Button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm text-gray-600">
            {selectedPosts.length} bài được chọn
          </span>
          <div className="flex items-center gap-3">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleBulkApprove}
              disabled={approvePostMutation.isPending}
            >
              DUYỆT TẤT CẢ
            </Button>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
              onClick={handleBulkReject}
              disabled={rejectPostMutation.isPending}
            >
              TỪ CHỐI TẤT CẢ
            </Button>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
        <div>
          Tổng: <span className="font-medium">{totalItems}</span> bài
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="px-3 py-1 h-8"
            disabled={pageIndex <= 1}
            onClick={handlePrevPage}
          >
            Trang trước
          </Button>
          <span>
            Trang <span className="font-medium">{pageIndex}</span> / {totalPages}
          </span>
          <Button
            variant="outline"
            className="px-3 py-1 h-8"
            disabled={pageIndex >= totalPages}
            onClick={handleNextPage}
          >
            Trang sau
          </Button>
        </div>
      </div>

      <PostDetailModal
        open={openDetail}
        onOpenChange={setOpenDetail}
        postId={detailId}
      />
    </div>
  );
}
