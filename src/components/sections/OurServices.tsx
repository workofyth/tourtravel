"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function OurServices() {
  const t = useTranslations("ourServices");
  const services = [
    { title: t("customizedTour"), image: "/customized package.jpg", desc: t("customizedTourDesc") },
    { title: t("privateTransport"), image: "/transportation_new.jpeg", desc: t("privateTransportDesc") },
    { title: t("hotelArrangements"), image: "/hotel arrangement.jpg", desc: t("hotelArrangementsDesc") },
    { title: t("multilingualGuide"), image: "/tour_guide.jpeg", desc: t("multilingualGuideDesc") },
  ];

  return (
    <section id="our-services" className="py-20 bg-muted/30 scroll-mt-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16 relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className={`transition-transform duration-500 group-hover:scale-110 ${
                      i === 3 ? "object-contain" : "object-cover"
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                </div>
                <CardContent className="pt-8 text-center flex flex-col items-center">
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
