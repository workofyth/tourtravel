"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageWithCategory } from "@/types";
import { getImageUrl } from "@/lib/utils";

interface HeroSectionProps {
  packages?: PackageWithCategory[];
}

const defaultSlides = [
  {
    image: "/BANNER.jpg",
    title: "EXPLORE THE WORLD",
    subtitle: "YOUR JOURNEY STARTS HERE",
    link: "/packages"
  },
  {
    image: "/customized package.jpg",
    title: "LUXURY TRAVEL",
    subtitle: "EXPERIENCE THE WORLD IN STYLE",
    link: "/packages"
  }
];

export function HeroSection({ packages = [] }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Prepare slides from packages or use defaults
  const activeSlides = packages.length > 0 
    ? packages.slice(0, 5).map(pkg => {
        const imageUrl = pkg.cover_image 
          ? getImageUrl(pkg.cover_image, 'packages') 
          : (pkg.images && pkg.images.length > 0 ? getImageUrl(pkg.images[0].image_url, 'packages') : "/BANNER.jpg");
          
        return {
          image: imageUrl,
          title: pkg.title?.toUpperCase() || "UNTITLED PACKAGE",
          subtitle: pkg.category_name?.toUpperCase() || "TOUR PACKAGE",
          link: `/packages/${pkg.slug}`
        };
      })
    : defaultSlides;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      {/* Slider */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.15 }}
              transition={{ duration: 8, ease: "linear" }}
              className="absolute inset-0"
            >
              <Image
                src={activeSlides[currentSlide].image}
                alt={activeSlides[currentSlide].title}
                fill
                priority
                className="object-cover"
              />
            </motion.div>
            {/* Overlays */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl"
          >
            <h2 className="font-roboto-slab text-white text-xl md:text-3xl font-bold mb-4 tracking-wide uppercase drop-shadow-lg">
              {activeSlides[currentSlide].subtitle}
            </h2>
            <h1 className="font-roboto text-white text-4xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tighter drop-shadow-2xl">
              {activeSlides[currentSlide].title}
            </h1>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link href={activeSlides[currentSlide].link}>
                <Button 
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black text-lg font-bold px-10 py-7 rounded-none transition-all duration-300 uppercase tracking-widest min-w-[200px]"
                >
                  Learn More
                </Button>
              </Link>
              <Link href="https://wa.me/60195852877">
                <Button 
                  className="bg-white text-black hover:bg-gray-200 text-lg font-bold px-10 py-7 rounded-none transition-all duration-300 uppercase tracking-widest min-w-[200px]"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 transition-all duration-500 ${
                currentSlide === index ? "w-12 bg-white" : "w-6 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
