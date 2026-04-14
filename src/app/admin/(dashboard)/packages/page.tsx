export const dynamic = "force-dynamic";

import { pool } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DeletePackageButton from "@/app/admin/(dashboard)/packages/DeletePackageButton";

export default async function PackagesAdminPage() {
  const result = await pool.query(`
    SELECT p.*, d.name as category_name, d.category as category_type
    FROM packages p
    JOIN categories d ON p.category_id = d.id
    ORDER BY p.created_at DESC
  `);

  const packages = result.rows;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Tour Packages</h1>
          <p className="text-muted-foreground mt-1">List of all tour packages available in the system.</p>
        </div>
        <ButtonLink href="/admin/packages/create" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Package
        </ButtonLink>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package List ({packages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.length > 0 ? (
                  packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium max-w-[200px] truncate" title={pkg.title}>
                        {pkg.title}
                      </TableCell>
                      <TableCell className="capitalize">{pkg.category_name}</TableCell>
                      <TableCell>{pkg.duration_days} Days</TableCell>
                      <TableCell>
                        <div className="font-semibold text-xs text-primary">RM {Number(pkg.price)} (12+)</div>
                        {pkg.price_child > 0 && (
                          <div className="text-[10px] text-muted-foreground">RM {Number(pkg.price_child)} (4-11)</div>
                        )}
                        {pkg.price_infant > 0 && (
                          <div className="text-[10px] text-muted-foreground">RM {Number(pkg.price_infant)} (3-)</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {pkg.is_featured ? (
                          <Badge className="bg-primary">Featured</Badge>
                        ) : (
                          <Badge variant="outline">Regular</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <ButtonLink
                          href={`/admin/packages/edit/${pkg.id}`}
                          size="sm"
                          variant="ghost"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-sky-600" />
                        </ButtonLink>
                        <DeletePackageButton id={pkg.id} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 h-24">
                      No tour packages found. Please add a new package.
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
