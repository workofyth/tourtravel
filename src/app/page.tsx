export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedPackages } from "@/components/sections/FeaturedPackages";
import { OurServices } from "@/components/sections/OurServices";
import { HighlightsSection } from "@/components/sections/HighlightsSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { getActiveTestimonials } from "@/lib/queries/testimonials";
import { getFeaturedPackages } from "@/lib/queries/packages";
import { getLocale } from "next-intl/server";

export default async function Home() {
  const locale = await getLocale();
  const testimonials = await getActiveTestimonials(locale);
  const featuredPackages = await getFeaturedPackages(locale);

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
