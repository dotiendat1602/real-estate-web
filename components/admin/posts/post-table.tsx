"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import DialogConfirm from "@/components/DialogConfirm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Pagination from "@/components/ui/pagination";
import {
  useApprovePost,
  useApprovePosts,
  useArchivePost,
  useDeletePost,
  usePosts,
  useRejectPost,
} from "@/hooks/post/usePost";
import { PostStatus, PostType } from "@/types/enums/post";
import type { PostListQuery } from "@/types/interfaces/api/post";
import { PostDetailModal } from "./detail/post-detail-modal";

interface PostTableProps {
  query: PostListQuery;
  onChangeQuery: (partial: Partial<PostListQuery>) => void;
}

type ConfirmAction =
  | { type: "reject"; id: number; title: string }
  | { type: "bulkReject"; ids: number[] }
  | { type: "archive"; id: number; title: string }
  | { type: "delete"; id: number; title: string }
  | null;

const STATUS_LABELS: Record<PostStatus, string> = {
  [PostStatus.DRAFT]: "Nháp",
  [PostStatus.PENDING]: "Chờ duyệt",
  [PostStatus.APPROVED]: "Đã duyệt",
  [PostStatus.REJECTED]: "Từ chối",
  [PostStatus.ARCHIVED]: "Đã lưu trữ",
};

const TYPE_LABELS: Record<PostType, string> = {
  [PostType.SALE]: "Bán",
  [PostType.RENT]: "Cho thuê",
  [PostType.OTHER]: "Khác",
};

