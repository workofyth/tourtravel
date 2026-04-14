CREATE TABLE IF NOT EXISTS destinations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  category    text,
  description text,
  created_at  timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS packages (
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

CREATE TABLE IF NOT EXISTS bookings (
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

CREATE TABLE IF NOT EXISTS itineraries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id   uuid REFERENCES packages(id) ON DELETE CASCADE,
  day_number   int NOT NULL,
  title        text NOT NULL,
  description  text,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS package_images (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id   uuid REFERENCES packages(id) ON DELETE CASCADE,
  image_url    text NOT NULL,
  sort_order   int DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

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

