"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { usePostDetail, useUpdatePost } from "@/hooks/post/usePost";
import { PostStatus, PostType } from "@/types/enums/post";

interface PostDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number | null;
}

export function PostDetailModal({ open, onOpenChange, postId }: PostDetailModalProps) {
  const { data, isLoading, isError } = usePostDetail(postId ?? 0);
  const updatePostMutation = useUpdatePost();

  const [postTitle, setPostTitle] = useState("");
  const [postType, setPostType] = useState<PostType | "">("");
  const [postStatus, setPostStatus] = useState<PostStatus | "">("");
  const [postContent, setPostContent] = useState("");

  // Sync state khi load detail xong / đổi postId
  useEffect(() => {
    if (data) {
      setPostTitle(data.postTitle ?? "");
      setPostType(data.postType ?? "");
      setPostStatus(data.postStatus ?? "");
      setPostContent(data.postContent ?? "");
    }
  }, [data]);

  const handleClose = () => {
    if (updatePostMutation.isPending) return;
    onOpenChange(false);
  };

  const handleSave = () => {
    if (!postId) return;

    updatePostMutation.mutate(
      {
        id: postId,
        data: {
          postTitle: postTitle || undefined,
          postType: postType || undefined,
          postStatus: postStatus || undefined,
          postContent: postContent || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const detail = data;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chi tiết bài đăng</DialogTitle>
          <DialogDescription>
            Xem và cập nhật thông tin bài đăng bất động sản.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="py-6 text-sm text-gray-500">
            Đang tải dữ liệu bài đăng...
          </div>
        )}

        {isError && !isLoading && (
          <div className="py-6 text-sm text-red-500">
            Không tải được chi tiết bài đăng. Vui lòng thử lại.
          </div>
        )}

        {!isLoading && !isError && detail && (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {/* Thông tin post */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-xs text-gray-500">Người tạo</Label>
                <p className="text-sm font-medium text-gray-900">
                  {detail.createdBy?.name}{" "}
                  <span className="text-gray-500">#{detail.createdBy?.id}</span>
                </p>
              </div>

              <div>
                <Label className="text-xs text-gray-500">Ngày tạo</Label>
                <p className="text-sm text-gray-700">
                  {detail.createdAt ? new Date(detail.createdAt).toLocaleString("vi-VN") : "—"}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Ngày cập nhật</Label>
                <p className="text-sm text-gray-700">
                  {detail.updatedAt ? new Date(detail.updatedAt).toLocaleString("vi-VN") : "—"}
                </p>
              </div>
            </div>

            {/* Form chỉnh sửa post */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="postTitle">Tiêu đề bài đăng</Label>
                <Input
                  id="postTitle"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Loại bài</Label>
                  <NativeSelect
                    className="mt-1"
                    value={postType || ""}
                    onChange={(value) => setPostType(value as PostType)}
                  >
                    <option value="">Chọn loại bài</option>
                    <option value={PostType.SALE}>Bán</option>
                    <option value={PostType.RENT}>Cho thuê</option>
                    <option value={PostType.OTHER}>Khác</option>
                  </NativeSelect>
                </div>
                <div>
                  <Label>Trạng thái bài</Label>
                  <NativeSelect
                    className="mt-1"
                    value={postStatus || ""}
                    onChange={(value) => setPostStatus(value as PostStatus)}
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value={PostStatus.DRAFT}>Nháp</option>
                    <option value={PostStatus.PENDING}>Chờ duyệt</option>
                    <option value={PostStatus.APPROVED}>Đã duyệt</option>
                    <option value={PostStatus.REJECTED}>Từ chối</option>
                    <option value={PostStatus.ARCHIVED}>Đã lưu trữ</option>
                  </NativeSelect>
                </div>
              </div>

              <div>
                <Label htmlFor="postContent">Nội dung bài đăng</Label>
                <Textarea
                  id="postContent"
                  className="mt-1 min-h-[120px]"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>
            </div>

            {/* Thông tin BĐS (read-only) */}
            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-semibold text-gray-900">
                Thông tin bất động sản
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Tiêu đề BĐS:</span>{" "}
                  <span className="font-medium">
                    {detail.property?.title ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Giá:</span>{" "}
                  <span className="font-medium text-blue-600">
                    {detail.property?.price != null
                      ? `${new Intl.NumberFormat("vi-VN").format(Number(detail.property.price))} VND`
                      : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Diện tích:</span>{" "}
                  <span className="font-medium">
                    {detail.property?.area ? `${detail.property.area} m²` : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Phòng ngủ:</span>{" "}
                  <span className="font-medium">
                    {detail.property?.bedroomNumber ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Vị trí:</span>{" "}
                  <span className="font-medium">
                    {detail.property?.location ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Trạng thái BĐS:</span>{" "}
                  <span className="font-medium">
                    {detail.property?.status ?? "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={updatePostMutation.isPending}
          >
            Đóng
          </Button>
          <Button
            onClick={handleSave}
            disabled={updatePostMutation.isPending || !postId}
          >
            {updatePostMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
