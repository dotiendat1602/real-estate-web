import { Suspense } from "react";
import PostListingPage from "@/components/client/post-listing-page";

export default function RentPropertyPage() {
  return (
    <Suspense fallback={null}>
      <PostListingPage mode="RENT" />
    </Suspense>
  );
}
