-- =========================================================
-- JUSWADRAWS — COMPLETE SUPABASE DATABASE & STORAGE SCHEMA
-- Production Schema with Strict Row Level Security (RLS)
-- =========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------
-- 1. DOODLES TABLE (Community Interactive Sketchpad)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.doodles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname VARCHAR(80) DEFAULT 'Anonymous Artist',
  message TEXT,
  image_url TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  approved_at TIMESTAMPTZ
);

-- Index for speedy public wall queries
CREATE INDEX IF NOT EXISTS idx_doodles_status_created ON public.doodles (status, created_at DESC);

-- Enable RLS
ALTER TABLE public.doodles ENABLE ROW LEVEL SECURITY;

-- Public can read ONLY approved doodles
CREATE POLICY "Public can view approved doodles" 
  ON public.doodles 
  FOR SELECT 
  TO anon, authenticated
  USING (status = 'approved' OR auth.role() = 'authenticated');

-- Public can submit new doodles, but status MUST be 'pending'
CREATE POLICY "Public can submit pending doodles" 
  ON public.doodles 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- Only authenticated administrator can update doodle status (approve/reject)
CREATE POLICY "Admin can update doodles" 
  ON public.doodles 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated administrator can delete doodles
CREATE POLICY "Admin can delete doodles" 
  ON public.doodles 
  FOR DELETE 
  TO authenticated
  USING (true);


-- ---------------------------------------------------------
-- 2. ARTWORKS TABLE (Dashboard-managed Gallery Catalog)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('commissioned-work', 'my-photo', 'personal-works', 'sketches-and-studies')),
  description TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_artworks_category_visible ON public.artworks (category, visible, sort_order ASC);

ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;

-- Public can view visible artworks, Admin can view all
CREATE POLICY "Public can view visible artworks" 
  ON public.artworks 
  FOR SELECT 
  TO anon, authenticated
  USING (visible = true OR auth.role() = 'authenticated');

-- Admin full control
CREATE POLICY "Admin can manage artworks" 
  ON public.artworks 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ---------------------------------------------------------
-- 3. COMMISSION INQUIRIES TABLE (Secure Client Inquiries)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.commission_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(120) NOT NULL,
  client_email VARCHAR(160) NOT NULL,
  artwork_type VARCHAR(100) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'PHP',
  estimated_price VARCHAR(50),
  description TEXT NOT NULL,
  reference_links TEXT,
  deadline VARCHAR(100),
  additional_characters BOOLEAN DEFAULT false,
  detailed_background BOOLEAN DEFAULT false,
  preferred_style VARCHAR(120),
  notes TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.commission_inquiries ENABLE ROW LEVEL SECURITY;

-- Public can insert new commission inquiries
CREATE POLICY "Public can submit commission inquiries" 
  ON public.commission_inquiries 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- ONLY authenticated administrator can view private client contact information & status
CREATE POLICY "Admin can view and manage commission inquiries" 
  ON public.commission_inquiries 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ---------------------------------------------------------
-- 4. SITE SETTINGS TABLE (Commission Open/Closed & Config)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  key VARCHAR(60) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read site settings
CREATE POLICY "Public can read site settings" 
  ON public.site_settings 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Admin can manage site settings
CREATE POLICY "Admin can update site settings" 
  ON public.site_settings 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial commission status setting
INSERT INTO public.site_settings (key, value)
VALUES ('commissions_status', '{"open": true, "note": "Currently accepting new commissions! Turnaround ~1 week."}'::jsonb)
ON CONFLICT (key) DO NOTHING;


-- ---------------------------------------------------------
-- 5. STORAGE BUCKETS SETUP & POLICIES
-- ---------------------------------------------------------
-- Insert storage buckets if storage extension is active
INSERT INTO storage.buckets (id, name, public)
VALUES ('doodles', 'doodles', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('artworks', 'artworks', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Doodles storage policy: anyone can upload an image (for sketch wall)
CREATE POLICY "Public upload doodles" 
  ON storage.objects 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (bucket_id = 'doodles');

-- Doodles storage policy: anyone can read doodle images
CREATE POLICY "Public view doodles" 
  ON storage.objects 
  FOR SELECT 
  TO anon, authenticated
  USING (bucket_id = 'doodles');

-- Artworks storage policy: admin can upload/manage
CREATE POLICY "Admin manage artworks storage" 
  ON storage.objects 
  FOR ALL 
  TO authenticated
  USING (bucket_id = 'artworks')
  WITH CHECK (bucket_id = 'artworks');

-- Artworks storage policy: public can view artwork images
CREATE POLICY "Public view artworks storage" 
  ON storage.objects 
  FOR SELECT 
  TO anon, authenticated
  USING (bucket_id = 'artworks');
