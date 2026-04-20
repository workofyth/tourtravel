import Image from "next/image";
import { Users, Car, Bus, Info, CheckCircle2, MessageCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/queries/settings";

export const metadata = {
  title: "Transportation Services - Liburan Impian Anda",
  description: "Comfortable and reliable transportation for your travel needs in Malaysia.",
};

const pricingData = [
  { pax: "3 – 4 Pax", rm: "900", eur: "225", usd: "260" },
  { pax: "5 – 6 Pax", rm: "800", eur: "200", usd: "230" },
  { pax: "7 – 8 Pax", rm: "750", eur: "190", usd: "220" },
  { pax: "9 – 11 Pax", rm: "680", eur: "180", usd: "200" },
];

const fleet = [
  { name: "Mini Van", capacity: "4-6 Pax", icon: Car },
  { name: "Medium Van", capacity: "7-10 Pax", icon: Car },
  { name: "Big Van", capacity: "11-15 Pax", icon: Car },
  { name: "Bus", capacity: "20-40 Pax", icon: Bus },
];

export default async function TransportationPage() {
  const settings = await getSiteSettings();
  const whatsappNumber = settings?.whatsapp?.replace(/\D/g, '') || "";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/transportation_2.jpeg"
            alt="Our Transport Fleet"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-100 uppercase bg-blue-600/30 rounded-full backdrop-blur-sm border border-blue-400/30">
            Premium Travel Experience
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Seamless Transportation <br className="hidden md:block" /> For Your Journey
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Travel in comfort and style with our diverse fleet of well-maintained vehicles, 
            tailored to fit every group size and destination.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href={`https://wa.me/${whatsappNumber}`}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Book via WhatsApp
            </a>
            <a 
              href="#pricing"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md rounded-full font-bold transition-all"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/transportation_1.jpeg"
                alt="Our Professional Drivers"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-8">
                <p className="text-white text-lg italic mt-auto">
                  "Your safety and comfort are our top priorities. Our professional drivers are ready to take you anywhere."
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
              A Fleet Built for <span className="text-blue-600">Every Group</span>
            </h2>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
              We offer a range of vehicle options to ensure you have the perfect ride for your trip. 
              Whether you're a small family or a large corporate group, we've got you covered.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {fleet.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{item.name}</h3>
                  <p className="text-slate-500 font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" /> Capacity: {item.capacity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
                <Info className="w-6 h-6 text-amber-600 shrink-0" />
                <p className="text-amber-800 text-sm">
                    <strong>Note:</strong> All our vehicles are air-conditioned, regularly serviced, and come with experienced drivers who know the best routes to your destination.
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg border-b border-slate-800 pb-12">
            Competitive rates calculated per person based on your group size. 
            All prices include driver, fuel, and tolls.
          </p>
        </div>

        <div className="container mx-auto px-4 max-w-5xl">
          <div className="overflow-x-auto rounded-3xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800 border-b border-slate-700">
                  <th className="px-8 py-6 text-lg font-bold">Group Size</th>
                  <th className="px-8 py-6 text-lg font-bold text-blue-400">Price Per Person</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {pricingData.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-8 py-8">
                       <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold border border-blue-400/20">
                            {idx + 1}
                        </div>
                        <span className="text-xl font-bold">{tier.pax}</span>
                       </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-black text-white tabular-nums leading-none tracking-tight">RM {tier.rm}</span>
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-slate-700/50 px-2 py-1 rounded">per pax</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5 min-w-[70px]">
                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">EUR</span> 
                            <span className="text-base tabular-nums">€{tier.eur}</span>
                          </span>
                          <span className="text-slate-700 font-light">|</span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">USD</span> 
                            <span className="text-base tabular-nums">${tier.usd}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center">
                <p className="text-slate-400 mb-6">Need a custom quote for a larger group or specific itinerary?</p>
                <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I'm interested in booking transportation for a group.")}`}
                className="px-10 py-5 bg-white text-slate-900 rounded-full font-black text-lg hover:bg-blue-50 transition-all flex items-center gap-3 shadow-xl"
                >
                Get a Custom Quote
                <MessageCircle className="w-6 h-6 text-green-600" />
                </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Safe & Reliable</h3>
                <p className="text-slate-600">All vehicles are fully insured and undergo rigorous safety inspections regularly.</p>
            </div>
            <div className="text-center p-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Local Expertise</h3>
                <p className="text-slate-600">Our drivers are locals who know the hidden gems and the most efficient routes.</p>
            </div>
            <div className="text-center p-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Car className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Modern Fleet</h3>
                <p className="text-slate-600">Enjoy modern amenities and comfortable seating in our air-conditioned vehicles.</p>
            </div>
        </div>
      </section>
    </div>
  );
}

