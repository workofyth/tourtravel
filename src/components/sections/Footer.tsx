import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/queries/settings";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-[#001C44] text-white">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <MapPin className="h-6 w-6 text-white" />
              )}
            </h3>
            <p className="text-white/70 text-sm">
              {settings?.address || "Providing unforgettable holiday experiences with premium service and affordable prices."}
            </p>
            {(settings?.email || settings?.phone) && (
              <div className="text-sm text-white/70 space-y-1">
                {settings.email && <p>Email: {settings.email}</p>}
                {settings.phone && <p>Phone: {settings.phone}</p>}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/packages" className="hover:text-white transition-colors">Tour Packages</Link></li>
              <li><Link href="/why-us" className="hover:text-white transition-colors">Why Us</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Popular Categories</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/packages?category=daytrip" className="hover:text-white transition-colors">Daytrip</Link></li>
              <li><Link href="/packages?category=staycation" className="hover:text-white transition-colors">Staycation</Link></li>
              <li><Link href="/packages?category=transportation" className="hover:text-white transition-colors">Transportation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {settings?.facebook_url ? (
                <Link href={settings.facebook_url} target="_blank" className="text-white/70 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></Link>
              ) : (
                <span className="text-white/30"><Facebook className="h-5 w-5" /></span>
              )}
              {settings?.instagram_url ? (
                <Link href={settings.instagram_url} target="_blank" className="text-white/70 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></Link>
              ) : (
                <span className="text-white/30"><Instagram className="h-5 w-5" /></span>
              )}
              {settings?.twitter_url ? (
                <Link href={settings.twitter_url} target="_blank" className="text-white/70 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></Link>
              ) : (
                <span className="text-white/30"><Twitter className="h-5 w-5" /></span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/50">
          © {new Date().getFullYear()} {settings?.site_name || "TourPlatform"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