function statusClass(status: PostStatus) {
  if (status === PostStatus.APPROVED) {
    return "border-0 bg-green-100 text-green-700 hover:bg-green-100";
  }
  if (status === PostStatus.REJECTED) {
    return "border-0 bg-red-100 text-red-700 hover:bg-red-100";
  }
  if (status === PostStatus.ARCHIVED) {
    return "border-0 bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
  if (status === PostStatus.DRAFT) {
    return "border-0 bg-slate-100 text-slate-700 hover:bg-slate-100";
  }
  return "border-0 bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
}

export function PostTable({ query, onChangeQuery }: PostTableProps) {
  const { data, isLoading, isError } = usePosts(query);
  const approvePostMutation = useApprovePost();
  const approvePostsMutation = useApprovePosts();
  const rejectPostMutation = useRejectPost();
  const archivePostMutation = useArchivePost();
  const deletePostMutation = useDeletePost();

  const posts = useMemo(() => data?.data ?? [], [data?.data]);
  const totalItems = data?.totalItems ?? 0;
  const pageIndex = data?.pageIndex ?? query.pageIndex ?? 1;
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  const currentStatus = query.status as PostStatus | undefined;
  const canSelect = currentStatus === PostStatus.PENDING;

  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const allIds = useMemo(() => posts.map((post) => post.id), [posts]);
  const selectAll = allIds.length > 0 && selectedPosts.length === allIds.length;

  const isMutating =
    approvePostMutation.isPending ||
    approvePostsMutation.isPending ||
    rejectPostMutation.isPending ||
    archivePostMutation.isPending ||
    deletePostMutation.isPending;

  const handleSelectAll = () => {
    setSelectedPosts(selectAll ? [] : allIds);
  };

  const handleSelectPost = (id: number) => {
    setSelectedPosts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    approvePostsMutation.mutate(selectedPosts, {
      onSuccess: () => setSelectedPosts([]),
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    if (confirmAction.type === "reject") {
      await rejectPostMutation.mutateAsync({
        id: confirmAction.id,
        reason: "Không hợp lệ",
      });
    }

    if (confirmAction.type === "bulkReject") {
      await Promise.all(
        confirmAction.ids.map((id) =>
          rejectPostMutation.mutateAsync({ id, reason: "Không hợp lệ" })
        )
      );
    }

    if (confirmAction.type === "archive") {
      await archivePostMutation.mutateAsync(confirmAction.id);
    }

    if (confirmAction.type === "delete") {
      await deletePostMutation.mutateAsync(confirmAction.id);
    }

    setConfirmAction(null);
    setSelectedPosts([]);
  };

  const getConfirmContent = () => {
    if (!confirmAction) {
      return {
        title: "",
        description: "",
        confirmText: "",
        variant: "default" as const,
      };
    }

    if (confirmAction.type === "reject") {
      return {
        title: "Từ chối bài đăng?",
        description: `Bạn chắc chắn muốn từ chối "${confirmAction.title}"?`,
        confirmText: "Từ chối",
        variant: "destructive" as const,
      };
    }

    if (confirmAction.type === "bulkReject") {
      return {
        title: "Từ chối các bài đã chọn?",
        description: `Bạn chắc chắn muốn từ chối ${confirmAction.ids.length} bài đăng đã chọn?`,
        confirmText: "Từ chối",
        variant: "destructive" as const,
      };
    }

    if (confirmAction.type === "archive") {
      return {
        title: "Lưu trữ bài đăng?",
        description: `Bạn chắc chắn muốn lưu trữ "${confirmAction.title}"?`,
        confirmText: "Lưu trữ",
        variant: "default" as const,
      };
    }

    return {
      title: "Xóa bài đăng?",
      description: `Bạn chắc chắn muốn xóa "${confirmAction.title}"? Hành động này không thể hoàn tác.`,
      confirmText: "Xóa",
      variant: "destructive" as const,
    };
  };

  const confirmContent = getConfirmContent();

  return (
    <div>
      {canSelect && (
        <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-gray-200 py-3">
          <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
          <span className="text-sm text-gray-600">Chọn tất cả</span>
          <span className="text-sm text-gray-400">
            {selectedPosts.length} mục đã được chọn
          </span>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="min-w-[1180px]">
          <div
            className={`grid ${
              canSelect
                ? "grid-cols-[50px_120px_90px_220px_180px_220px_140px_110px_140px_220px]"
                : "grid-cols-[120px_90px_220px_180px_220px_140px_110px_140px_220px]"
            } gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700`}
          >
            {canSelect && <div />}
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

          {isLoading && (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Đang tải dữ liệu...
            </div>
          )}

          {isError && !isLoading && (
            <div className="px-4 py-6 text-center text-sm text-red-500">
              Có lỗi xảy ra khi tải danh sách bài đăng.
            </div>
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Không có bài đăng nào.
            </div>
          )}

          {!isLoading &&
            !isError &&
            posts.map((post, index) => {
              const primaryImage =
                post.property?.images?.find((image) => image.isPrimary) ??
                post.property?.images?.[0];
              const status = (post.postStatus ?? PostStatus.PENDING) as PostStatus;
              const rowTitle = post.postTitle || `Bài đăng #${post.id}`;

              return (
                <div
                  key={post.id}
                  className={`grid ${
                    canSelect
                      ? "grid-cols-[50px_120px_90px_220px_180px_220px_140px_110px_140px_220px]"
                      : "grid-cols-[120px_90px_220px_180px_220px_140px_110px_140px_220px]"
                  } items-center gap-4 px-4 py-4 ${
                    index !== posts.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  {canSelect && (
                    <Checkbox
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={() => handleSelectPost(post.id)}
                    />
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {post.createdBy?.name ?? "-"}
                    </p>
                    <p className="text-xs text-gray-500">
                      #{post.createdBy?.id ?? "-"}
                    </p>
                  </div>

                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={primaryImage?.imageUrl || "/placeholder.svg"}
                      alt={rowTitle}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <p className="line-clamp-2 text-sm text-gray-900">{rowTitle}</p>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {post.property?.title ?? "-"}
                  </p>
                  <p className="line-clamp-2 text-sm text-gray-700">
                    {[
                      post.property?.ward?.name,
                      post.property?.district?.name,
                      post.property?.province?.name,
                    ]
                      .filter(Boolean)
                      .join(", ") ||
                      post.property?.location ||
                      "-"}
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    {post.property?.price
                      ? `${Number(post.property.price).toLocaleString("vi-VN")} VND`
                      : "-"}
                  </p>
                  <Badge className="w-fit border-0 bg-green-100 text-green-700 hover:bg-green-100">
                    {TYPE_LABELS[post.postType] ?? post.postType}
                  </Badge>
                  <Badge className={statusClass(status)}>
                    {STATUS_LABELS[status] ?? status}
                  </Badge>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 cursor-pointer px-3 text-xs"
                      onClick={() => {
                        setDetailId(post.id);
                        setOpenDetail(true);
                      }}
                    >
                      Xem chi tiết
                    </Button>

                    {status === PostStatus.PENDING && (
                      <>
                        <Button
                          size="sm"
                          className="h-8 cursor-pointer bg-green-600 px-3 text-xs text-white hover:bg-green-700"
                          onClick={() => approvePostMutation.mutate(post.id)}
                          disabled={isMutating}
                        >
                          Duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 cursor-pointer border-red-200 bg-transparent px-3 text-xs text-red-600 hover:bg-red-50"
                          onClick={() =>
                            setConfirmAction({
                              type: "reject",
                              id: post.id,
                              title: rowTitle,
                            })
                          }
                          disabled={isMutating}
                        >
                          Từ chối
                        </Button>
                      </>
                    )}

                    {status === PostStatus.APPROVED && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 cursor-pointer border-amber-200 bg-amber-50 px-3 text-xs text-amber-700 hover:bg-amber-100"
                        onClick={() =>
                          setConfirmAction({
                            type: "archive",
                            id: post.id,
                            title: rowTitle,
                          })
                        }
                        disabled={isMutating}
                      >
                        Lưu trữ
                      </Button>
                    )}

                    {status === PostStatus.ARCHIVED && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 cursor-pointer border-red-200 bg-transparent px-3 text-xs text-red-600 hover:bg-red-50"
                        onClick={() =>
                          setConfirmAction({
                            type: "delete",
                            id: post.id,
                            title: rowTitle,
                          })
                        }
                        disabled={isMutating}
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {canSelect && selectedPosts.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <span className="text-sm text-gray-600">
            {selectedPosts.length} bài được chọn
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="cursor-pointer bg-green-600 text-white hover:bg-green-700"
              onClick={handleBulkApprove}
              disabled={isMutating}
            >
              Duyệt tất cả
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer border-red-200 bg-transparent text-red-600 hover:bg-red-50"
              onClick={() =>
                setConfirmAction({ type: "bulkReject", ids: selectedPosts })
              }
              disabled={isMutating}
            >
              Từ chối tất cả
            </Button>
          </div>
        </div>
      )}

      <Pagination
        currentPage={pageIndex}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={query.pageSize ?? 10}
        onPageChange={(page) => {
          onChangeQuery({ pageIndex: page });
          setSelectedPosts([]);
        }}
        onPageSizeChange={(pageSize) => {
          onChangeQuery({ pageIndex: 1, pageSize });
          setSelectedPosts([]);
        }}
        itemLabel="bài đăng"
        className="mt-4"
      />

      <DialogConfirm
        open={!!confirmAction}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
        title={confirmContent.title}
        description={confirmContent.description}
        confirmText={isMutating ? "Đang xử lý..." : confirmContent.confirmText}
        cancelText="Hủy"
        confirmVariant={confirmContent.variant}
        onConfirm={handleConfirmAction}
      />

      <PostDetailModal
        open={openDetail}
        onOpenChange={setOpenDetail}
        postId={detailId}
      />
    </div>
  );
}
