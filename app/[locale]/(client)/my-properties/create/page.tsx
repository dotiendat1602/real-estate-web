"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateProperty } from "@/hooks/property/useProperty";
import { useToast } from "@/components/ui/toast";
import { CreatePropertyRequest } from "@/types/interfaces/api/property";
import { useMe } from "@/hooks/users/useUser";
import { CreatePropertyForm } from "@/components/client/my-properties/create-property-form";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/utils/i18n";

export default function CreatePropertyPage() {
  const router = useRouter();
  const locale = useLocale();
  const createProperty = useCreateProperty();
  const toast = useToast();
  const { data: currentUser } = useMe();

  const handleSubmit = async (values: CreatePropertyRequest) => {
    try {
      if (!currentUser?.id) {
        toast.error("Không tìm thấy thông tin người dùng");
        return;
      }

      await createProperty.mutateAsync({
        ...values,
        ownerId: currentUser.id,
      });

      toast.success("Tạo bất động sản thành công!");
      router.push(withLocalePath("/my-properties", locale));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Tạo bất động sản thất bại!");
    }
  };

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
                Thêm bất động sản mới
              </h1>
              <p className="text-white/60">
                Điền thông tin để đăng tin bất động sản
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="bg-[#141414] border border-[#262626] rounded-2xl p-4 md:p-6">
          <CreatePropertyForm
            onSubmit={handleSubmit}
            isSubmitting={createProperty.isPending}
          />
        </section>
      </div>
    </main>
  );
}
