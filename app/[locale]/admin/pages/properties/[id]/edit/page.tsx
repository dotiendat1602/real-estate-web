import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import PropertyEditContent from "./property-edit-content";


export default async function PropertyEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id, locale } = await params;
  return (
    <ProtectedLayout>
      <PropertyEditContent id={id} locale={locale} />
    </ProtectedLayout>
  );
}