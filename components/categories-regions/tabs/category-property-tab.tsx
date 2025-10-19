"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, Pencil, Trash2, Plus, RefreshCw } from "lucide-react";

import {
  useCategoriesProperty,
  useDeleteCategoryProperty,
} from "@/hooks/categories-regions/useCategoryProperty";

import DialogConfirm from "@/components/DialogConfirm";
import CreateCategoryPropertyModal from "../create-category-property-modal";
import EditCategoryPropertyModal from "../edit-category-property-modal";

type Props = { searchQuery: string };

export default function CategoryPropertyTab({ searchQuery }: Props) {
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const router = useRouter();
  const locale = useLocale();

  const debouncedSearch = useMemo(() => searchQuery.trim(), [searchQuery]);

  const { data, isLoading, error, refetch, isFetching } = useCategoriesProperty({
    search: debouncedSearch || undefined,
    pageIndex,
    pageSize,
    sortKey: "createdAt",
    sortOrder: "desc",
  });

  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategoryProperty();

  const items = data?.data ?? [];
  const total = data?.totalItems ?? 0;

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const allChecked = items.length > 0 && items.every((it: any) => selected.has(it.category_id));
  const someChecked = items.some((it: any) => selected.has(it.category_id)) && !allChecked;

  const toggleAll = (checked: boolean) => {
    if (!checked) return setSelected(new Set());
    setSelected(new Set(items.map((it: any) => it.category_id as number)));
  };
  const toggleOne = (id: number, checked: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  };

  const formatDate = (v: any) => {
    const d = v ? new Date(v) : undefined;
    if (!d || Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("vi-VN");
  };
  const getCreatedAt = (it: any) => it.createdAt ?? it.created_at ?? it.created_date ?? null;

  const openEdit = (item: any) => {
    setEditingItem(item);
    setEditOpen(true);
  };

  const openDeleteDialog = (id: number, name: string) => {
    setItemToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    await new Promise<void>((resolve) => {
      deleteCategory(itemToDelete.id, { onSettled: () => resolve() } as any);
    });
    setItemToDelete(null);
    refetch();
  };

  if (isLoading) return <div className="p-4">Đang tải danh mục…</div>;
  if (error) return <div className="p-4 text-red-600">Lỗi tải danh mục.</div>;

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            {isFetching ? "Đang đồng bộ…" : `Tổng: ${total} danh mục`}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" onClick={() => setCreateOpen(true)} className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" /> Tạo mới
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[44px]">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={allChecked}
                      onCheckedChange={(v) => toggleAll(Boolean(v))}
                      className={someChecked ? "data-[state=indeterminate]:opacity-100" : ""}
                    />
                  </div>
                </TableHead>
                <TableHead className="w-[240px]">Tên</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="w-[160px]">Ngày tạo</TableHead>
                <TableHead className="w-[44px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((it: any) => {
                const id = it.category_id as number;
                const checked = selected.has(id);
                const created = getCreatedAt(it);

                return (
                  <TableRow key={id}>
                    <TableCell>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => toggleOne(id, Boolean(v))}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{it.category_name}</TableCell>
                    <TableCell className="text-sm text-gray-600">{it.category_description || "—"}</TableCell>
                    <TableCell className="text-sm text-gray-700">{formatDate(created)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" sideOffset={6} className="w-40">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => openEdit(it)}>
                              <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              onClick={() => openDeleteDialog(id, it.category_name)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Xoá
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

            <TableCaption>Danh sách danh mục bất động sản</TableCaption>
          </Table>
        </div>
      </div>

      {/* Confirm delete */}
      <DialogConfirm
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xoá danh mục?"
        description={`Bạn chắc chắn muốn xoá “${itemToDelete?.name ?? ""}”? Hành động này không thể hoàn tác.`}
        confirmText={deleting ? "Đang xoá..." : "Xoá"}
        cancelText="Huỷ"
        confirmVariant="destructive"
        onConfirm={confirmDelete}
      />

      {/* Modals */}
      <CreateCategoryPropertyModal open={createOpen} onOpenChange={setCreateOpen} onSuccess={refetch} />
      <EditCategoryPropertyModal open={editOpen} onOpenChange={setEditOpen} editingItem={editingItem} onSuccess={refetch} />
    </>
  );
}
