"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Plus } from "lucide-react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { PropertyData } from "@/types/interfaces/api/property";
import { formatPrice } from "@/lib/utils";
import { withLocalePath } from "@/lib/utils/i18n";
import { useCreatePost } from "@/hooks/post/usePost";
import { useProperties } from "@/hooks/property/useProperty";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useToast } from "@/components/ui/toast";

const createPostSchema = z.object({
  propertyId: z.number().min(1, "Vui lòng chọn bất động sản"),
  postTitle: z.string().min(1, "Tiêu đề không được để trống"),
  postType: z.enum(["SALE", "RENT"]),
  postContent: z.string().optional(),
  postStatus: z.enum(["DRAFT", "PENDING", "APPROVED"]),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostDialog({
  open,
  onOpenChange,
}: CreatePostDialogProps) {
  const createPost = useCreatePost();
  const toast = useToast();
  const router = useRouter();
  const locale = useLocale();

  const { data: propertiesData, isLoading: isLoadingProperties } =
    useProperties({
      pageIndex: 1,
      pageSize: 100,
      status: "ACTIVE",
    });

  const properties = useMemo(
    () => propertiesData?.data ?? [],
    [propertiesData?.data]
  );
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(
    null
  );

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      propertyId: 0,
      postTitle: "",
      postType: "SALE",
      postContent: "",
      postStatus: "DRAFT",
    },
  });

  const watchPropertyId = form.watch("propertyId");

  useEffect(() => {
    if (watchPropertyId) {
      const property = properties.find((p) => p.id === watchPropertyId);
      setSelectedProperty(property || null);
    } else {
      setSelectedProperty(null);
    }
  }, [watchPropertyId, properties]);

  const onSubmit = async (data: CreatePostFormValues) => {
    try {
      await createPost.mutateAsync(data);
      toast.success("Tạo bài đăng thành công!");
      form.reset();
      setSelectedProperty(null);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Tạo bài đăng thất bại!");
    }
  };

  const handleCreateProperty = () => {
    onOpenChange(false);
    router.push(withLocalePath("/my-properties/create", locale));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-[#262626] bg-[#141414] text-white sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Tạo bài đăng mới
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Chọn bất động sản và điền thông tin bài đăng
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Property Selection */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">
                      Chọn bất động sản *
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <NativeSelect
                          value={field.value ? String(field.value) : ""}
                          onChange={(v) => field.onChange(Number(v))}
                          disabled={isLoadingProperties}
                          placeholder="-- Chọn bất động sản --"
                          className="flex-1"
                          selectClassName="bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg"
                        >
                          <option value="" disabled>
                            -- Chọn bất động sản --
                          </option>

                          {properties.length === 0 ? (
                            <option value="" disabled>
                              Bạn chưa có bất động sản nào
                            </option>
                          ) : (
                            properties.map((p) => (
                              <option key={p.id} value={String(p.id)}>
                                {p.title}
                              </option>
                            ))
                          )}
                        </NativeSelect>
                      </FormControl>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCreateProperty}
                        className="h-11 shrink-0 rounded-lg border-[#262626] bg-transparent text-white hover:bg-white/5"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo BĐS mới
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isLoadingProperties && properties.length === 0 && (
                <div className="flex items-start gap-3 rounded-xl border border-yellow-500/25 bg-yellow-500/10 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-300" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-200">
                      Không có bất động sản nào?
                    </p>
                    <p className="mt-1 text-sm text-yellow-200/80">
                      {
                        'Bạn cần tạo bất động sản trước khi đăng bài. Click nút "Tạo BĐS mới" để bắt đầu.'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Property Info Display */}
            {selectedProperty && (
              <div className="rounded-2xl border border-[#262626] bg-[#0a0a0a] p-4">
                <h3 className="mb-3 text-sm font-bold text-white">
                  Thông tin bất động sản
                </h3>
                <div className="flex gap-4">
                  <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-[#262626] bg-white/5">
                    {selectedProperty.images?.[0] ? (
                      <Image
                        src={
                          selectedProperty.images.find((img) => img.isPrimary)
                            ?.imageUrl || selectedProperty.images[0].imageUrl
                        }
                        alt={selectedProperty.title}
                        width={128}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-white/5" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-semibold text-white">
                      {selectedProperty.title}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                      <div>
                        <span className="text-white/40">Giá:</span>{" "}
                        <span className="font-semibold text-purple-300">
                          {formatPrice(selectedProperty.price)}
                        </span>
                      </div>

                      <div>
                        <span className="text-white/40">Diện tích:</span>{" "}
                        <span className="font-semibold text-white/80">
                          {selectedProperty.area || "-"} m²
                        </span>
                      </div>

                      <div>
                        <span className="text-white/40">Phòng ngủ:</span>{" "}
                        <span className="font-semibold text-white/80">
                          {selectedProperty.bedroomNumber || "-"}
                        </span>
                      </div>

                      <div>
                        <span className="text-white/40">Phòng tắm:</span>{" "}
                        <span className="font-semibold text-white/80">
                          {selectedProperty.toiletNumber || "-"}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-white/40">Địa chỉ:</span>{" "}
                        <span className="font-semibold text-white/80">
                          {selectedProperty.location ||
                            `${selectedProperty.ward?.name}, ${selectedProperty.district?.name}, ${selectedProperty.province?.name}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Post Info */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="postTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">
                      Tiêu đề bài đăng *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Cần bán gấp nhà phố 3 tầng giá tốt..."
                        {...field}
                        className="h-11 rounded-lg border-[#262626] bg-[#0a0a0a] text-white placeholder:text-white/40"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="postType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">
                        Loại tin *
                      </FormLabel>
                      <FormControl>
                        <NativeSelect
                          value={field.value}
                          onChange={(v) => field.onChange(v as "SALE" | "RENT")}
                          placeholder="Chọn loại tin"
                          selectClassName="bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg"
                        >
                          <option value="SALE">Bán</option>
                          <option value="RENT">Cho thuê</option>
                        </NativeSelect>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">
                        Trạng thái *
                      </FormLabel>
                      <FormControl>
                        <NativeSelect
                          value={field.value}
                          onChange={(v) =>
                            field.onChange(v as "DRAFT" | "PENDING")
                          }
                          placeholder="Chọn trạng thái"
                          selectClassName="bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg"
                        >
                          <option value="DRAFT">Lưu nháp</option>
                          <option value="PENDING">Gửi duyệt</option>
                        </NativeSelect>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="postContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">
                      Nội dung bài đăng
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        placeholder="Mô tả chi tiết về bất động sản, lý do bán/cho thuê, thông tin liên hệ..."
                        id="postContent"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSelectedProperty(null);
                  onOpenChange(false);
                }}
                disabled={createPost.isPending}
                className="rounded-lg border-[#262626] bg-transparent text-white hover:bg-white/5"
              >
                Hủy
              </Button>

              <Button
                type="submit"
                disabled={createPost.isPending || properties.length === 0}
                className="rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                {createPost.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tạo bài đăng
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
