"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const response = await fetch(`/api/packages/suggestions?q=${encodeURIComponent(searchQuery)}`);
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query?: string) => {
    const finalQuery = typeof query === 'string' ? query : searchQuery;
    if (finalQuery.trim()) {
      router.push(`/packages?search=${encodeURIComponent(finalQuery)}`);
      setShowSuggestions(false);
    } else {
      router.push("/packages");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelectSuggestion = (title: string) => {
    setSearchQuery(title);
    handleSearch(title);
  };

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] min-h-[600px] flex items-center justify-center z-30">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/BANNER.jpg"
          alt="Hola Amigos Banner"
          fill
          priority
          quality={100}
          className="object-cover object-[center_top]"
        />
        {/* Sophisticated Gradient Overlays */}
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10" />
      </div>

      {/* Content Overlay */}
      <div className="container relative z-20 px-4 md:px-6 flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="max-w-4xl"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-widest text-[#90CAF9] uppercase bg-blue-500/10 rounded-full backdrop-blur-md border border-blue-500/20">
            Truly Asia Experience
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
            Explore Malaysia <br className="hidden md:block" /> with <span className="text-[#90CAF9]">Hola Amigos</span>
          </h1>

          <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-medium drop-shadow-lg leading-relaxed">
            Discover your dream holiday in Malaysia with your most trusted travel partner.
          </p>

          <div className="w-full max-w-3xl mx-auto">
            <motion.div
              ref={suggestionsRef}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-full p-2 flex flex-col md:flex-row gap-2 shadow-2xl relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex-1 relative flex items-center px-6">
                <Search className="h-6 w-6 text-white/70 mr-4" />
                <Input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-0 text-lg text-white placeholder:text-white/60 flex-1"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                />

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-4 bg-[#001C44]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 py-3"
                    >
                      {suggestions.map((title, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-8 py-4 hover:bg-white/10 transition-colors flex items-center gap-4 text-white group"
                          onClick={() => handleSelectSuggestion(title)}
                        >
                          <Search className="h-5 w-5 text-white/50 group-hover:text-[#90CAF9] transition-colors" />
                          <span className="truncate font-medium">{title}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Button 
                size="lg" 
                className="rounded-xl md:rounded-full px-12 py-7 text-lg font-bold bg-[#001C44] hover:bg-[#002861] text-white border border-white/10 shadow-xl transition-all hover:scale-105 active:scale-95" 
                onClick={() => handleSearch()}
              >
                Search
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
