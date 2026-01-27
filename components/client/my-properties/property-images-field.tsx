"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUploadFile } from "@/hooks/useUpload";
import { Loader2, Plus, Trash2, ImageIcon, CheckCircle2, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type PropertyImageItem = {
  id: string; // local id
  imageUrl: string;
  isPrimary?: boolean;
};

const gridCardCls = "bg-[#0a0a0a] border border-[#262626] rounded-2xl p-4";
const labelCls = "text-white/70 text-sm";
const helperCls = "text-white/50 text-sm";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function PropertyImagesField({
  label = "Hình ảnh",
  helper = "Tải lên ảnh bất động sản. Bạn có thể chọn ảnh chính và thay thế từng ảnh.",
  value,
  onChange,
  max = 12,
}: {
  label?: string;
  helper?: string;
  value: PropertyImageItem[];
  onChange: (next: PropertyImageItem[]) => void;
  max?: number;
}) {
  const upload = useUploadFile();

  const addInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

  const primaryId = useMemo(() => value.find((x) => x.isPrimary)?.id, [value]);

  // ensure always 1 primary when have images
  useEffect(() => {
    if (value.length === 0) return;
    if (primaryId) return;
    onChange(value.map((x, idx) => ({ ...x, isPrimary: idx === 0 })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.length, primaryId]);

  const triggerAdd = () => addInputRef.current?.click();

  const triggerReplace = (id: string) => {
    setReplaceTargetId(id);
    // reset input to allow re-upload same file
    if (replaceInputRef.current) replaceInputRef.current.value = "";
    replaceInputRef.current?.click();
  };

  const handleFilesUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const remain = Math.max(0, max - value.length);
    if (remain <= 0) return;

    const slice = Array.from(files).slice(0, remain);

    try {
      const results = await Promise.all(slice.map((f) => upload.mutateAsync(f)));

      const uploaded = results
        .filter((r) => r.kind === "image" && r.url)
        .map((r) => ({
          id: uid(),
          imageUrl: r.url,
          isPrimary: false,
        }));

      const next = [...value, ...uploaded];
      // if first time add -> set primary first
      if (value.length === 0 && next.length > 0) {
        next[0].isPrimary = true;
      }
      onChange(next);
    } catch (e: any) {
      // bạn đang dùng toast ở form cha, ở đây mình không gọi toast để component reusable
      console.error(e);
    }
  };

  const handleReplaceUpload = async (file: File | null) => {
    if (!file || !replaceTargetId) return;

    try {
      const r = await upload.mutateAsync(file);
      if (r.kind !== "image" || !r.url) return;

      onChange(
        value.map((x) =>
          x.id === replaceTargetId ? { ...x, imageUrl: r.url } : x
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setReplaceTargetId(null);
    }
  };

  const remove = (id: string) => {
    const removedWasPrimary = value.find((x) => x.id === id)?.isPrimary;
    const next = value.filter((x) => x.id !== id);

    if (next.length === 0) return onChange([]);

    if (removedWasPrimary) {
      next[0] = { ...next[0], isPrimary: true };
      next.slice(1).forEach((x) => (x.isPrimary = false));
    }
    onChange(next);
  };

  const setPrimary = (id: string) => {
    onChange(value.map((x) => ({ ...x, isPrimary: x.id === id })));
  };

  return (
    <section className="space-y-3">
      <div>
        <Label className={labelCls}>{label}</Label>
        <p className={helperCls}>{helper}</p>
      </div>

      <div className={gridCardCls}>
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-white/70">
            {value.length}/{max} ảnh
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={addInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                handleFilesUpload(e.target.files);
                e.currentTarget.value = "";
              }}
            />

            <input
              ref={replaceInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleReplaceUpload(e.target.files?.[0] ?? null)}
            />

            <Button
              type="button"
              onClick={triggerAdd}
              disabled={upload.isPending || value.length >= max}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              {upload.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Thêm ảnh
            </Button>
          </div>
        </div>

        {value.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#262626] bg-white/5 py-10">
            <ImageIcon className="h-10 w-10 text-white/40" />
            <div className="text-center">
              <div className="text-white/80 font-semibold">Chưa có ảnh</div>
              <div className="text-white/50 text-sm">
                Bấm “Thêm ảnh” để tải ảnh lên và xem preview.
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {value.map((img) => (
              <div
                key={img.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl border border-[#262626] bg-[#141414]"
                )}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={img.imageUrl}
                    alt="property"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Badge primary */}
                <div className="absolute left-2 top-2">
                  {img.isPrimary ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-purple-600/90 px-2 py-1 text-xs font-semibold text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Ảnh chính
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPrimary(img.id)}
                      className="rounded-md bg-black/50 px-2 py-1 text-xs text-white/90 hover:bg-black/70"
                    >
                      Đặt ảnh chính
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => triggerReplace(img.id)}
                    disabled={upload.isPending}
                    className="h-8 border-white/20 bg-black/30 text-white hover:bg-black/50"
                  >
                    <RefreshCcw className="mr-2 h-3.5 w-3.5" />
                    Đổi ảnh
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => remove(img.id)}
                    className="h-8 border-white/20 bg-black/30 text-white hover:bg-black/50"
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {value.length > 0 && (
          <p className="mt-3 text-xs text-white/45">
            Tip: Ảnh đầu tiên sẽ tự set làm “Ảnh chính” nếu chưa chọn.
          </p>
        )}
      </div>
    </section>
  );
}
