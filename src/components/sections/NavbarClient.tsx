"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { MapPin, Menu, X, ChevronRight } from "lucide-react";
import { CategoryDropdown } from "./CategoryDropdown";
import { Category } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarClientProps {
  settings: any;
  categories: Category[];
}

export function NavbarClient({ settings, categories }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#001C44] text-white">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
          ) : (
            <MapPin className="h-6 w-6 text-white" />
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-white/80 text-white/90">Home</Link>
            <CategoryDropdown categories={categories} />
            <Link href="/gallery" className="transition-colors hover:text-white/80 text-white/90">Gallery</Link>
            <Link href="/why-us" className="transition-colors hover:text-white/80 text-white/90">Why Us</Link>
            <Link href="/#our-services" className="transition-colors hover:text-white/80 text-white/90">Services</Link>
          </nav>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:block">
                <ButtonLink href="/packages">
                    Search Packages
                </ButtonLink>
            </div>
            
            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-[#001C44] overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <Link 
                href="/" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-3 border-b border-white/5 text-lg"
              >
                Home <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
              
              <div className="py-2 border-b border-white/5">
                <p className="text-xs font-bold text-[#90CAF9] uppercase tracking-widest mb-3">Packages</p>
                <div className="grid grid-cols-1 gap-2 pl-2">
                    <Link 
                        href="/packages" 
                        onClick={() => setIsOpen(false)}
                        className="py-2 text-white/80 hover:text-white"
                    >
                        All Packages
                    </Link>
                    {categories.map((category) => (
                        <Link 
                            key={category.id}
                            href={`/packages?category=${category.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="py-2 text-white/80 hover:text-white"
                        >
                            {category.name}
                        </Link>
                    ))}
                    <Link 
                        href="/transportation" 
                        onClick={() => setIsOpen(false)}
                        className="py-2 font-bold text-white"
                    >
                        Transportation
                    </Link>
                </div>
              </div>

              <Link 
                href="/gallery" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-3 border-b border-white/5 text-lg"
              >
                Gallery <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
              
              <Link 
                href="/why-us" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-3 border-b border-white/5 text-lg"
              >
                Why Us <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>

              <Link 
                href="/#our-services" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-3 border-b border-white/5 text-lg"
              >
                Services <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>

              <div className="mt-4 pt-4 border-t border-white/10">
                <ButtonLink href="/packages" className="w-full justify-center py-6 text-lg" onClick={() => setIsOpen(false)}>
                    Search Packages
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
