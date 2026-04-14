import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { Toaster } from '@/components/ui/sonner';
import { getSiteSettings } from '@/lib/queries/settings';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata() {
  const settings = await getSiteSettings();
  const siteName = settings?.site_name || "TourPlatform";
  return {
    title: `${siteName} - Liburan Impian Anda`,
    description: "Platform pemesanan paket tour terbaik di Indonesia",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />

        {/* Floating WA button */}
        {settings?.whatsapp && (
          <div className="fixed bottom-6 right-6 z-50">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent("Hi, I want to consult...")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#3f4b55] text-white px-5 py-3 rounded-xl shadow-2xl transition-all hover:scale-105 hover:bg-[#323d45] group divide-x divide-white/20"
            >
              <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center border-none rounded-full">
                <Image
                  src="/wa-logo.png"
                  alt="WhatsApp"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-tight pl-4 text-left">
                <span className="text-[12px] font-bold tracking-widest text-[#90CAF9] uppercase mb-1">Call our team now!</span>
                <span className="text-2xl font-black tracking-tight tabular-nums">+60 19-585 2877</span>
              </div>
            </a>
          </div>
        )}
      </body>
    </html>
  );
}
