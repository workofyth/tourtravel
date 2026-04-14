export const dynamic = "force-dynamic";

import { getAllCategories } from "@/lib/queries/categories";
import { ButtonLink } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DeleteCategoryButton from "./DeleteCategoriesButton";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Categories</h1>
          <p className="text-muted-foreground mt-1">List of travel categories available for tour packages.</p>
        </div>
        <ButtonLink href="/admin/categories/create" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </ButtonLink>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No categories yet. Click "Add Category" to start.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell className="capitalize">
                    <Badge variant="outline">{d.category}</Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{d.slug}</TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-1">
                    <ButtonLink 
                      href={`/admin/categories/edit/${d.id}`} 
                      variant="ghost" 
                      size="icon"
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </ButtonLink>
                    <DeleteCategoryButton id={d.id} />
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
