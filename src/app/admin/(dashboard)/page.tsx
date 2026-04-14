export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CalendarDays, MessageSquareQuote, Settings } from "lucide-react";
import Link from "next/link";
import { pool } from "@/lib/db";

export default async function AdminDashboard() {
  const pkgRes = await pool.query('SELECT COUNT(*) FROM packages');
  const bkRes = await pool.query('SELECT COUNT(*) FROM bookings');
  const tsRes = await pool.query('SELECT COUNT(*) FROM testimonials WHERE is_active = true');
  const pkgCount = pkgRes.rows[0].count;
  const bkCount = bkRes.rows[0].count;
  const tsCount = tsRes.rows[0].count;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tour Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pkgCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Active packages in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bkCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Recorded bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Testimonials</CardTitle>
            <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Customer reviews on Home Page</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/packages" className="block">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Manage Tour Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Add new packages, edit descriptions, and update prices for more attractive journeys.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/bookings" className="block">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Booking List</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Manage customer orders, verify status, and contact customers via WhatsApp.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/testimonials" className="block">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Manage Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                View customer reviews, enable or disable reviews, and add new testimonials.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/settings" className="block">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Update logo, WhatsApp number, social media addresses, and site contact information.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
