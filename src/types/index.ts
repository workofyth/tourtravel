export interface Category {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  created_at: string;
}

export interface Package {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  price: number;
  price_child: number;
  price_infant: number;
  duration_days: number;
  description: string;
  cover_image: string;
  is_featured: boolean;
  created_at: string;
}

export interface PackageWithCategory extends Package {
  category_name: string;
  category_slug: string;
  category_type?: string;
  itineraries?: Itinerary[];
  images?: PackageImage[];
}

export interface PackageImage {
  id: string;
  package_id: string;
  image_url: string;
  sort_order: number;
}

export interface Itinerary {
  id: string;
  package_id: string;
  day_number: number;
  title: string;
  description: string;
  created_at: string;
}

export interface Booking {
  id: string;
  package_id: string;
  name: string;
  email: string;
  phone: string;
  travel_date: string;
  pax: number;
  pax_child: number;
  pax_infant: number;
  notes: string;
  status: string;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string | null;
  logo_url: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  updated_at: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Transportation {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  capacity_pax: number;
  capacity_luggage: number;
  price_per_day: number;
  description: string;
  is_active: boolean;
  created_at: string;
}
