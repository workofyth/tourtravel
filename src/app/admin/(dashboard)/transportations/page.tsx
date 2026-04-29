export const dynamic = "force-dynamic";

import { getAllTransportations } from "@/lib/queries/transportation";
import { ButtonLink } from "@/components/ui/button";
import { Plus, Edit, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DeleteTransportationButton from "./DeleteTransportationButton";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export default async function TransportationsPage() {
  const transportations = await getAllTransportations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Transportations</h1>
          <p className="text-muted-foreground mt-1">List of transportation services available for rent.</p>
        </div>
        <ButtonLink href="/admin/transportations/create" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Transportation
        </ButtonLink>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Vehicle Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price / Day</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transportations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No transportation services yet. Click "Add Transportation" to start.
                </TableCell>
              </TableRow>
            ) : (
              transportations.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                        <Image 
                            src={getImageUrl(t.image_url, 'transportations')}
                            alt={t.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {t.name}
                    <div className="text-xs font-mono text-muted-foreground">{t.slug}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs">
                           <Users className="h-3 w-3" /> {t.capacity_pax} Pax
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                           <Briefcase className="h-3 w-3" /> {t.capacity_luggage} Luggage
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    RM {Number(t.price_per_day).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.is_active ? "default" : "secondary"}>
                        {t.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-1">
                    <ButtonLink 
                      href={`/admin/transportations/edit/${t.id}`} 
                      variant="ghost" 
                      size="icon"
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </ButtonLink>
                    <DeleteTransportationButton id={t.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
