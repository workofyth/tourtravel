import { getFeaturedPackages } from "@/lib/queries/packages";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export async function FeaturedPackages() {
  const packages = await getFeaturedPackages();

  if (!packages || packages.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Popular Packages
            </h2>
            <p className="text-lg text-muted-foreground">
              Our best selection of holiday packages most frequently booked
            </p>
          </div>
          <ButtonLink href="/packages" variant="outline">View All Packages</ButtonLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              <div className="relative h-[240px] w-full bg-muted">
                <Image
                  src={getImageUrl(pkg.cover_image, 'packages')}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  Popular
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center text-sm text-muted-foreground mb-2 gap-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{pkg.category_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{pkg.duration_days} Days</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold line-clamp-2 leading-tight">
                  <Link href={`/packages/${pkg.slug}`} className="hover:text-primary transition-colors">
                    {pkg.title}
                  </Link>
                </h3>
                {pkg.itineraries && pkg.itineraries.length > 0 && (
                  <div className="mt-4 mb-2 flex items-center overflow-x-auto pb-2 no-scrollbar relative">
                    {pkg.itineraries.map((iti, idx) => (
                      <div key={iti.id} className="flex flex-col items-center shrink-0 w-[70px] group">
                        <div className="relative flex items-center justify-center w-full">
                          {/* Line connecting the dots */}
                          {idx !== pkg.itineraries!.length - 1 && (
                            <div className="absolute left-[50%] top-1/2 -translate-y-1/2 w-full h-[2px] bg-primary/20 z-0" />
                          )}
                          {/* Dot Circle */}
                          <div className="w-6 h-6 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-[10px] font-bold text-primary z-10 bg-background transition-transform group-hover:scale-110">
                            {iti.day_number}
                          </div>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-medium mt-2 truncate w-full px-1 text-center">
                          {iti.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-[10] whitespace-pre-line text-left">
                  {pkg.description
                    .replace(/<\/p>|<\/div>|<\/li>|<\/h1>|<\/h2>|<br\s*\/?>/gi, "\n")
                    .replace(/<[^>]*>?/gm, " ")
                    .replace(/\n\s*\n/g, "\n")
                    .trim()}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-muted pt-6 mt-auto">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                  <div className="flex flex-col">
                    <p className="text-xl font-bold text-primary leading-none">
                      RM {Number(pkg.price)} <span className="text-xs font-normal text-muted-foreground">{pkg.price_child > 0 ? '(Adult)' : ''}</span>
                    </p>
                    {pkg.price_child > 0 && (pkg.category_type === 'daytrip' || pkg.category_type === 'staycation') && (
                      <p className="text-sm font-semibold text-muted-foreground mt-1">
                        RM {Number(pkg.price_child)} <span className="text-xs font-normal">(Child)</span>
                      </p>
                    )}
                  </div>
                </div>
                <ButtonLink href={`/packages/${pkg.slug}`}>Details</ButtonLink>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
