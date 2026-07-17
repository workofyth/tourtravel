-- Add locale columns for English and Spanish translations
-- All new columns are nullable (NULL = fallback to original column)

ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_es TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description_es TEXT;

ALTER TABLE packages ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS title_es TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS description_es TEXT;

ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS title_es TEXT;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS description_es TEXT;

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS name_es TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS role_en TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS role_es TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS content_en TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS content_es TEXT;

ALTER TABLE transportations ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE transportations ADD COLUMN IF NOT EXISTS name_es TEXT;
ALTER TABLE transportations ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE transportations ADD COLUMN IF NOT EXISTS description_es TEXT;

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS site_name_en TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS site_name_es TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS address_en TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS address_es TEXT;

ALTER TABLE galleries ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE galleries ADD COLUMN IF NOT EXISTS title_es TEXT;
