import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import DetailPropertyContent from "@/components/admin/properties/detail/detail-property-content";

export default async function DetailPropertyById({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id, locale } = await params;
  return (
    <ProtectedLayout>
      <DetailPropertyContent id={id} locale={locale} />
    </ProtectedLayout>
  );
}
