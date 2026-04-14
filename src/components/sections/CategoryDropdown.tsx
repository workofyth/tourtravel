"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Category } from "@/types";

interface CategoryDropdownProps {
  categories: Category[];
}

export function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link 
        href="/packages" 
        className="flex items-center gap-1 transition-colors hover:text-white/80 py-4 text-white/90"
      >
        Packages
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-[calc(100%-10px)] min-w-[200px] rounded-lg border border-white/10 bg-[#001C44] p-2 shadow-lg z-50"
          >
            <div className="grid gap-1">
              <Link
                href="/packages"
                className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10 text-white font-semibold border-b border-white/10 mb-1"
              >
                All Packages
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/packages?category=${category.slug}`}
                  className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10 text-white/90 hover:text-white"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
