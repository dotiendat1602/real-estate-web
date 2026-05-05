import { Suspense } from "react";
import PostListingPage from "@/components/client/post-listing-page";

export default function SalePropertyPage() {
  return (
    <Suspense fallback={null}>
      <PostListingPage mode="SALE" />
    </Suspense>
  );
}
