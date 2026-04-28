"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { MapPin, Menu, X, ChevronRight, Info, Car, Route } from "lucide-react";
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
    <nav className="z-50 w-full text-white">
      {/* Top Sticky Bar */}
      <div className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#001C44] h-16 flex items-center px-4">
        <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
                {settings?.logo_url ? (
                    <img src={settings.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
                ) : (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-6 w-6 text-white" />
                        <span className="font-bold hidden sm:block">Hola Amigos</span>
                    </div>
                )}
            </Link>
            
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                <Link href="/" className="transition-colors hover:text-white/80 text-white/90">Home</Link>
                <CategoryDropdown categories={categories} />
                <Link href="/gallery" className="transition-colors hover:text-white/80 text-white/90">Gallery</Link>
                <Link href="/why-us" className="transition-colors hover:text-white/80 text-white/90">Why Us</Link>
                <Link href="/#our-services" className="transition-colors hover:text-white/80 text-white/90">Services</Link>
            </div>

            <div className="flex items-center gap-2">
                <ButtonLink href="/packages" className="hidden md:flex">
                    Search Packages
                </ButtonLink>
                {/* Mobile Burger Button */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
                >
                    {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                </button>
            </div>
        </div>
      </div>

      {/* Mobile Side/Full-screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="md:hidden fixed top-0 right-0 bottom-0 w-[80%] max-w-sm z-[70] bg-[#001C44] border-l border-white/10 shadow-2xl overflow-y-auto p-8"
            >
                <div className="flex items-center justify-between mb-12">
                    <span className="font-bold text-xl">Menu</span>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 bg-white/10 rounded-full"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-bold border-b border-white/5 pb-4">
                        Home
                    </Link>
                    <Link href="/packages" onClick={() => setIsOpen(false)} className="text-2xl font-bold border-b border-white/5 pb-4">
                        Tour Packages
                    </Link>
                    <Link href="/gallery" onClick={() => setIsOpen(false)} className="text-2xl font-bold border-b border-white/5 pb-4">
                        Gallery
                    </Link>
                    <Link href="/why-us" onClick={() => setIsOpen(false)} className="text-2xl font-bold border-b border-white/5 pb-4">
                        Why Us
                    </Link>

                    <div className="space-y-4 pt-4">
                        <p className="text-xs font-bold text-[#90CAF9] uppercase tracking-widest">Our Services</p>
                        <div className="grid grid-cols-1 gap-3">
                            <Link 
                                href="/transportation" 
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl"
                            >
                                <Car className="h-5 w-5 text-green-400" />
                                <span className="font-medium">Transport Service</span>
                            </Link>
                            <Link 
                                href="/#our-services" 
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl"
                            >
                                <Route className="h-5 w-5 text-blue-400" />
                                <span className="font-medium">Travel Packages</span>
                            </Link>
                        </div>
                    </div>

                    <div className="pt-8">
                        <a 
                            href={`https://wa.me/${settings?.whatsapp?.replace(/\D/g, '') || "60195852877"}`}
                            className="flex flex-col items-center gap-2 p-6 bg-[#25D366] rounded-3xl text-white shadow-lg shadow-green-500/20"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Contact via WhatsApp</span>
                            <span className="text-lg font-bold">+{settings?.whatsapp || "60195852877"}</span>
                        </a>
                    </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
