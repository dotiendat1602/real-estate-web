"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { PostListQuery } from "@/types/interfaces/api/post";
import {
  useApprovePost,
  useApprovePosts,
  usePosts,
  useRejectPost,
  useUpdatePost,
} from "@/hooks/post/usePost";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { PostDetailModal } from "./detail/post-detail-modal";

interface PostTableProps {
  query: PostListQuery;
  onChangeQuery: (partial: Partial<PostListQuery>) => void;
}

export function PostTable({ query, onChangeQuery }: PostTableProps) {
  const { data, isLoading, isError } = usePosts(query);
  const updatePostMutation = useUpdatePost();
  const approvePostMutation = useApprovePost();
  const approvePostsMutation = useApprovePosts();
  const rejectPostMutation = useRejectPost();

  const posts = useMemo(() => data?.data ?? [], [data?.data]);
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
    approvePostsMutation.mutate(selectedPosts, {
      onSuccess: () => setSelectedPosts([]),
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
      <div className="mb-4 flex items-center gap-3 border-b border-gray-200 py-3">
        <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
        <span className="text-sm text-gray-600">Chọn tất cả</span>
        <span className="text-sm text-gray-400">
          {selectedPosts.length} mục đã được chọn
        </span>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[50px_120px_90px_220px_180px_220px_140px_110px_140px_180px] gap-4 rounded-t-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
        <div></div>
        <div>Người dùng</div>
        <div>Ảnh</div>
        <div>Tiêu đề</div>
        <div>Mô tả</div>
        <div>Vị trí</div>
        <div>Giá</div>
        <div>Mục đích</div>
        <div>Trạng thái</div>
        <div>Hành động</div>
      </div>

      {/* Table Rows */}
      <div className="rounded-b-lg border-x border-b border-gray-200">
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

            const status = (post as any).postStatus ?? "PENDING";

            return (
              <div
                key={post.id}
                className={`grid grid-cols-[50px_120px_90px_220px_180px_220px_140px_110px_140px_180px] items-center gap-4 px-4 py-4 ${
                  index !== posts.length - 1 ? "border-b border-gray-100" : ""
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
                <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
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
                  <p className="line-clamp-2 text-sm text-gray-900">
                    {post.postTitle}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {post.property?.title ?? ""}
                  </p>
                </div>

                {/* Location */}
                <div>
                  <p className="line-clamp-2 text-sm text-gray-700">
                    {[
                      post.property?.ward?.name,
                      post.property?.district?.name,
                      post.property?.province?.name,
                    ]
                      .filter(Boolean)
                      .join(", ") || post.property?.location || "—"}
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
                  <Badge className="border-0 bg-green-100 text-green-700 hover:bg-green-100">
                    {post.postType}
                  </Badge>
                </div>

                {/* Status */}
                <div>
                  <Badge
                    className={
                      status === "APPROVED"
                        ? "border-0 bg-green-100 text-green-700 hover:bg-green-100"
                        : status === "REJECTED"
                          ? "border-0 bg-red-100 text-red-700 hover:bg-red-100"
                          : status === "PUBLISHED"
                            ? "border-0 bg-blue-100 text-blue-700 hover:bg-blue-100"
                            : status === "DRAFT"
                              ? "border-0 bg-gray-100 text-gray-700 hover:bg-gray-100"
                              : "border-0 bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
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
                    className="h-7 px-3 text-xs"
                    onClick={() => openDetailModal(post.id)}
                  >
                    XEM CHI TIẾT
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 bg-green-600 px-3 text-xs text-white hover:bg-green-700"
                    onClick={() => handleApprove(post.id)}
                    disabled={approvePostMutation.isPending || approvePostsMutation.isPending}
                  >
                    DUYỆT
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 border-red-200 bg-transparent px-3 text-xs text-red-600 hover:bg-red-50"
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
        <div className="mt-6 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
          <span className="text-sm text-gray-600">
            {selectedPosts.length} bài được chọn
          </span>
          <div className="flex items-center gap-3">
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleBulkApprove}
              disabled={approvePostMutation.isPending || approvePostsMutation.isPending}
            >
              DUYỆT TẤT CẢ
            </Button>
            <Button
              variant="outline"
              className="border-red-200 bg-transparent text-red-600 hover:bg-red-50"
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
            className="h-8 px-3 py-1"
            disabled={pageIndex <= 1}
            onClick={handlePrevPage}
          >
            Trang trước
          </Button>
          <span>
            Trang <span className="font-medium">{pageIndex}</span> /{" "}
            {totalPages}
          </span>
          <Button
            variant="outline"
            className="h-8 px-3 py-1"
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
