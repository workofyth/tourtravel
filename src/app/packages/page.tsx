export const dynamic = "force-dynamic";

import { getAllPackages } from "@/lib/queries/packages";
import { getAllCategories } from "@/lib/queries/categories";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import Image from "next/image";
import FilterForm from "./FilterForm";
import { getSiteSettings } from "@/lib/queries/settings";
import { getImageUrl } from "@/lib/utils";
import { getTranslations, getLocale } from "next-intl/server";

export default async function PackagesPage(props: { searchParams: Promise<{ category?: string; search?: string }> }) {
  const locale = await getLocale();
  const searchParams = await props.searchParams;
  const category = searchParams.category;
  const search = searchParams.search;

  const packages = await getAllPackages(category, search, locale);
  const categories = await getAllCategories(locale);
  const settings = await getSiteSettings(locale);
  const t = await getTranslations("packages");
  const pt = await getTranslations("featuredPackages");
  const whatsappNumber = settings?.whatsapp?.replace(/\D/g, '') || "60195852877";

  return (
    <div className="container px-4 md:px-6 py-12 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t("subtitle")}
        </p>
      </div>

      <div className="mb-10">
        <FilterForm
          categories={categories}
          currentCategory={category}
          currentSearch={search}
        />
      </div>

      <main className="w-full">
        {packages.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-lg border-2 border-dashed border-muted">
            <h3 className="text-2xl font-semibold mb-2 text-slate-800">{t("noPackages")}</h3>
            <p className="text-muted-foreground">
              {t("noPackagesDesc")}
            </p>
            <ButtonLink href="/packages" variant="outline" className="mt-8 px-8 py-6 rounded-xl border-primary text-primary hover:bg-primary/5">{t("resetFilters")}</ButtonLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden flex flex-col hover:shadow-2xl transition-all hover:-translate-y-1 border-slate-200 group">
                  <div className="relative h-[200px] w-full bg-muted">
                    <Image
                      src={getImageUrl(pkg.cover_image, 'packages')}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {pkg.is_featured && (
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                        {pt("popular")}
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{pkg.category_name}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold line-clamp-2 leading-tight">
                      <Link href={`/packages/${pkg.slug}`} className="hover:text-primary transition-colors">
                        {pkg.title.slice(0, 50)}
                      </Link>
                    </h3>
                    {pkg.itineraries && pkg.itineraries.length > 0 && (
                      <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        {pkg.itineraries.map((iti) => (
                          <div key={iti.id} className="flex flex-col items-center shrink-0 border border-primary/20 bg-primary/5 rounded px-1.5 py-0.5 min-w-[50px]">
                            <span className="text-[9px] font-bold text-primary">Day {iti.day_number}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 px-4 py-0">
                    <p className="text-sm text-muted-foreground line-clamp-[10] whitespace-pre-line text-left">
                      {(() => {
                        const t = pkg.description
                          .replace(/&nbsp;/g, " ")
                          .replace(/<\/p>|<\/div>|<\/li>|<\/h1>|<\/h2>|<br\s*\/?>/gi, "\n")
                          .replace(/<[^>]*>?/gm, " ")
                          .replace(/\n\s*\n/g, "\n")
                          .trim();
                        return t.length > 500 ? t.slice(0, 500) + "..." : t;
                      })()}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t border-muted p-4 mt-4">
                    <ButtonLink href={`/packages/${pkg.slug}`} size="sm" className="w-full">{pt("details")}</ButtonLink>
                  </CardFooter>
                </Card>
              ))}
            </div>
        )}
      </main>

      <div className="mt-20 p-8 md:p-12 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-primary/10" />
        <div className="relative z-10 max-w-4xl">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 border-none px-4 py-1 text-xs uppercase tracking-widest font-bold">
            {t("personalized")}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 text-slate-900">
            {t("customizeTitle")}
          </h2>

          <div className="space-y-6 text-slate-700">
            <p className="text-lg leading-relaxed">
              {t("customizeDesc")}
            </p>

            <div className="grid md:grid-cols-2 gap-8 py-4">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">{"\u2713"}</span>
                  {t("youCanChoose")}
                </h3>
                <ul className="space-y-3 pl-2">
                  {(t.raw("chooseItems") as string[]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">&bull;</span>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white">
                <p className="text-center italic text-slate-600 leading-relaxed font-medium">
                  {t("customizeQuote")}
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Hola Amigos team, I would like to customize my own tour package...")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#3f4b55] hover:bg-[#323d45] text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-slate-200"
              >
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full overflow-hidden shadow-sm">
                  <Image
                    src="/wa-logo.png"
                    alt="WhatsApp"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                {t("contactTeam")}
              </a>
              <p className="text-sm text-slate-500 font-medium">
                {t("availableDaily")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
