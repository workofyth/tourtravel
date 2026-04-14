"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryItem } from "@/lib/queries/gallery";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";

interface GalleryListProps {
  images: GalleryItem[];
}

export function GalleryList({ images }: GalleryListProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedImageIndex(null);
  };

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {images.map((item, index) => (
          <div 
            key={item.id} 
            className="break-inside-avoid relative group overflow-hidden rounded-2xl bg-muted transition-all hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
            onClick={() => handleImageClick(index)}
          >
            <Image
              src={`/uploads/gallery/${item.image_url}`}
              alt={item.title || "Gallery Image"}
              width={500}
              height={500}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {item.title && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-medium text-sm md:text-base">
                  {item.title}
                </p>
              </div>
            )}
            {/* Decorative overlay for premium feel */}
            <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
          </div>
        ))}
      </div>

      <GalleryLightbox
        images={images}
        initialIndex={selectedImageIndex ?? 0}
        isOpen={selectedImageIndex !== null}
        onClose={handleCloseLightbox}
      />
    </>
  );
}
