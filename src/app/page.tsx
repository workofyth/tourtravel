export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedPackages } from "@/components/sections/FeaturedPackages";
import { OurServices } from "@/components/sections/OurServices";
import { Testimonials } from "@/components/sections/Testimonials";
import { getActiveTestimonials } from "@/lib/queries/testimonials";

export default async function Home() {
  const testimonials = await getActiveTestimonials();

  return (
    <>
      <HeroSection />
      <FeaturedPackages />
      <OurServices />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
