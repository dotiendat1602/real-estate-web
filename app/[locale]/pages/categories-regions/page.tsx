import HeaderCategoryGeometry from "@/components/categories-regions/header-category-geometry";
import TabsComponent from "@/components/categories-regions/tab-component";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

export default function CategoryAndRegionPage() {
  return (
    <ProtectedLayout>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <HeaderCategoryGeometry />

        {/* Main Content */}
        <main className="p-8">
          <TabsComponent />
        </main>
      </div>
    </ProtectedLayout>
  );
}