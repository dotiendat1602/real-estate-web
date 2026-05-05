import AreaMap from "@/components/client/home/area-map";
import FAQ from "@/components/client/home/faq";
import FeaturedNews from "@/components/client/home/featured-news";
import FeaturedProperties from "@/components/client/home/featured-property";
import Hero from "@/components/client/home/hero";
import PopularCategories from "@/components/client/home/popular-categories";
import Stats from "@/components/client/home/stats";

export default function ClientHomePage() {
  return (
    <>
      <Hero />

      <Stats />

      <PopularCategories />

      <FeaturedProperties />

      <FeaturedNews />

      <AreaMap />

      <FAQ />
    </>
  );
}
