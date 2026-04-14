import { getAllTestimonials } from "@/lib/queries/testimonials";
import { Button, ButtonLink } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DeleteTestimonialButton from "./DeleteTestimonialButton";

export const metadata = {
  title: "Manage Testimonials | Admin",
};

export default async function TestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Testimonials</h1>
          <p className="text-muted-foreground mt-1">List of customer reviews.</p>
        </div>
        <ButtonLink href="/admin/testimonials/create" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </ButtonLink>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No testimonials yet. Click "Add Testimonial" to start.
                </TableCell>
              </TableRow>
            ) : (
              testimonials.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{d.role || "-"}</TableCell>
                  <TableCell className="truncate max-w-xs" title={d.content}>{d.content}</TableCell>
                  <TableCell>{d.rating} / 5</TableCell>
                  <TableCell>
                    {d.is_active ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-1">
                    <ButtonLink 
                      href={`/admin/testimonials/edit/${d.id}`}
                      variant="ghost" 
                      size="icon"
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </ButtonLink>
                    <DeleteTestimonialButton id={d.id} />
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
