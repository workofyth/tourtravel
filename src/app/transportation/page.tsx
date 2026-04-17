import { getActiveTransportations } from "@/lib/queries/transportation";
import Image from "next/image";
import { Users, Briefcase, CheckCircle2 } from "lucide-react";
import { getSiteSettings } from "@/lib/queries/settings";

export const metadata = {
  title: "Transportation Services - Liburan Impian Anda",
  description: "Explore our fleet of vehicles for your travel needs.",
};

export default async function TransportationPage() {
  const transportations = await getActiveTransportations();
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-[#001C44]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
            alt="Transportation"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Our Fleet</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Comfortable, reliable, and affordable transportation services for your holiday adventure.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {transportations.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <h3 className="text-xl font-medium text-slate-500">No vehicles available at the moment.</h3>
            </div>
          ) : (
            transportations.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={t.image_url.startsWith('http') ? t.image_url : `/uploads/transportations/${t.image_url}`}
                    alt={t.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#001C44] px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    RM {Number(t.price_per_day).toLocaleString()} / day
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.name}</h3>
                  <div className="flex items-center gap-4 mb-4 text-slate-600">
                    <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg text-sm font-medium">
                      <Users className="h-4 w-4 text-primary" />
                      {t.capacity_pax} Pax
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg text-sm font-medium">
                      <Briefcase className="h-4 w-4 text-primary" />
                      {t.capacity_luggage} Luggage
                    </div>
                  </div>
                  
                  {t.description && (
                    <div className="mb-6">
                        <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Vehicle Highlights</div>
                        <ul className="grid grid-cols-1 gap-2">
                           {t.description.split('\n').map((feature, idx) => (
                             feature.trim() && (
                               <li key={idx} className="flex items-center gap-2 text-slate-700 text-sm">
                                 <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                 {feature.trim()}
                               </li>
                             )
                           ))}
                        </ul>
                    </div>
                  )}

                  <a
                    href={`https://wa.me/${settings?.whatsapp?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I want to book transportation: ${t.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-[#001C44] text-white py-3 rounded-xl font-bold hover:bg-[#002861] transition-colors shadow-lg shadow-blue-900/10"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
