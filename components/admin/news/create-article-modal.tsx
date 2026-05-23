"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/select";
import { useCreateArticle } from "@/hooks/news/useNewsArticles";
import { useNewsTopics } from "@/hooks/news/useNewsTopics";
import { CreateArticleRequest, NewsStatus } from "@/types/interfaces/api/news";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { useUploadFile } from "@/hooks/useUpload";

interface CreateArticleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateArticleModal({ open, onOpenChange }: CreateArticleModalProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<CreateArticleRequest>({
      defaultValues: {
        status: NewsStatus.DRAFT,
        isFeatured: false,
      },
    });

  const createMutation = useCreateArticle();
  const uploadMutation = useUploadFile();
  const { data: topics } = useNewsTopics();

  const toast = useToast();

  const topicId = watch("topicId");
  const coverImageUrl = watch("coverImageUrl");

  const handleUploadCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      event.target.value = "";
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync(file);
      setValue("coverImageUrl", result.url, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Tải ảnh bìa thành công");
    } catch (error) {
      toast.error("Tải ảnh bìa thất bại");
    } finally {
      event.target.value = "";
    }
  };

  const onSubmit = async (data: CreateArticleRequest) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Tạo bài viết thành công");
      reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
      onOpenChange(false);
    } catch (error) {
      toast.error("Tạo bài viết thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              {...register("title", { required: "Vui lòng nhập tiêu đề" })}
              placeholder="Nhập tiêu đề bài viết"
              className="mt-2"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="topicId">Chủ đề</Label>
            <NativeSelect
              value={topicId ? String(topicId) : ""}
              onChange={(value) => setValue("topicId", Number(value), { shouldValidate: true })}
              placeholder="Chọn chủ đề"
              className="mt-2"
              selectClassName="h-10"
            >
              {topics?.map((topic) => (
                <option key={topic.id} value={String(topic.id)}>
                  {topic.name}
                </option>
              ))}
            </NativeSelect>

            {errors.topicId && (
              <p className="text-sm text-red-600 mt-1">{String(errors.topicId.message ?? "Vui lòng chọn chủ đề")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="excerpt">Mô tả ngắn</Label>
            <Textarea
              id="excerpt"
              {...register("excerpt")}
              placeholder="Nhập mô tả ngắn"
              rows={3}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Nhập nội dung bài viết"
              rows={6}
              className="mt-2"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="coverImageUrl">Ảnh bìa</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="coverImageUrl"
                {...register("coverImageUrl")}
                placeholder="https://example.com/image.jpg"
                className="sm:flex-1"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadCover}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="h-4 w-4" />
                )}
                Upload
              </Button>
              {coverImageUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setValue("coverImageUrl", "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  aria-label="Xóa ảnh bìa"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              {coverImageUrl ? (
                <img
                  src={coverImageUrl}
                  alt="Preview ảnh bìa"
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-44 flex-col items-center justify-center gap-2 text-sm text-gray-500">
                  <ImageIcon className="h-8 w-8" />
                  <span>Chưa có ảnh xem trước</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="readMin">Thời gian đọc (phút)</Label>
            <Input
              id="readMin"
              type="number"
              {...register("readMin", { valueAsNumber: true })}
              placeholder="5"
              className="mt-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {createMutation.isPending ? "Đang tạo..." : "Tạo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
