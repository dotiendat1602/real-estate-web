"use client";

import React from "react";
import { useForm } from "react-hook-form";
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
import { useUpdateArticle } from "@/hooks/news/useNewsArticles";
import { useNewsTopics } from "@/hooks/news/useNewsTopics";
import { NewsArticleData, UpdateArticleRequest } from "@/types/interfaces/api/news";
import { useToast, ToastContainer } from "@/components/ui/toast";

interface EditArticleModalProps {
  article: NewsArticleData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditArticleModal({ article, open, onOpenChange }: EditArticleModalProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<UpdateArticleRequest>({
      defaultValues: {
        title: article.title,
        topicId: article.topicId,
        excerpt: article.excerpt ?? "",
        content: article.content ?? "",
        cover: article.coverImageUrl ?? "",
        readMin: article.readMin ?? undefined,
      },
    });

  const updateMutation = useUpdateArticle();
  const { data: topics } = useNewsTopics();

  const toast = useToast();

  const topicId = watch("topicId");

  const onSubmit = async (data: UpdateArticleRequest) => {
    try {
      await updateMutation.mutateAsync({ id: article.id, data });
      toast.success("Cập nhật bài viết thành công");
      onOpenChange(false);
    } catch (error) {
      toast.error("Cập nhật bài viết thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              {...register("title", { required: "Vui lòng nhập tiêu đề" })}
              placeholder="Nhập tiêu đề bài viết"
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
            />
          </div>

          <div>
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Nhập nội dung bài viết"
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="cover">URL ảnh bìa</Label>
            <Input
              id="cover"
              {...register("cover")}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="readMin">Thời gian đọc (phút)</Label>
            <Input
              id="readMin"
              type="number"
              {...register("readMin", { valueAsNumber: true })}
              placeholder="5"
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
              disabled={updateMutation.isPending}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {updateMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
