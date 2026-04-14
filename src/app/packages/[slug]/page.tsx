export const dynamic = "force-dynamic";

import { getPackageBySlug, getAllPackages } from "@/lib/queries/packages";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import BookingForm from "@/app/packages/[slug]/BookingForm";
import PackageCarousel from "@/components/ui/PackageCarousel";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const pkg = await getPackageBySlug(params.slug);
  
  if (!pkg) return { title: 'Not Found' };
  
  return {
    title: `${pkg.title} | TourPlatform`,
    description: stripHtml(pkg.description).slice(0, 160),
    openGraph: {
      images: [`/uploads/packages/${pkg.cover_image}`],
    },
  };
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}

export default async function PackageDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const pkg = await getPackageBySlug(params.slug);

  if (!pkg) {
    notFound();
  }

  return (
    <div className="container px-4 md:px-6 py-12 mx-auto">
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div className="relative">
            <PackageCarousel images={pkg.images || []} title={pkg.title} />
            {pkg.is_featured && (
              <Badge className="absolute top-6 right-6 bg-primary text-primary-foreground text-sm py-1 px-3 z-10 shadow-xl">
                Popular Package
              </Badge>
            )}
          </div>

          <div>
            <div className="flex items-center gap-4 text-muted-foreground mb-4">
              <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="capitalize">{pkg.category_name}</span>
              </div>
              <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>{pkg.duration_days} Day Trip</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              {pkg.title}
            </h1>

            <div className="prose prose-slate dark:prose-invert max-w-none description-content text-left 
              [&_p]:mb-3 [&_p]:min-h-[1em] 
              [&_div]:mb-3 [&_div]:min-h-[1em]
              [&_ul]:mb-4 [&_ol]:mb-4">
              <h3 className="text-xl font-semibold mb-3">Trip Description</h3>
              <div 
                className="text-left w-full"
                dangerouslySetInnerHTML={{ __html: pkg.description }}
              />
            </div>

            {pkg.itineraries && pkg.itineraries.length > 0 && (
              <div className="space-y-6 pt-8 border-t">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary" />
                  Itinerary
                </h3>
                <div className="relative space-y-0 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted-foreground/20">
                  {pkg.itineraries.map((iti) => (
                    <div key={iti.id} className="relative flex gap-8 pb-8 last:pb-0 group">
                      {/* Circle dot with shadow */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 z-10 border-4 border-background shadow-sm group-hover:scale-110 transition-transform">
                        {iti.day_number}
                      </div>
                      
                      {/* Content Card */}
                      <div className="flex-1 bg-card p-6 rounded-2xl border border-muted/60 hover:border-primary/30 hover:shadow-md transition-all">
                        <h4 className="font-bold text-lg mb-2 text-foreground">
                          {iti.title}
                        </h4>
                        <div 
                          className="prose prose-slate prose-sm max-w-none dark:prose-invert itinerary-content text-left
                            [&_p]:mb-2 [&_p]:min-h-[1em] 
                            [&_div]:mb-2 [&_div]:min-h-[1em]"
                          dangerouslySetInnerHTML={{ __html: iti.description }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="sticky top-24">
            <BookingForm 
              packageId={pkg.id} 
              title={pkg.title} 
              price={pkg.price} 
              category_type={pkg.category_type} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
