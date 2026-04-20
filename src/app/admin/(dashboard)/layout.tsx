import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Package, CalendarDays, LogOut, LayoutDashboard, LocateFixed, Settings, MessageSquareQuote, Image as ImageIcon, Car } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r bg-background flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/admin" className="flex items-center gap-2 text-primary font-bold">
            <LocateFixed className="h-5 w-5" />
            <span>Admin Tour</span>
          </Link>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-2 px-4">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
            <MapPin className="h-4 w-4" />
            Categories
          </Link>
          <Link href="/admin/packages" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
            <Package className="h-4 w-4" />
            Packages
          </Link>
          <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
            <CalendarDays className="h-4 w-4" />
            Bookings
          </Link>
          <Link href="/admin/gallery" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
            <ImageIcon className="h-4 w-4" />
            Gallery
          </Link>
          <Link href="/admin/testimonials" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
            <MessageSquareQuote className="h-4 w-4" />
            Testimonials
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t mt-auto">
          <form action="/api/logout" method="POST">
             <Button type="submit" variant="outline" className="w-full gap-2">
               <LogOut className="h-4 w-4" />
               Logout
             </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:pl-64">
        <header className="h-16 border-b bg-background flex items-center px-6 md:hidden">
          <Link href="/admin" className="font-bold text-lg text-primary">Admin Tour</Link>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
