import { getAllGalleryItems } from "@/lib/queries/gallery";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { DeleteGalleryButton } from "./DeleteGalleryButton";

export default async function AdminGalleryPage() {
  const galleryItems = await getAllGalleryItems();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery Management</h1>
          <p className="text-muted-foreground mt-1">Manage images displayed in the public gallery.</p>
        </div>
        <ButtonLink href="/admin/gallery/create" size="sm" className="gap-2">
          <ImagePlus className="h-4 w-4" />
          Add Image
        </ButtonLink>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Gallery Images ({galleryItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galleryItems.length > 0 ? (
                galleryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                        <Image
                          src={`/uploads/gallery/${item.image_url}`}
                          alt={item.title || "Gallery Item"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.title || <span className="text-muted-foreground italic">Untitled</span>}
                    </TableCell>
                    <TableCell>{item.sort_order}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DeleteGalleryButton id={item.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 h-24 text-muted-foreground">
                    No gallery images found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
