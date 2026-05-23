import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { cn } from "@/lib/utils";

interface DialogConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  confirmVariant?: "default" | "destructive" | "secondary" | "outline" | "ghost" | "link";
}

export default function DialogConfirm({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  confirmVariant = "destructive",
}: DialogConfirmProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800">
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>
          {description}
        </AlertDialogDescription>

        <div className="mt-4 flex justify-end gap-2">
          <AlertDialogCancel
            className="min-w-24 cursor-pointer"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            className={cn(
              "min-w-24 cursor-pointer",
              confirmVariant === "destructive"
                ? "bg-red-600 text-white hover:bg-red-700"
                : confirmVariant === "secondary"
                  ? "bg-gray-200 hover:bg-gray-300"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
            )}
            onClick={handleConfirm}
            disabled={submitting}
          >
            {confirmText}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
