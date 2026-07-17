"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function WhyUs() {
  const t = useTranslations("whyUs");
  const highlights = t.raw("highlights") as string[];

  return (
    <section id="why-us" className="py-20 bg-background scroll-mt-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-primary font-bold tracking-wider uppercase text-sm">{t("sectionTitle")}</h2>
              <h3 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                {t("heading")}
              </h3>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed">
              {t.rich("description", { years: 25, strong: (chunks) => <strong className="text-primary">{chunks}</strong> })}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="bg-primary/10 p-1 rounded-full group-hover:bg-primary/20 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />

            <p className="text-slate-600 leading-relaxed relative z-10">
              {t("sideDescription")}
            </p>
            <p className="text-slate-600 leading-relaxed relative z-10">
              {t("sideDescription2")}
            </p>

            <div className="pt-6">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm italic text-slate-500 text-sm">
                {t("quote")}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
