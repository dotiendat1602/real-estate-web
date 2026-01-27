"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreatePost } from "@/hooks/post/usePost";
import { useProperties } from "@/hooks/property/useProperty";
import { useToast } from "@/components/ui/toast";
import { Loader2, Plus, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { PropertyData } from "@/types/interfaces/api/property";
import { NativeSelect } from "@/components/ui/select";

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

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const createPost = useCreatePost();
  const toast = useToast();
  const router = useRouter();

  const { data: propertiesData, isLoading: isLoadingProperties } = useProperties({
    pageIndex: 1,
    pageSize: 100,
    status: "ACTIVE",
  });

  const properties = propertiesData?.data ?? [];
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);

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
    router.push("/my-properties/create");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto bg-[#141414] border border-[#262626] text-white rounded-2xl">
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
                    <FormLabel className="text-white/80">Chọn bất động sản *</FormLabel>
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
                        className="shrink-0 h-11 border-[#262626] bg-transparent text-white hover:bg-white/5 rounded-lg"
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
                <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/25 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-yellow-300 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-200">
                      Không có bất động sản nào?
                    </p>
                    <p className="text-sm text-yellow-200/80 mt-1">
                      Bạn cần tạo bất động sản trước khi đăng bài. Click nút
                      "Tạo BĐS mới" để bắt đầu.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Property Info Display */}
            {selectedProperty && (
              <div className="border border-[#262626] rounded-2xl p-4 bg-[#0a0a0a]">
                <h3 className="text-sm font-bold text-white mb-3">
                  Thông tin bất động sản
                </h3>
                <div className="flex gap-4">
                  <div className="w-32 h-24 rounded-xl overflow-hidden bg-white/5 border border-[#262626] shrink-0">
                    {selectedProperty.images?.[0] ? (
                      <Image
                        src={
                          selectedProperty.images.find((img) => img.isPrimary)
                            ?.imageUrl || selectedProperty.images[0].imageUrl
                        }
                        alt={selectedProperty.title}
                        width={128}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5" />
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
                    <FormLabel className="text-white/80">Tiêu đề bài đăng *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Cần bán gấp nhà phố 3 tầng giá tốt..."
                        {...field}
                        className="bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg placeholder:text-white/40"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="postType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Loại tin *</FormLabel>
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
                      <FormLabel className="text-white/80">Trạng thái *</FormLabel>
                      <FormControl>
                        <NativeSelect
                          value={field.value}
                          onChange={(v) =>
                            field.onChange(v as "DRAFT" | "PENDING" | "APPROVED")
                          }
                          placeholder="Chọn trạng thái"
                          selectClassName="bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg"
                        >
                          <option value="DRAFT">Lưu nháp</option>
                          <option value="PENDING">Gửi duyệt</option>
                          <option value="APPROVED">Đã duyệt</option>
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
                    <FormLabel className="text-white/80">Nội dung bài đăng</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết về bất động sản, lý do bán/cho thuê, thông tin liên hệ..."
                        rows={6}
                        {...field}
                        className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg placeholder:text-white/40"
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
                className="border-[#262626] bg-transparent text-white hover:bg-white/5 rounded-lg"
              >
                Hủy
              </Button>

              <Button
                type="submit"
                disabled={createPost.isPending || properties.length === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
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
