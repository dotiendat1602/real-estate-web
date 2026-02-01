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
import { useCreateArticle } from "@/hooks/news/useNewsArticles";
import { useNewsTopics } from "@/hooks/news/useNewsTopics";
import { CreateArticleRequest, NewsStatus } from "@/types/interfaces/api/news";
import { useToast, ToastContainer } from "@/components/ui/toast";

interface CreateArticleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateArticleModal({ open, onOpenChange }: CreateArticleModalProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<CreateArticleRequest>({
      defaultValues: {
        status: NewsStatus.DRAFT,
        isFeatured: false,
      },
    });

  const createMutation = useCreateArticle();
  const { data: topics } = useNewsTopics();

  const toast = useToast();

  const topicId = watch("topicId");

  const onSubmit = async (data: CreateArticleRequest) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Tạo bài viết thành công");
      reset();
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
            <Label htmlFor="coverImageUrl">URL ảnh bìa</Label>
            <Input
              id="coverImageUrl"
              {...register("coverImageUrl")}
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
