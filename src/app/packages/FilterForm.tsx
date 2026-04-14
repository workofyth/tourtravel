"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    <Card>
      <CardHeader>
        <CardTitle>Search Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFilter} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="search">Search Package</Label>
            <Input 
              id="search" 
              type="text" 
              placeholder="Package title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val || "all")}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPrice">Maximum Price (RM)</Label>
            <Input 
              id="maxPrice" 
              type="number" 
              placeholder="Example: 500" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full">Apply Filters</Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
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
