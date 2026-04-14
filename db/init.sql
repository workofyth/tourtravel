CREATE TABLE destinations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  category    text,
  description text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE packages (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid REFERENCES destinations(id),
  title          text NOT NULL,
  slug           text UNIQUE NOT NULL,
  price          numeric NOT NULL,
  duration_days  int,
  description    text,
  cover_image    text,
  is_featured    boolean DEFAULT false,
  created_at     timestamptz DEFAULT now()
);

CREATE TABLE bookings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id   uuid REFERENCES packages(id) ON DELETE CASCADE,
  name         text NOT NULL,
  email        text NOT NULL,
  phone        text NOT NULL,
  travel_date  date NOT NULL,
  pax          int DEFAULT 1,
  notes        text,
  status       text DEFAULT 'pending',
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE itineraries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id   uuid REFERENCES packages(id) ON DELETE CASCADE,
  day_number   int NOT NULL,
  title        text NOT NULL,
  description  text,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE package_images (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id   uuid REFERENCES packages(id) ON DELETE CASCADE,
  image_url    text NOT NULL,
  sort_order   int DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

-- Seed Data
INSERT INTO destinations (id, name, slug, category, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Bali', 'bali', 'pantai', 'Pulau Dewata dengan keindahan pantai dan budaya alamnya.'),
('22222222-2222-2222-2222-222222222222', 'Yogyakarta', 'yogyakarta', 'budaya', 'Pusat kebudayaan Jawa dengan candi-candi megah dan tradisi yang kental.');

INSERT INTO packages (id, destination_id, title, slug, price, duration_days, description, cover_image, is_featured) VALUES
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Eksplorasi Bali Selatan', 'eksplorasi-bali-selatan', 2500000, 4, 'Nikmati keindahan pantai-pantai eksotis di Bali Selatan seperti Pandawa, Melasti, dan Uluwatu.', 'bali-selatan.jpg', true),
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Jejak Candi & Keraton Jogja', 'jejak-candi-keraton-jogja', 1800000, 3, 'Kunjungi Candi Borobudur, Prambanan, dan Keraton Yogyakarta dalam satu paket wisata tak terlupakan.', 'jogja-candi.jpg', true);

CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  site_name text,
  logo_url text,
  address text,
  email text,
  phone text,
  whatsapp text,
  facebook_url text,
  instagram_url text,
  twitter_url text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  content text NOT NULL,
  rating int DEFAULT 5,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

INSERT INTO site_settings (id, site_name) 
VALUES (1, 'Tour & Travel') 
ON CONFLICT (id) DO NOTHING;

