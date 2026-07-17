import { getAllGalleryItems } from "@/lib/queries/gallery";
import { GalleryList } from "./GalleryList";
import { getTranslations, getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const locale = await getLocale();
  const images = await getAllGalleryItems(locale);
  const t = await getTranslations("gallery");

  return (
    <div className="container px-4 md:px-6 py-12 mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <GalleryList images={images} />
      )}
    </div>
  );
}
