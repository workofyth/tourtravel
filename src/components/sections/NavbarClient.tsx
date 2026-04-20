"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { MapPin, Menu, X, ChevronRight, MoreHorizontal, MessageCircle, Info, Car, Route } from "lucide-react";
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
      {/* Desktop & Mobile Top Sticky Bar */}
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

            <div className="flex items-center">
                <ButtonLink href="/packages" className="hidden md:flex">
                    Search Packages
                </ButtonLink>
                {/* Mobile Info Button (Simplified) */}
                <button 
                    onClick={() => setIsOpen(true)}
                    className="md:hidden p-2 text-white/70 hover:text-white"
                >
                    <MoreHorizontal className="h-6 w-6" />
                </button>
            </div>
        </div>
      </div>


      {/* Mobile Bottom Navigation Bar (Floating) */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 pointer-events-none">
        <div className="bg-[#001C44]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl pointer-events-auto flex items-center justify-around h-20 px-4">
            <Link href="/" className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-full group-active:scale-95 transition-transform">
                    <MapPin className="h-6 w-6 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Home</span>
            </Link>
            
            <Link href="/packages" className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-full group-active:scale-95 transition-transform">
                    <Route className="h-6 w-6 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Tours</span>
            </Link>

            {/* Floating Center Action Button with Bubble */}
            <div className="relative -translate-y-8">
                {/* Chat Bubble with Continuous Floating Animation */}
                <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ 
                        opacity: 1, 
                        y: [0, -8, 0], // Floating motion
                        scale: 1 
                    }}
                    transition={{
                        y: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        },
                        opacity: { duration: 0.4 },
                        scale: { duration: 0.4 }
                    }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 w-max"
                >
                    <div className="bg-[#001C44] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 relative">
                        <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1.5 text-[#90CAF9]">Call Our Team Now</p>
                        <p className="text-sm font-bold tabular-nums">+{settings?.whatsapp?.replace(/\D/g, '') || "60195852877"}</p>
                        {/* Bubble Triangle */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#001C44]"></div>
                    </div>
                </motion.div>

                <Link 
                    href={`https://wa.me/${settings?.whatsapp?.replace(/\D/g, '') || "60195852877"}`}
                    className="flex flex-col items-center"
                >
                    <div className="bg-[#25D366] p-3 rounded-full shadow-lg shadow-green-500/30 active:scale-90 transition-transform flex items-center justify-center w-16 h-16 border-2 border-white/20">
                        <img 
                            src="/wa-logo.png" 
                            alt="WhatsApp" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                </Link>
            </div>

            <Link href="/gallery" className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-full group-active:scale-95 transition-transform">
                    <div className="h-6 w-6 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Gallery</span>
            </Link>

            <button 
                onClick={() => setIsOpen(true)}
                className="flex flex-col items-center gap-1 group"
            >
                <div className="p-2 rounded-full group-active:scale-95 transition-transform">
                    <MoreHorizontal className="h-6 w-6 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">More</span>
            </button>
        </div>
      </div>

      {/* Mobile "More" Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-[#001C44] rounded-t-[3rem] border-t border-white/10 shadow-2xl overflow-hidden p-8 pb-24"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold">Discover More</h3>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 bg-white/10 rounded-full"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Link 
                        href="/why-us" 
                        onClick={() => setIsOpen(false)}
                        className="p-6 bg-white/5 rounded-3xl flex flex-col gap-3 group"
                    >
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <Info className="h-6 w-6 text-blue-400" />
                        </div>
                        <span className="font-bold text-lg">Why Us</span>
                    </Link>

                    <Link 
                        href="/transportation" 
                        onClick={() => setIsOpen(false)}
                        className="p-6 bg-white/5 rounded-3xl flex flex-col gap-3 group"
                    >
                        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <Car className="h-6 w-6 text-green-400" />
                        </div>
                        <span className="font-bold text-lg">Transport</span>
                    </Link>

                    <div className="col-span-2 mt-4">
                        <p className="text-xs font-bold text-[#90CAF9] uppercase tracking-widest mb-4">Tour Categories</p>
                        <div className="grid grid-cols-1 gap-2">
                            {categories.map((cat) => (
                                <Link 
                                    key={cat.id}
                                    href={`/packages?category=${cat.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl"
                                >
                                    <span className="font-medium">{cat.name}</span>
                                    <ChevronRight className="h-4 w-4 opacity-50" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>


  );
}
