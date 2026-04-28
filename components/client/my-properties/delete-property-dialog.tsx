// components/client/my-properties/delete-property-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProperty } from "@/hooks/property/useProperty";
import { useToast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";
import { PropertyData } from "@/types/interfaces/api/property";

interface DeletePropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: PropertyData;
}

export function DeletePropertyDialog({
  open,
  onOpenChange,
  property,
}: DeletePropertyDialogProps) {
  const deleteProperty = useDeleteProperty();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await deleteProperty.mutateAsync(property.id);
      toast.success("Xóa bất động sản thành công!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Xóa bất động sản thất bại!"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription className="text-gray-400">
            {"Bạn có chắc chắn muốn xóa bất động sản \"" + property.title + "\"? Hành động này không thể hoàn tác."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteProperty.isPending}
            className="border-zinc-700 text-white hover:bg-zinc-800"
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleteProperty.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleteProperty.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
