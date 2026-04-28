// components/admin/news/article-table.tsx
"use client";

import React from "react";
import { Pencil, Trash2, Star, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  useDeleteArticle,
  useToggleFeaturedArticle,
  usePublishArticle,
  useUnpublishArticle,
} from "@/hooks/news/useNewsArticles";
import { NewsArticleData, NewsStatus } from "@/types/interfaces/api/news";
import { EditArticleModal } from "./edit-article-modal";
import { cn } from "@/lib/utils";
import { useToast, ToastContainer } from "@/components/ui/toast";

interface ArticleTableProps {
  data: NewsArticleData[];
  isLoading: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
  onPaginationChange: (pageIndex: number) => void;
}

export function ArticleTable({
  data,
  isLoading,
  pagination,
  onPaginationChange,
}: ArticleTableProps) {
  const [editingArticle, setEditingArticle] = React.useState<NewsArticleData | null>(null);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const deleteMutation = useDeleteArticle();
  const toggleFeaturedMutation = useToggleFeaturedArticle();
  const publishMutation = usePublishArticle();
  const unpublishMutation = useUnpublishArticle();

  const toast = useToast();

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Xóa bài viết thành công");
      setDeletingId(null);
    } catch (error) {
      toast.error("Xóa bài viết thất bại");
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      await toggleFeaturedMutation.mutateAsync(id);
      toast.success("Cập nhật trạng thái nổi bật thành công");
    } catch (error) {
      toast.error("Cập nhật thất bại");
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await publishMutation.mutateAsync(id);
      toast.success("Xuất bản bài viết thành công");
    } catch (error) {
      toast.error("Xuất bản thất bại");
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await unpublishMutation.mutateAsync(id);
      toast.success("Gỡ xuất bản bài viết thành công");
    } catch (error) {
      toast.error("Gỡ xuất bản thất bại");
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Đang tải...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Chưa có bài viết nào</div>;
  }

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Chủ đề</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Nổi bật</TableHead>
            <TableHead>Lượt lưu</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="font-medium max-w-xs truncate">
                {article.title}
              </TableCell>

              <TableCell>{article.topic.name}</TableCell>

              <TableCell>
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    article.status === NewsStatus.PUBLISHED
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {article.status === NewsStatus.PUBLISHED ? "Đã xuất bản" : "Nháp"}
                </span>
              </TableCell>

              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleFeatured(article.id)}
                  className={cn(article.isFeatured && "text-yellow-500 hover:text-yellow-600")}
                >
                  <Star
                    className={cn("w-4 h-4", article.isFeatured && "fill-current")}
                  />
                </Button>
              </TableCell>

              <TableCell>{article._count.savedBy}</TableCell>

              <TableCell>
                {new Date(article.createdAt).toLocaleDateString("vi-VN")}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {article.status === NewsStatus.DRAFT ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePublish(article.id)}
                      title="Xuất bản"
                    >
                      <Upload className="w-4 h-4 text-green-600" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUnpublish(article.id)}
                      title="Gỡ xuất bản"
                    >
                      <Download className="w-4 h-4 text-orange-600" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingArticle(article)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(article.id)}
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          Hiển thị {(pagination.pageIndex - 1) * pagination.pageSize + 1} -{" "}
          {Math.min(pagination.pageIndex * pagination.pageSize, pagination.total)} của{" "}
          {pagination.total} bài viết
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex === 1}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange(pagination.pageIndex + 1)}
            disabled={pagination.pageIndex >= totalPages}
          >
            Sau
          </Button>
        </div>
      </div>

      {editingArticle && (
        <EditArticleModal
          article={editingArticle}
          open={!!editingArticle}
          onOpenChange={(open) => !open && setEditingArticle(null)}
        />
      )}

      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
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
    </>
  );
}
