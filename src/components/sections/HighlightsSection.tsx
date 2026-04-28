"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, UserCheck, Palmtree, Car } from "lucide-react";
import Image from "next/image";

const highlights = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-[#90CAF9]" />,
    title: "TRUSTED TRAVEL AGENCY IN MALAYSIA",
    description: "With more than 6 years of experience managing and offering travel packages to Kuala Lumpur, Malacca, and Selangor, Hola Amigos Travel is your most trusted travel agency for an unforgettable journey to Malaysia."
  },
  {
    icon: <Users className="h-10 w-10 text-[#90CAF9]" />,
    title: "ATTRACTIVE TRAVEL PACKAGES FOR EVERYONE",
    description: "Whether you are traveling solo or in groups (corporate, family, or friends), we are your preferred travel agency. We also welcome corporate and government agency clients."
  },
  {
    icon: <UserCheck className="h-10 w-10 text-[#90CAF9]" />,
    title: "EXPERIENCED AND FRIENDLY TOUR GUIDES",
    description: "Enjoy your trip to Malaysia with our experienced local tour guides. Let us guide you to Malaysia’s attractions, historical sites, food stalls, shopping destinations, and much more. Your satisfaction is our priority."
  },
  {
    icon: <Palmtree className="h-10 w-10 text-[#90CAF9]" />,
    title: "CAPTIVATING TRAVEL PACKAGES",
    description: "Choose from our exciting packages tailored to your preferences. From cities to islands to mountains, with plenty of activities to enjoy, we will bring you the very best of Malaysia."
  },
  {
    icon: <Car className="h-10 w-10 text-[#90CAF9]" />,
    title: "RELIABLE CAR RENTAL SERVICES",
    description: "Book your car through our car rental service. You may choose to drive yourself or use our experienced drivers as your travel assistants."
  }
];

export function HighlightsSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#001C44]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/BANNER.jpg"
          alt="Background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001C44]/90 via-[#001C44]/80 to-[#001C44]/90" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase font-roboto"
          >
            Why Travel With <span className="text-[#90CAF9]">Hola Amigos</span>?
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="h-1 w-24 bg-[#90CAF9] mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-x-16 lg:gap-y-20">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="mb-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-transform hover:scale-110 duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-[#90CAF9] tracking-tight font-roboto leading-tight">
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
