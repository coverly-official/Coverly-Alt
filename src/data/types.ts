export interface PriceTier {
  min_qty: number;
  max_qty: number | null;
  unit_price: number;
}

export interface PackagingInfo {
  carton_dimensions: string;
  units_per_carton: number;
  gross_weight_kg: number;
}

export interface AuditReport {
  name: string;
  auditor: string;
  date: string;
  download_url?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  supplier_count: number;
  from_price: number;
  featured: boolean;
  sort_order: number;
  description?: string;
  icon_name?: string;
}

export interface Supplier {
  id: string;
  name: string;
  country_code: string; // ISO 2-letter (e.g. 'DE', 'US', 'JP', 'TW', 'VN', 'KR')
  country_name?: string;
  verified: boolean;
  tier: 'Diamond' | 'Gold' | 'Verified';
  response_rate: number; // percentage (e.g. 98)
  response_hours: number; // e.g. 1.8
  on_time_pct: number; // percentage (e.g. 99.4)
  repeat_order_pct: number; // percentage (e.g. 89)
  factory_area_sqm: number; // e.g. 48000
  annual_output: string; // e.g. '$50M - $100M'
  years_on_platform: number; // e.g. 8
  certifications: string[]; // e.g. ['ISO 9001', 'RoHS', 'CE', 'IATF 16949']
  audit_reports: AuditReport[];
  logo_initials?: string;
  tagline?: string;
}

export interface Product {
  id: string;
  supplier_id: string;
  category_id: string;
  title: string;
  description: string;
  price_tiers: PriceTier[];
  moq: number;
  lead_time_days: number;
  hs_code: string;
  packaging: PackagingInfo;
  specs: Record<string, string>;
  customization: string[];
  escrow_eligible: boolean;
  sample_available: boolean;
  sample_price?: number;
  port_of_origin: string;
  cad_available?: boolean;
  video_tour_available?: boolean;
  created_at: string;
  // Joins
  supplier?: Supplier;
  category?: Category;
}

export interface Rfq {
  id: string;
  buyer_id: string;
  product_id: string;
  target_qty: number;
  target_unit_price: number;
  destination_port: string;
  notes: string;
  attachment_urls: string[];
  attachment_keys: string[];
  status: 'pending' | 'quoted' | 'approved' | 'rejected' | 'in_production' | 'completed';
  is_sample?: boolean;
  created_at: string;
  product?: Product;
  supplier?: Supplier;
}

export interface Quote {
  id: string;
  rfq_id: string;
  supplier_id: string;
  unit_price: number;
  qty: number;
  lead_time_days: number;
  status: 'pending' | 'counter_offered' | 'accepted' | 'declined';
  counter_offer: boolean;
  counter_price?: number;
  notes?: string;
  created_at: string;
  rfq?: Rfq;
  supplier?: Supplier;
}

export interface UserProfile {
  id: string;
  user_id: string;
  role: 'buyer' | 'seller' | 'both';
  company_name: string;
  full_name: string;
  email: string;
}

export interface RecentSearch {
  id: string;
  user_id?: string | null;
  query: string;
  created_at: string;
}
