import { Metadata } from "next";
import { CheckCircle2, ShieldCheck, Clock, Users, MapPin, PhoneCall } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Why Us - Hola Amigos Tour & Travel",
  description: "Learn why Hola Amigos is the best choice for your Malaysia travel experience. Over 25 years of experience in the tourism industry.",
};

export default function WhyUsPage() {
  const features = [
    {
      title: "25+ Years Experience",
      description: "Our long-standing presence in the industry ensures we know every corner of Malaysia and how to provide the best service.",
      icon: Clock,
    },
    {
      title: "Trusted Local Service",
      description: "As a local expert, we provide authentic experiences that international agencies might miss.",
      icon: ShieldCheck,
    },
    {
      title: "Private & Comfortable",
      description: "All our tours use private transportation to ensure your comfort and safety throughout the journey.",
      icon: Users,
    },
    {
      title: "Flexible Planning",
      description: "Want to change the itinerary? No problem. We offer flexible tour arrangements tailored to your needs.",
      icon: MapPin,
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section for Why Us */}
      <section className="relative py-24 bg-[#001C44] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1596422846543-75c6fc15a51c?auto=format&fit=crop&q=80"
            alt="Malaysia Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001C44] to-transparent" />
        </div>
        
        <div className="container relative z-10 px-4 md:px-6 mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Why Travel With <span className="text-[#B8860B]">Hola Amigos</span>?
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Discover why thousands of travelers trust us to handle their Malaysian adventures for over two decades.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-6">
              <h2 className="text-primary font-bold tracking-wider uppercase text-sm">Our Legacy</h2>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                A Quarter Century of Excellence
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                We are proud to introduce travellers to the beauty of Malaysia – Truly Asia. 
                With more than <strong className="text-primary">25 years of experience</strong> in the tourism industry, 
                we specialise in providing comfortable transportation, professional tour services, 
                and unforgettable travel experiences across Malaysia.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Whether you are travelling as a couple, family, or group, our team is ready to help you
                explore the beauty, culture, and history of Malaysia. From modern cities to historical heritage 
                and natural attractions, we ensure every journey is safe, enjoyable, and memorable.
              </p>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80" 
                alt="Our Bus Transportation" 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50 overflow-hidden relative">
        <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              Ready to Plan Your <span className="text-primary">Perfect Trip</span>?
            </h3>
            <p className="text-lg text-slate-600">
              Join us for an unforgettable journey through Malaysia's hidden gems and iconic landmarks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/packages" 
                className="px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:bg-primary/90"
              >
                Browse Our Packages
              </a>
              <a 
                href="https://wa.me/60195852877" 
                className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-full font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-5 h-5" />
                Talk to an Expert
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
