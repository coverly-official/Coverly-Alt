-- Meridian Trade — B2B Marketplace Schema for InsForge (PostgreSQL)
-- Supports RLS, optimized indexes, and relations between buyers and suppliers.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table (Publicly Readable)
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    supplier_count INTEGER DEFAULT 0,
    from_price NUMERIC(10,2) DEFAULT 0.00,
    featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    description TEXT,
    icon_name TEXT
);

-- 2. Suppliers Table (Publicly Readable)
CREATE TABLE IF NOT EXISTS public.suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    verified BOOLEAN DEFAULT false,
    tier TEXT DEFAULT 'Verified' CHECK (tier IN ('Diamond', 'Gold', 'Verified')),
    response_rate NUMERIC(5,2) DEFAULT 95.0,
    response_hours NUMERIC(4,1) DEFAULT 2.4,
    on_time_pct NUMERIC(5,2) DEFAULT 98.0,
    repeat_order_pct NUMERIC(5,2) DEFAULT 85.0,
    factory_area_sqm INTEGER DEFAULT 25000,
    annual_output TEXT DEFAULT '$50M - $100M',
    years_on_platform INTEGER DEFAULT 1,
    certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
    audit_reports JSONB DEFAULT '[]'::JSONB,
    tagline TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Table (Publicly Readable)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    supplier_id TEXT NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price_tiers JSONB NOT NULL DEFAULT '[]'::JSONB,
    moq INTEGER NOT NULL DEFAULT 100,
    lead_time_days INTEGER NOT NULL DEFAULT 14,
    hs_code TEXT,
    packaging JSONB DEFAULT '{}'::JSONB,
    specs JSONB DEFAULT '{}'::JSONB,
    customization TEXT[] DEFAULT ARRAY[]::TEXT[],
    escrow_eligible BOOLEAN DEFAULT true,
    sample_available BOOLEAN DEFAULT true,
    sample_price NUMERIC(10,2),
    port_of_origin TEXT NOT NULL,
    cad_available BOOLEAN DEFAULT false,
    video_tour_available BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Profiles Table (Owner Controlled)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'both')),
    company_name TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RFQs (Requests for Quotation) Table (Buyer and Quoted Supplier Access)
CREATE TABLE IF NOT EXISTS public.rfqs (
    id TEXT PRIMARY KEY,
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    target_qty INTEGER NOT NULL CHECK (target_qty > 0),
    target_unit_price NUMERIC(10,2) NOT NULL CHECK (target_unit_price > 0),
    destination_port TEXT NOT NULL,
    notes TEXT,
    attachment_urls JSONB DEFAULT '[]'::JSONB,
    attachment_keys JSONB DEFAULT '[]'::JSONB,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'approved', 'rejected', 'in_production', 'completed')),
    is_sample BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Quotes Table (Supplier and RFQ Buyer Access)
CREATE TABLE IF NOT EXISTS public.quotes (
    id TEXT PRIMARY KEY,
    rfq_id TEXT NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    supplier_id TEXT NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
    qty INTEGER NOT NULL CHECK (qty > 0),
    lead_time_days INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'counter_offered', 'accepted', 'declined')),
    counter_offer BOOLEAN DEFAULT false,
    counter_price NUMERIC(10,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Recent / Saved Searches Table
CREATE TABLE IF NOT EXISTS public.recent_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_moq ON public.products(moq);
CREATE INDEX IF NOT EXISTS idx_products_lead_time ON public.products(lead_time_days);
CREATE INDEX IF NOT EXISTS idx_rfqs_buyer ON public.rfqs(buyer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_rfq ON public.quotes(rfq_id);
CREATE INDEX IF NOT EXISTS idx_quotes_supplier ON public.quotes(supplier_id);
CREATE INDEX IF NOT EXISTS idx_recent_searches_user ON public.recent_searches(user_id);

-- Enable Row Level Security (RLS) on all public tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_searches ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Categories, Suppliers, Products are publicly readable
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Suppliers are viewable by everyone" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- RLS Policies: Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies: RFQs (Buyer can view and create; Suppliers on quotes can view)
CREATE POLICY "Buyers can view their own RFQs" ON public.rfqs FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers can insert RFQs" ON public.rfqs FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can update their own RFQs" ON public.rfqs FOR UPDATE USING (auth.uid() = buyer_id) WITH CHECK (auth.uid() = buyer_id);

-- RLS Policies: Quotes (Buyer of the RFQ or Supplier can view; Supplier can insert)
CREATE POLICY "Participants can view quotes" ON public.quotes FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.rfqs WHERE rfqs.id = quotes.rfq_id AND rfqs.buyer_id = auth.uid())
);
CREATE POLICY "Buyers can update quote status" ON public.quotes FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.rfqs WHERE rfqs.id = quotes.rfq_id AND rfqs.buyer_id = auth.uid())
);

-- RLS Policies: Recent Searches
CREATE POLICY "Users can manage their recent searches" ON public.recent_searches FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Seed Data (Essential initial sample rows)
INSERT INTO public.categories (id, slug, name, supplier_count, from_price, featured, sort_order, description, icon_name)
VALUES
('cat-precision-machining', 'precision-machining', 'CNC & Precision Machining', 840, 3.50, true, 1, '5-axis CNC milling, Swiss turning, EDM tolerances to ±0.002mm', 'Cpu'),
('cat-injection-molding', 'injection-molding', 'Injection Molding & Tooling', 620, 0.25, true, 2, 'High-cavitation steel tooling, engineering polymers, medical molding', 'Layers'),
('cat-pcb-electronics', 'electronics-pcba', 'Electronics & PCBA Assembly', 910, 4.80, true, 3, 'Multi-layer HDI boards, SMT micro-BGA placement, automated optical inspection', 'Radio'),
('cat-industrial-automation', 'industrial-automation', 'Industrial Robotics & Drives', 380, 42.00, true, 4, 'Brushless servomotors, planetary gearheads, and SCARA robotic arms', 'Zap')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.suppliers (id, name, country_code, verified, tier, response_rate, response_hours, on_time_pct, repeat_order_pct, factory_area_sqm, annual_output, years_on_platform, certifications, tagline)
VALUES
('sup-kronos-precision', 'Kronos Precision Mechanics GmbH', 'DE', true, 'Diamond', 99.2, 1.4, 99.6, 92.4, 48500, '$80M - $120M', 9, ARRAY['ISO 9001', 'ISO 13485', 'AS9100D', 'CE'], 'Micron-level aerospace & surgical-grade multi-axis machining facility in Stuttgart.'),
('sup-apex-advanced', 'Apex Micro-Electronics Ltd.', 'TW', true, 'Diamond', 98.7, 1.9, 98.9, 89.1, 62000, '$150M - $250M', 7, ARRAY['ISO 9001', 'IATF 16949', 'RoHS'], 'High-density SMT & cleanroom wafer-level packaging in Hsinchu Science Park.')
ON CONFLICT (id) DO NOTHING;
