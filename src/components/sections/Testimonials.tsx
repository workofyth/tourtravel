"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Testimonial } from "@/types";

interface Props {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: Props) {
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Memorable holiday experiences shared by our customers
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="h-full">
                <CardContent className="pt-8">
                  <div className="flex text-amber-500 mb-6 gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className={`h-5 w-5 ${idx < (col.rating || 5) ? 'fill-current' : 'text-muted'}`} />
                    ))}
                  </div>
                  <p className="italic text-lg text-muted-foreground mb-8">
                    "{col.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    {col.avatar_url ? (
                      <img src={col.avatar_url} alt={col.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                        {col.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{col.name}</p>
                      {col.role && <p className="text-sm text-muted-foreground">{col.role}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
