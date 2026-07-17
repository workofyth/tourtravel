import { Metadata } from "next";
import { ShieldCheck, Clock, Users, MapPin, PhoneCall } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Why Us - Hola Amigos Tour & Travel",
  description: "Learn why Hola Amigos is the best choice for your Malaysia travel experience. Over 25 years of experience in the tourism industry.",
};

export default async function WhyUsPage() {
  const t = await getTranslations("whyUsPage");

  const features = t.raw("features") as { title: string; description: string }[];
  const featureIcons = [Clock, ShieldCheck, Users, MapPin];

  return (
    <div className="flex flex-col">
      <section className="relative py-24 bg-[#001C44] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/BANNER.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50 z-10" />

        <div className="container relative z-20 px-4 md:px-6 mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            {t("heroTitle")}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {t("heroDesc")}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-6">
              <h2 className="text-primary font-bold tracking-wider uppercase text-sm">{t("legacyLabel")}</h2>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                {t("legacyHeading")}
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t("legacyDesc")}
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t("legacyDesc2")}
              </p>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/transportation_2.jpeg"
                alt="Our Transport Fleet"
                fill
                className="object-cover brightness-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = featureIcons[idx] || MapPin;
              return (
                <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h4>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 overflow-hidden relative">
        <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              {t("ctaTitle")}
            </h3>
            <p className="text-lg text-slate-600">
              {t("ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/packages"
                className="px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:bg-primary/90"
              >
                {t("browsePackages")}
              </a>
              <a
                href="https://wa.me/60195852877"
                className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-full font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-5 h-5" />
                {t("talkToExpert")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
