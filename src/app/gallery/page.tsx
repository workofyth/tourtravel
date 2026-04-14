import { getAllGalleryItems } from "@/lib/queries/gallery";
import { GalleryList } from "./GalleryList";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getAllGalleryItems();

  return (
    <div className="container px-4 md:px-6 py-12 mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Holiday Gallery
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Take a look at the beautiful moments from our customers' trips with Hola Amigos.
        </p>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No photos in the gallery yet.
        </div>
      ) : (
        <GalleryList images={images} />
      )}
    </div>
  );
}
