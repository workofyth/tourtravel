"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, UserCheck, Palmtree, Car } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const icons = [
  <ShieldCheck key="shield" className="h-10 w-10 text-primary" />,
  <Users key="users" className="h-10 w-10 text-primary" />,
  <UserCheck key="usercheck" className="h-10 w-10 text-primary" />,
  <Palmtree key="palmtree" className="h-10 w-10 text-primary" />,
  <Car key="car" className="h-10 w-10 text-primary" />,
];

export function HighlightsSection() {
  const t = useTranslations("highlights");
  const items = t.raw("items") as { title: string; description: string }[];

  return (
    <section className="relative py-24 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://cxsjreqoui7u5viz.public.blob.vercel-storage.com/BG%20why%20travel%20with.jpg.jpeg"
          alt="Background"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase font-roboto"
          >
            {t("title")}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="h-1 w-24 bg-primary mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-x-16 lg:gap-y-20">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="mb-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-transform hover:scale-110 duration-300">
                {icons[index] || icons[0]}
              </div>
              <h3 className="text-xl font-black text-primary tracking-tight font-roboto leading-tight">
                {item.title}
              </h3>
              <p className="text-white/70 leading-relaxed text-sm md:text-base font-medium">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
