"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Plus } from "lucide-react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { PostStatus, PostType } from "@/types/enums/post";
import { PostDataListItem } from "@/types/interfaces/api/post";
import { PropertyData } from "@/types/interfaces/api/property";
import { formatPrice } from "@/lib/utils";
import { withLocalePath } from "@/lib/utils/i18n";
import { usePostDetail, useUpdatePost } from "@/hooks/post/usePost";
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

export function EditPostDialog({
  open,
  onOpenChange,
  post,
}: EditPostDialogProps) {
  const updatePost = useUpdatePost();
  const toast = useToast();
  const router = useRouter();
  const locale = useLocale();

  const { data: postDetail, isLoading: isLoadingPost } = usePostDetail(post.id);

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

  const isApprovedLocked =
    (postDetail?.postStatus as PostStatus | undefined) === PostStatus.APPROVED;

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
            postType:
              (postDetail?.postType as PostType) ?? (post.postType as PostType),
            postContent:
              postDetail?.postContent ?? (post as any).postContent ?? "",
            postStatus: data.postStatus, // chỉ field này được phép thay đổi
          }
        : data;

      await updatePost.mutateAsync({ id: post.id, data: submitData });
      toast.success("Cập nhật bài đăng thành công!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Cập nhật bài đăng thất bại!"
      );
    }
  };

  const handleCreateProperty = () => {
    onOpenChange(false);
    router.push(withLocalePath("/my-properties/create", locale));
  };

  if (isLoadingPost) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="rounded-2xl border border-zinc-200 bg-white text-zinc-950 sm:max-w-[720px] dark:border-[#262626] dark:bg-[#141414] dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-950 dark:text-white">
              Chỉnh sửa bài đăng
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400 dark:text-white/40" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white text-zinc-950 sm:max-w-[720px] dark:border-[#262626] dark:bg-[#141414] dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-zinc-950 dark:text-white">
            Chỉnh sửa bài đăng #{post.id}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-white/60">
            Cập nhật thông tin bài đăng
          </DialogDescription>
        </DialogHeader>

        {isApprovedLocked && (
          <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-700 dark:border-[#262626] dark:bg-[#0a0a0a] dark:text-white/80">
            <Lock className="mt-0.5 h-4 w-4 text-zinc-500 dark:text-white/60" />
            <div className="text-sm">
              <p className="font-semibold text-zinc-950 dark:text-white">Bài đăng đã duyệt</p>
              <p className="text-zinc-600 dark:text-white/60">
                Bạn không thể chỉnh sửa nội dung. Chỉ được giữ trạng thái{" "}
                <b>Đã duyệt</b> hoặc chuyển sang <b>Lưu trữ</b>.
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
                    <FormLabel className="text-zinc-700 dark:text-white/80">
                      Chọn bất động sản *
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <NativeSelect
                          value={field.value ? String(field.value) : ""}
                          onChange={(v) => field.onChange(Number(v))}
                          disabled={isLoadingProperties || isApprovedLocked}
                          placeholder="-- Chọn bất động sản --"
                          className="flex-1"
                          selectClassName="h-11 rounded-lg border-zinc-200 bg-white text-zinc-950 dark:border-[#262626] dark:bg-[#0a0a0a] dark:text-white"
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
                        className="h-11 shrink-0 rounded-lg border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-[#262626] dark:bg-transparent dark:text-white dark:hover:bg-white/5"
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
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-[#262626] dark:bg-[#0a0a0a]">
                <h3 className="mb-3 text-sm font-bold text-zinc-950 dark:text-white">
                  Thông tin bất động sản
                </h3>
                <div className="flex gap-4">
                  <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-[#262626] dark:bg-white/5">
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
                      <div className="h-full w-full bg-zinc-100 dark:bg-white/5" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                      {selectedProperty.title}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-white/60">
                      <div>
                        <span className="text-zinc-500 dark:text-white/40">Giá:</span>{" "}
                        <span className="font-semibold text-purple-700 dark:text-purple-300">
                          {formatPrice(selectedProperty.price)}
                        </span>
                      </div>

                      <div>
                        <span className="text-zinc-500 dark:text-white/40">Diện tích:</span>{" "}
                        <span className="font-semibold text-zinc-800 dark:text-white/80">
                          {selectedProperty.area || "-"} m²
                        </span>
                      </div>

                      <div>
                        <span className="text-zinc-500 dark:text-white/40">Phòng ngủ:</span>{" "}
                        <span className="font-semibold text-zinc-800 dark:text-white/80">
                          {selectedProperty.bedroomNumber || "-"}
                        </span>
                      </div>

                      <div>
                        <span className="text-zinc-500 dark:text-white/40">Phòng tắm:</span>{" "}
                        <span className="font-semibold text-zinc-800 dark:text-white/80">
                          {selectedProperty.toiletNumber || "-"}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-zinc-500 dark:text-white/40">Địa chỉ:</span>{" "}
                        <span className="font-semibold text-zinc-800 dark:text-white/80">
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
                    <FormLabel className="text-zinc-700 dark:text-white/80">
                      Tiêu đề bài đăng *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Cần bán gấp nhà phố 3 tầng giá tốt..."
                        {...field}
                        disabled={isApprovedLocked}
                        className="h-11 rounded-lg border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-400 dark:border-[#262626] dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-white/40"
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
                      <FormLabel className="text-zinc-700 dark:text-white/80">
                        Loại tin *
                      </FormLabel>
                      <FormControl>
                        <NativeSelect
                          value={field.value}
                          onChange={(v) => field.onChange(v as PostType)}
                          disabled={isApprovedLocked}
                          placeholder="Chọn loại tin"
                          selectClassName="h-11 rounded-lg border-zinc-200 bg-white text-zinc-950 dark:border-[#262626] dark:bg-[#0a0a0a] dark:text-white"
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
                      <FormLabel className="text-zinc-700 dark:text-white/80">
                        Trạng thái *
                      </FormLabel>
                      <FormControl>
                        <NativeSelect
                          value={field.value}
                          onChange={(v) => field.onChange(v as PostStatus)}
                          placeholder="Chọn trạng thái"
                          selectClassName="h-11 rounded-lg border-zinc-200 bg-white text-zinc-950 dark:border-[#262626] dark:bg-[#0a0a0a] dark:text-white"
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
                    <FormLabel className="text-zinc-700 dark:text-white/80">
                      Nội dung bài đăng
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        placeholder="Mô tả chi tiết về bất động sản, lý do bán/cho thuê, thông tin liên hệ..."
                        id="postContent"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        disabled={isApprovedLocked}
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
                className="rounded-lg border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-[#262626] dark:bg-transparent dark:text-white dark:hover:bg-white/5"
              >
                Hủy
              </Button>

              <Button
                type="submit"
                disabled={updatePost.isPending}
                className="rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                {updatePost.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
