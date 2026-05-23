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
import { useCreateTopic } from "@/hooks/news/useNewsTopics";
import { CreateTopicRequest } from "@/types/interfaces/api/news";
import { useToast, ToastContainer } from "@/components/ui/toast";

interface CreateTopicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTopicModal({ open, onOpenChange }: CreateTopicModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTopicRequest>();

  const createMutation = useCreateTopic();

  const toast = useToast();

  const onSubmit = async (data: CreateTopicRequest) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Tạo chủ đề thành công");
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Tạo chủ đề thất bại");
    }
  };

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo chủ đề mới</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Tên chủ đề</Label>
              <Input
                id="name"
                {...register("name", { required: "Vui lòng nhập tên chủ đề" })}
                placeholder="Nhập tên chủ đề"
                className="mt-2"
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
                disabled={createMutation.isPending}
                className="bg-gray-900 hover:bg-gray-800"
              >
                {createMutation.isPending ? "Đang tạo..." : "Tạo"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
