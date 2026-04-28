export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedPackages } from "@/components/sections/FeaturedPackages";
import { OurServices } from "@/components/sections/OurServices";
import { HighlightsSection } from "@/components/sections/HighlightsSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { getActiveTestimonials } from "@/lib/queries/testimonials";
import { getFeaturedPackages } from "@/lib/queries/packages";

export default async function Home() {
  const testimonials = await getActiveTestimonials();
  const featuredPackages = await getFeaturedPackages();

  return (
    <>
      <HeroSection packages={featuredPackages} />
      <FeaturedPackages />
      <HighlightsSection />
      <OurServices />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
