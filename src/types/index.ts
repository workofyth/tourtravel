export interface Category {
  id: string;
  name: string;
  name_en?: string | null;
  name_es?: string | null;
  slug: string;
  category: string;
  description: string;
  description_en?: string | null;
  description_es?: string | null;
  created_at: string;
}

export interface Package {
  id: string;
  category_id: string;
  title: string;
  title_en?: string | null;
  title_es?: string | null;
  slug: string;
  description: string;
  description_en?: string | null;
  description_es?: string | null;
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
  title_en?: string | null;
  title_es?: string | null;
  description: string;
  description_en?: string | null;
  description_es?: string | null;
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
  notes: string;
  status: string;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string | null;
  site_name_en?: string | null;
  site_name_es?: string | null;
  logo_url: string | null;
  address: string | null;
  address_en?: string | null;
  address_es?: string | null;
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
  name_en?: string | null;
  name_es?: string | null;
  role: string | null;
  role_en?: string | null;
  role_es?: string | null;
  content: string;
  content_en?: string | null;
  content_es?: string | null;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Transportation {
  id: string;
  name: string;
  name_en?: string | null;
  name_es?: string | null;
  slug: string;
  image_url: string;
  capacity_pax: number;
  capacity_luggage: number;
  price_per_day: number;
  description: string;
  description_en?: string | null;
  description_es?: string | null;
  is_active: boolean;
  created_at: string;
}
