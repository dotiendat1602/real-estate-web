"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePropertyDetail, useUpdateProperty } from "@/hooks/property/useProperty";
import { useToast } from "@/components/ui/toast";
import { UpdatePropertyRequest } from "@/types/interfaces/api/property";
import { EditPropertyForm } from "@/components/client/my-properties/edit-property-form";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/utils/i18n";

export default function EditPropertyPage() {
  const router = useRouter();
  const locale = useLocale();
  const params = useParams();
  const propertyId = Number(params.id);
  const toast = useToast();

  const { data: property, isLoading, isError } = usePropertyDetail(propertyId);
  const updateProperty = useUpdateProperty();

  const handleSubmit = async (values: UpdatePropertyRequest) => {
    try {
      await updateProperty.mutateAsync({
        id: propertyId,
        data: values,
      });

      toast.success("Cập nhật bất động sản thành công!");
      router.push(withLocalePath("/my-properties", locale));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật bất động sản thất bại!");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-10">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-10 flex items-center justify-center gap-3 text-white/70">
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang tải dữ liệu...
          </div>
        </div>
      </main>
    );
  }

  if (isError || !property) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-10">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-10 text-center">
            <p className="text-red-400 font-medium">Không tìm thấy bất động sản</p>
            <Button
              onClick={() => router.push(withLocalePath("/my-properties", locale))}
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-lg px-6"
            >
              Quay lại
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-10 space-y-6">
        {/* Header */}
        <header className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="border-[#262626] text-white hover:bg-white/5 bg-transparent rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Chỉnh sửa bất động sản
              </h1>
              <p className="text-white/60">
                Cập nhật thông tin bất động sản #{propertyId}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="bg-[#141414] border border-[#262626] rounded-2xl p-4 md:p-6">
          <EditPropertyForm
            property={property}
            onSubmit={handleSubmit}
            isSubmitting={updateProperty.isPending}
          />
        </section>
      </div>
    </main>
  );
}
