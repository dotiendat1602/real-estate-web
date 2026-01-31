"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useUpdatePost, usePostDetail } from "@/hooks/post/usePost";
import { useProperties } from "@/hooks/property/useProperty";
import { useToast } from "@/components/ui/toast";
import { Loader2, Plus, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { PropertyData } from "@/types/interfaces/api/property";
import { PostDataListItem } from "@/types/interfaces/api/post";
import { NativeSelect } from "@/components/ui/select";
import { PostStatus, PostType } from "@/types/enums/post";

const editPostSchema = z.object({
  propertyId: z.number().min(1, "Vui lòng chọn bất động sản"),
  postTitle: z.string().min(1, "Tiêu đề không được để trống"),
  postType: z.nativeEnum(PostType),
  postContent: z.string().optional(),
  postStatus: z.nativeEnum(PostStatus),
});

type EditPostFormValues = z.infer<typeof editPostSchema>;

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: PostDataListItem;
}

export function EditPostDialog({ open, onOpenChange, post }: EditPostDialogProps) {
  const updatePost = useUpdatePost();
  const toast = useToast();
  const router = useRouter();

  const { data: postDetail, isLoading: isLoadingPost } = usePostDetail(post.id);

  const { data: propertiesData, isLoading: isLoadingProperties } = useProperties({
    pageIndex: 1,
    pageSize: 100,
    status: "ACTIVE",
  });

  const properties = propertiesData?.data ?? [];
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);

  const isApprovedLocked = (postDetail?.postStatus as PostStatus | undefined) === PostStatus.APPROVED;

  const allowedStatusOptions = useMemo(() => {
    if (!isApprovedLocked) {
      return [
        { value: PostStatus.DRAFT, label: "Lưu nháp" },
        { value: PostStatus.PENDING, label: "Chờ duyệt" },
        { value: PostStatus.ARCHIVED, label: "Lưu trữ" },
      ];
    }
    return [
      { value: PostStatus.APPROVED, label: "Đã duyệt" },
      { value: PostStatus.ARCHIVED, label: "Lưu trữ" },
    ];
  }, [isApprovedLocked]);

  const form = useForm<EditPostFormValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      propertyId: 0,
      postTitle: "",
      postType: PostType.SALE,
      postContent: "",
      postStatus: PostStatus.DRAFT,
    },
  });

  useEffect(() => {
    if (postDetail && open) {
      form.reset({
        propertyId: postDetail.propertyId,
        postTitle: postDetail.postTitle,
        postType: postDetail.postType as PostType,
        postContent: postDetail.postContent || "",
        postStatus: postDetail.postStatus as PostStatus,
      });
    }
  }, [postDetail, open, form]);

  const watchPropertyId = form.watch("propertyId");

  useEffect(() => {
    if (watchPropertyId) {
      const property = properties.find((p) => p.id === watchPropertyId);
      setSelectedProperty(property || null);
    } else {
      setSelectedProperty(null);
    }
  }, [watchPropertyId, properties]);

  const onSubmit = async (data: EditPostFormValues) => {
    try {
      const submitData: EditPostFormValues = isApprovedLocked
        ? {
          propertyId: postDetail?.propertyId ?? post.property.id,
          postTitle: postDetail?.postTitle ?? post.postTitle,
          postType: (postDetail?.postType as PostType) ?? (post.postType as PostType),
          postContent: postDetail?.postContent ?? (post as any).postContent ?? "",
          postStatus: data.postStatus, // chỉ field này được phép thay đổi
        }
        : data;

      await updatePost.mutateAsync({ id: post.id, data: submitData });
      toast.success("Cập nhật bài đăng thành công!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật bài đăng thất bại!");
    }
  };

  const handleCreateProperty = () => {
    onOpenChange(false);
    router.push("/my-properties/create");
  };

  if (isLoadingPost) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[720px] bg-[#141414] border border-[#262626] text-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Chỉnh sửa bài đăng</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-white/40" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto bg-[#141414] border border-[#262626] text-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Chỉnh sửa bài đăng #{post.id}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Cập nhật thông tin bài đăng
          </DialogDescription>
        </DialogHeader>

        {isApprovedLocked && (
          <div className="flex items-start gap-3 rounded-2xl border border-[#262626] bg-[#0a0a0a] p-4 text-white/80">
            <Lock className="h-4 w-4 mt-0.5 text-white/60" />
            <div className="text-sm">
              <p className="font-semibold text-white">Bài đăng đã duyệt</p>
              <p className="text-white/60">
                Bạn không thể chỉnh sửa nội dung. Chỉ được giữ trạng thái <b>Đã duyệt</b> hoặc chuyển sang{" "}
                <b>Lưu trữ</b>.
              </p>
            </div>
          </div>
        )}

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
                          disabled={isLoadingProperties || isApprovedLocked}
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
                        disabled={isApprovedLocked}
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
            </div>

            {/* Property Info Display */}
            {selectedProperty && (
              <div className="border border-[#262626] rounded-2xl p-4 bg-[#0a0a0a]">
                <h3 className="text-sm font-bold text-white mb-3">Thông tin bất động sản</h3>
                <div className="flex gap-4">
                  <div className="w-32 h-24 rounded-xl overflow-hidden bg-white/5 border border-[#262626] shrink-0">
                    {selectedProperty.images?.[0] ? (
                      <Image
                        src={
                          selectedProperty.images.find((img) => img.isPrimary)?.imageUrl ||
                          selectedProperty.images[0].imageUrl
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
                    <p className="text-sm font-semibold text-white">{selectedProperty.title}</p>

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
                        disabled={isApprovedLocked}
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
                          onChange={(v) => field.onChange(v as PostType)}
                          disabled={isApprovedLocked}
                          placeholder="Chọn loại tin"
                          selectClassName="bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg"
                        >
                          <option value={PostType.SALE}>Bán</option>
                          <option value={PostType.RENT}>Cho thuê</option>
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
                          onChange={(v) => field.onChange(v as PostStatus)}
                          placeholder="Chọn trạng thái"
                          selectClassName="bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg"
                        >
                          {allowedStatusOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
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
                        disabled={isApprovedLocked}
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
                onClick={() => onOpenChange(false)}
                disabled={updatePost.isPending}
                className="border-[#262626] bg-transparent text-white hover:bg-white/5 rounded-lg"
              >
                Hủy
              </Button>

              <Button
                type="submit"
                disabled={updatePost.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                {updatePost.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
