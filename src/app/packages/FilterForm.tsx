"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { Category } from "@/types";
export default function FilterForm({ 
  categories, 
  currentCategory, 
  currentMaxPrice,
  currentSearch
}: { 
  categories: Category[], 
  currentCategory?: string, 
  currentMaxPrice?: number,
  currentSearch?: string
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(currentCategory || "all");
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice?.toString() || "");
  const [search, setSearch] = useState(currentSearch || "");

  useEffect(() => {
    setCategory(currentCategory || "all");
    setMaxPrice(currentMaxPrice?.toString() || "");
    setSearch(currentSearch || "");
  }, [currentCategory, currentMaxPrice, currentSearch]);

  const handleFilter = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (maxPrice) {
      params.set("max_price", maxPrice);
    } else {
      params.delete("max_price");
    }

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    router.push(`/packages?${params.toString()}`);
  }, [category, maxPrice, search, router, searchParams]);

  return (
    <Card className="border border-slate-200 shadow-sm bg-slate-50/50 rounded-2xl overflow-hidden mb-8">
      <CardContent className="p-5 md:p-6">
        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6 items-end">
          {/* Keyword Search */}
          <div className="lg:col-span-4 space-y-1.5">
            <Label htmlFor="search" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">Keyword</Label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  id="search" 
                  type="text" 
                  placeholder="Where to go?" 
                  className="w-full pl-11 h-12 rounded-xl bg-white border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
  
            {/* Category Select */}
            <div className="lg:col-span-3 space-y-1.5">
              <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">Category</Label>
              <Select value={category} onValueChange={(val) => setCategory(val || "all")}>
                <SelectTrigger id="category" className="w-full h-12 rounded-xl bg-white border-slate-200 shadow-sm focus:ring-1 focus:ring-primary/20">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-xl overflow-hidden border-slate-200 shadow-xl p-2 bg-white">
                <SelectItem value="all" className="py-3 px-4 font-bold text-slate-700 focus:bg-slate-50">
                  ALL CATEGORIES
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug} className="py-3 px-4 transition-colors">
                    {cat.name.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
              </Select>
            </div>
  
            {/* Price Range */}
            <div className="lg:col-span-3 space-y-1.5">
              <Label htmlFor="maxPrice" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">Max Budget (RM)</Label>
              <Input 
                id="maxPrice" 
                type="number" 
                placeholder="e.g. 500" 
                className="w-full h-12 rounded-xl bg-white border-slate-200 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

          {/* Buttons */}
          <div className="lg:col-span-2 flex items-center gap-2 h-12">
            <Button type="submit" className="flex-1 h-full rounded-xl bg-[#001C44] hover:bg-[#002861] text-white font-bold shadow-lg shadow-blue-900/10 active:scale-95 transition-all">
              Search
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="px-4 h-full rounded-xl border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all shrink-0"
              onClick={() => {
                setCategory("all");
                setMaxPrice("");
                setSearch("");
                router.push("/packages");
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

  );
}

