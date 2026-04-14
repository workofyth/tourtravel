"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GalleryItem } from "@/lib/queries/gallery";

interface GalleryLightboxProps {
  images: GalleryItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function GalleryLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") onClose();
    },
    [handleNext, handlePrev, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const currentItem = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10 select-none"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Navigation Buttons */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-10 z-[110]">
          <button
            onClick={handlePrev}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={handleNext}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>

        {/* Main Image Container */}
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full h-full max-h-[80vh]"
          >
            <Image
              src={`/uploads/gallery/${currentItem.image_url}`}
              alt={currentItem.title || "Gallery photo"}
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Title and Badge */}
          <div className="mt-8 text-center max-w-lg">
            {currentItem.title && (
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                {currentItem.title}
              </h2>
            )}
            <p className="text-white/50 text-sm">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
