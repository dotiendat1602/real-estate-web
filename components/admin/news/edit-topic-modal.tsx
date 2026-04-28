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
import { useUpdateTopic } from "@/hooks/news/useNewsTopics";
import { NewsTopicData, UpdateTopicRequest } from "@/types/interfaces/api/news";
import { useToast, ToastContainer } from "@/components/ui/toast";

interface EditTopicModalProps {
  topic: NewsTopicData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTopicModal({ topic, open, onOpenChange }: EditTopicModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTopicRequest>({
    defaultValues: {
      name: topic.name,
    },
  });

  const updateMutation = useUpdateTopic();

  const toast = useToast();

  const onSubmit = async (data: UpdateTopicRequest) => {
    try {
      await updateMutation.mutateAsync({ id: topic.id, data });
      toast.success("Cập nhật chủ đề thành công");
      onOpenChange(false);
    } catch (error) {
      toast.error("Cập nhật chủ đề thất bại");
    }
  };

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa chủ đề</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Tên chủ đề</Label>
              <Input
                id="name"
                {...register("name", { required: "Vui lòng nhập tên chủ đề" })}
                placeholder="Nhập tên chủ đề"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
    </>
  );
}
