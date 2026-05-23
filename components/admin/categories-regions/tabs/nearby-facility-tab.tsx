"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  RefreshCw,
  MapPin,
  Crosshair,
} from "lucide-react";

import DialogConfirm from "@/components/DialogConfirm";
import { useDeleteUtility, useUtilities } from "@/hooks/categories-regions/useUtility";
import CreateUtilityModal from "../create-utility-modal";
import EditUtilityModal from "../edit-amenity-modal";
import Pagination from "@/components/ui/pagination";

type Props = { searchQuery: string };

export default function UtilityTab({ searchQuery }: Props) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const debouncedSearch = useMemo(() => searchQuery.trim(), [searchQuery]);

  const { data, isLoading, error, refetch, isFetching } = useUtilities({
    search: debouncedSearch || undefined,
    pageIndex,
    pageSize,
    sortKey: "createdAt",
    sortOrder: "desc",
  });

  const { mutateAsync: deleteUtility, isPending: deleting } = useDeleteUtility();

  const items = data?.data ?? [];
  const total = data?.totalItems ?? 0;
  const totalPages = data?.totalPages ?? 1;

  // Selection
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const allChecked = items.length > 0 && items.every((it: any) => selected.has(it.id));
  const someChecked = items.some((it: any) => selected.has(it.id)) && !allChecked;

  const toggleAll = (checked: boolean) => {
    if (!checked) return setSelected(new Set());
    setSelected(new Set(items.map((it: any) => it.id as number)));
  };
  const toggleOne = (id: number, checked: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  };

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
    await deleteUtility(itemToDelete.id);
    setItemToDelete(null);
    setDeleteDialogOpen(false);
    refetch();
  };

  if (isLoading) return <div className="p-4">Đang tải tiện ích lân cận…</div>;
  if (error) return <div className="p-4 text-red-600">Lỗi tải tiện ích lân cận.</div>;

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            {isFetching ? "Đang đồng bộ…" : `Tổng: ${total} tiện ích`}
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
          <Table className="min-w-[920px]">
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
                <TableHead className="w-[160px]">Danh mục</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead className="w-[200px]">Toạ độ (lat, lon)</TableHead>
                <TableHead className="w-[200px]">Tỉnh / Huyện / Xã</TableHead>
                <TableHead className="w-[44px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((it: any) => {
                const id = it.id as number;
                const checked = selected.has(id);

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
                    <TableCell className="font-medium text-gray-900">
                      {it.utilityName}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {it.utilityCategory}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 opacity-70" />
                        {it.location ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        <Crosshair className="h-3.5 w-3.5 opacity-70" />
                        {(it.lat && it.lon) ? `${it.lat}, ${it.lon}` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {[
                        it.provinceId ?? "—",
                        it.districtId ?? "—",
                        it.wardId ?? "—",
                      ].join(" / ")}
                    </TableCell>
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
                              onClick={() => openDeleteDialog(id, it.utilityName)}
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

            <TableCaption>Danh sách tiện ích lân cận</TableCaption>
          </Table>
        </div>

        <Pagination
          currentPage={pageIndex}
          totalPages={Math.max(1, totalPages)}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setPageIndex(1);
          }}
          itemLabel="tiện ích"
          isLoading={isFetching}
          className="mt-4"
        />
      </div>

      <DialogConfirm
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xoá tiện ích?"
        description={`Bạn chắc chắn muốn xoá “${itemToDelete?.name ?? ""}”? Hành động này không thể hoàn tác.`}
        confirmText={deleting ? "Đang xoá..." : "Xoá"}
        cancelText="Huỷ"
        confirmVariant="destructive"
        onConfirm={confirmDelete}
      />

      <CreateUtilityModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={refetch}
      />
      <EditUtilityModal
        open={editOpen}
        onOpenChange={setEditOpen}
        editingItem={editingItem}
        onSuccess={refetch}
      />
    </>
  );
}
