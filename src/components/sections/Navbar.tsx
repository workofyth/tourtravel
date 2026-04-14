import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/queries/settings";
import { getAllCategories } from "@/lib/queries/categories";
import { CategoryDropdown } from "./CategoryDropdown";

export async function Navbar() {
  const settings = await getSiteSettings();
  const categories = await getAllCategories();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#001C44] text-white">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
          ) : (
            <MapPin className="h-6 w-6 text-white" />
          )}
          {/* <span className="text-xl font-bold tracking-tight text-white">
            {settings?.site_name || "TourPlatform"}
          </span> */}
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-white/80 text-white/90">Home</Link>
            <CategoryDropdown categories={categories} />
            <Link href="/gallery" className="transition-colors hover:text-white/80 text-white/90">Gallery</Link>
            <Link href="/why-us" className="transition-colors hover:text-white/80 text-white/90">Why Us</Link>
            <Link href="/#our-services" className="transition-colors hover:text-white/80 text-white/90">Services</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <ButtonLink href="/packages">
              Search Packages
            </ButtonLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
