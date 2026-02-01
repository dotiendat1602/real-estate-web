"use client";

import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNewsTopics, useDeleteTopic } from "@/hooks/news/useNewsTopics";
import { CreateTopicModal } from "./create-topic-modal";
import { EditTopicModal } from "./edit-topic-modal";
import { NewsTopicData } from "@/types/interfaces/api/news";
import { useToast, ToastContainer } from "@/components/ui/toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function TopicsSection() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingTopic, setEditingTopic] = React.useState<NewsTopicData | null>(null);
  const [deletingTopicId, setDeletingTopicId] = React.useState<number | null>(null);

  const { data: topics, isLoading } = useNewsTopics();
  const deleteMutation = useDeleteTopic();

  const toast = useToast();

  const handleDelete = async () => {
    if (!deletingTopicId) return;

    try {
      await deleteMutation.mutateAsync(deletingTopicId);
      toast.success("Xóa chủ đề thành công");
      setDeletingTopicId(null);
    } catch (error) {
      toast.error("Xóa chủ đề thất bại");
    }
  };

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Chủ đề tin tức</h2>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý các chủ đề phân loại tin tức
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo chủ đề
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        ) : !topics || topics.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Chưa có chủ đề nào</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên chủ đề</TableHead>
                <TableHead>Số bài viết</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">{topic.id}</TableCell>
                  <TableCell>{topic.name}</TableCell>
                  <TableCell>{topic._count.articles}</TableCell>
                  <TableCell>
                    {new Date(topic.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTopic(topic)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingTopicId(topic.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <CreateTopicModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />

        {editingTopic && (
          <EditTopicModal
            topic={editingTopic}
            open={!!editingTopic}
            onOpenChange={(open) => !open && setEditingTopic(null)}
          />
        )}

        <AlertDialog
          open={!!deletingTopicId}
          onOpenChange={(open) => !open && setDeletingTopicId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa chủ đề này? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </>
  );
}
