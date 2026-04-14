export const dynamic = "force-dynamic";

import { pool } from "@/lib/db";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

import { DeleteBookingButton } from "./DeleteBookingButton";

export default async function BookingsPage() {
  const result = await pool.query(`
    SELECT b.*, p.title as package_title
    FROM bookings b
    JOIN packages p ON b.package_id = p.id
    ORDER BY b.created_at DESC
  `);

  const bookings = result.rows;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Booking List</h1>
        <p className="text-muted-foreground mt-1">Check tour package bookings from customers.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking History ({bookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Package & Departure</TableHead>
                  <TableHead>Pax</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(b.created_at), "dd MMM yyyy", { locale: enUS })}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{b.name}</div>
                        <div className="text-xs text-muted-foreground">{b.email}</div>
                        <div className="text-xs text-muted-foreground">{b.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-primary line-clamp-1 max-w-[200px]" title={b.package_title}>
                          {b.package_title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(b.travel_date), "dd MMM yyyy", { locale: enUS })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div><strong>{b.pax}</strong> (12 years++)</div>
                          {b.pax_child > 0 && <div><strong>{b.pax_child}</strong> (4-11 years)</div>}
                          {b.pax_infant > 0 && <div><strong>{b.pax_infant}</strong> (3 years--)</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <ButtonLink
                            href={`https://wa.me/${b.phone.replace(/^0/, "60")}?text=Hi ${b.name}, confirming your booking for the ${b.package_title} package...`}
                            target="_blank"
                            size="sm"
                            variant="outline"
                          >
                            Contact (WA)
                          </ButtonLink>
                          <DeleteBookingButton id={b.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 h-24">
                      No bookings yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
