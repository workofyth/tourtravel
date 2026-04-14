"use client";

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
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/BANNER.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content */}
      <div className="container relative z-20 px-4 md:px-6 flex flex-col items-center text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Explore Malaysia – Truly Asia with Hola Amigos<br className="hidden md:block" />
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/90 mb-8 max-w-[600px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover you dream holiday in Malaysia
          with Hola Amigos as your trusted travel partner.
        </motion.p>

        <motion.div
          ref={suggestionsRef}
          className="w-full max-w-2xl bg-background rounded-[2rem] sm:rounded-full p-2 flex flex-col sm:flex-row gap-2 shadow-xl relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex-1 relative flex items-center px-4">
            <Search className="h-5 w-5 text-muted-foreground mr-3" />
            <Input
              type="text"
              placeholder="Where do you want to go?"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-0 text-base flex-1"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
            />

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl overflow-hidden z-50 py-2"
                >
                  {suggestions.map((title, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-6 py-3 hover:bg-primary/10 transition-colors flex items-center gap-3 text-sm md:text-base"
                      onClick={() => handleSelectSuggestion(title)}
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{title}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button size="lg" className="rounded-full px-8" onClick={() => handleSearch()}>Search</Button>
        </motion.div>
      </div>
    </section>
  );
}
