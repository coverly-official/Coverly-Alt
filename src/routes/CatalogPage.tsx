import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { FilterSidebar } from '@/components/catalog/FilterSidebar';
import { SortBar } from '@/components/catalog/SortBar';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { QuickViewDrawer } from '@/components/catalog/QuickViewDrawer';
import { CompareTray } from '@/components/catalog/CompareTray';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useProducts } from '@/hooks/queries/useProducts';
import { rfqsService } from '@/services/rfqs';
import { useAuth } from '@/context/AuthContext';
import type { Product } from '@/data/types';
import type { ProductFilters } from '@/services/products';
import { X, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Parse filters from URL
  const [filters, setFilters] = useState<ProductFilters>({
    categorySlug: searchParams.get('cat') || undefined,
    searchQuery: searchParams.get('q') || undefined,
    sortBy: (searchParams.get('sort') as ProductFilters['sortBy']) || 'best_match',
    goldVerifiedOnly: searchParams.get('verified') === 'true',
    escrowOnly: searchParams.get('escrow') === 'true',
    sampleOnly: searchParams.get('sample') === 'true',
    maxLeadTimeDays: searchParams.get('lead') ? Number(searchParams.get('lead')) : undefined,
    minMoq: searchParams.get('minMoq') ? Number(searchParams.get('minMoq')) : undefined,
    maxMoq: searchParams.get('maxMoq') ? Number(searchParams.get('maxMoq')) : undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    countryCode: searchParams.get('country') || undefined,
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  // RFQ Creation Modal from Card
  const [rfqTargetProduct, setRfqTargetProduct] = useState<Product | null>(null);
  const [rfqTargetQty, setRfqTargetQty] = useState(100);
  const [rfqTargetPrice, setRfqTargetPrice] = useState(50);
  const [rfqPort, setRfqPort] = useState('Port of Rotterdam, NL');
  const [rfqNotes, setRfqNotes] = useState('');
  const [rfqSubmitting, setRfqSubmitting] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState(false);

  // Sync state to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.categorySlug) params.set('cat', filters.categorySlug);
    if (filters.searchQuery) params.set('q', filters.searchQuery);
    if (filters.sortBy && filters.sortBy !== 'best_match') params.set('sort', filters.sortBy);
    if (filters.goldVerifiedOnly) params.set('verified', 'true');
    if (filters.escrowOnly) params.set('escrow', 'true');
    if (filters.sampleOnly) params.set('sample', 'true');
    if (filters.maxLeadTimeDays) params.set('lead', filters.maxLeadTimeDays.toString());
    if (filters.countryCode) params.set('country', filters.countryCode);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Query products with active filters
  const { products, total, isLoading } = useProducts(filters);

  // Active filter pills calculation
  const activeFilterPills: Array<{ label: string; onRemove: () => void }> = [];
  if (filters.categorySlug && filters.categorySlug !== 'all') {
    activeFilterPills.push({
      label: `Sector: ${filters.categorySlug}`,
      onRemove: () => setFilters((prev) => ({ ...prev, categorySlug: undefined })),
    });
  }
  if (filters.searchQuery) {
    activeFilterPills.push({
      label: `Query: "${filters.searchQuery}"`,
      onRemove: () => setFilters((prev) => ({ ...prev, searchQuery: undefined })),
    });
  }
  if (filters.goldVerifiedOnly) {
    activeFilterPills.push({
      label: 'Gold Verified Only',
      onRemove: () => setFilters((prev) => ({ ...prev, goldVerifiedOnly: false })),
    });
  }
  if (filters.escrowOnly) {
    activeFilterPills.push({
      label: 'Trade Escrow Eligible',
      onRemove: () => setFilters((prev) => ({ ...prev, escrowOnly: false })),
    });
  }
  if (filters.sampleOnly) {
    activeFilterPills.push({
      label: 'Instant Sample Available',
      onRemove: () => setFilters((prev) => ({ ...prev, sampleOnly: false })),
    });
  }
  if (filters.maxLeadTimeDays) {
    activeFilterPills.push({
      label: `Lead Time < ${filters.maxLeadTimeDays}d`,
      onRemove: () => setFilters((prev) => ({ ...prev, maxLeadTimeDays: undefined })),
    });
  }
  if (filters.countryCode) {
    activeFilterPills.push({
      label: `Origin: ${filters.countryCode}`,
      onRemove: () => setFilters((prev) => ({ ...prev, countryCode: undefined })),
    });
  }

  const handleResetFilters = () => {
    setFilters({ sortBy: 'best_match' });
  };

  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleOpenRfq = (product: Product) => {
    setRfqTargetProduct(product);
    setRfqTargetQty(product.moq);
    setRfqTargetPrice(product.price_tiers[0]?.unit_price || 50);
    setRfqSuccess(false);
  };

  const handleSendRfqSubmit = async () => {
    if (!user) {
      navigate(`/sign-in?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (!rfqTargetProduct) return;

    setRfqSubmitting(true);
    try {
      await rfqsService.create({
        buyer_id: user.id,
        product_id: rfqTargetProduct.id,
        target_qty: rfqTargetQty,
        target_unit_price: rfqTargetPrice,
        destination_port: rfqPort,
        notes: rfqNotes,
        attachment_urls: [],
        attachment_keys: [],
      });

      setRfqSuccess(true);
      setTimeout(() => {
        setRfqSubmitting(false);
        setRfqTargetProduct(null);
        navigate('/dashboard/buyer');
      }, 1400);
    } catch {
      setRfqSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs text-ink-secondary mb-4">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          <span className="text-white font-medium">B2B Manufacturing Catalog</span>
        </div>

        {/* Page Title & Stats */}
        <div className="pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              Verified Industrial Components & Capacities
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              Connect directly with ISO 9001, AS9100, and cleanroom facilities with certified factory floor audit records.
            </p>
          </div>
        </div>

        {/* Active Filter Pills Bar (Strictly Gold Pills) */}
        {activeFilterPills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-xs font-semibold text-ink-secondary mr-1">Active Filters:</span>
            {activeFilterPills.map((pill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-semibold select-none shadow-sm"
              >
                <span>{pill.label}</span>
                <button
                  type="button"
                  onClick={pill.onRemove}
                  className="hover:text-white p-0.5 rounded-full"
                  aria-label={`Remove filter ${pill.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-ink-secondary hover:text-white underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main 2-Column Catalog Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-8 pt-6">
          {/* Desktop Sticky Left Rail (280px wide) */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-24">
            <FilterSidebar
              filters={filters}
              onChange={(updated) => setFilters(updated)}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Catalog Main Stream */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            <SortBar
              total={total}
              sortBy={filters.sortBy}
              onSortChange={(sort) => setFilters((prev) => ({ ...prev, sortBy: sort }))}
              viewMode={viewMode}
              onViewModeChange={(mode) => setViewMode(mode)}
              onOpenMobileFilters={() => setMobileFiltersOpen(true)}
            />

            <ProductGrid
              products={products}
              isLoading={isLoading}
              viewMode={viewMode}
              onQuickView={(p) => setQuickViewProduct(p)}
              onRequestQuote={handleOpenRfq}
              onToggleCompare={handleToggleCompare}
              comparedIds={comparedProducts.map((p) => p.id)}
              onResetFilters={handleResetFilters}
            />
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer (Bottom Sheet) */}
      <Modal
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Sourcing Filters"
        maxWidth="md"
      >
        <FilterSidebar
          filters={filters}
          onChange={(updated) => setFilters(updated)}
          onReset={handleResetFilters}
        />
        <div className="pt-4 mt-4 border-t border-white/10">
          <Button
            variant="primary"
            size="md"
            onClick={() => setMobileFiltersOpen(false)}
            className="w-full"
          >
            Show {total} Parts
          </Button>
        </div>
      </Modal>

      {/* Quick View Slide-over Drawer */}
      <QuickViewDrawer
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onRequestQuote={handleOpenRfq}
      />

      {/* Compare Tray */}
      <CompareTray
        products={comparedProducts}
        onRemove={(id) => setComparedProducts((prev) => prev.filter((p) => p.id !== id))}
        onClear={() => setComparedProducts([])}
        onRequestQuote={handleOpenRfq}
      />

      {/* Instant Request Quote Modal */}
      <Modal
        isOpen={Boolean(rfqTargetProduct)}
        onClose={() => setRfqTargetProduct(null)}
        title="Submit Request for Quotation (RFQ)"
        description={`Direct quote request to ${rfqTargetProduct?.supplier?.name ?? 'Factory'}`}
        maxWidth="lg"
      >
        {rfqSuccess ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-status-success mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">RFQ Dispatched to Plant Engineer</h4>
            <p className="text-xs text-ink-secondary max-w-sm mx-auto">
              The audited facility has received your target unit price and drawings. Formal factory quote will land in your Buyer Dashboard.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-canvas/70 border border-white/10 text-xs">
              <span className="font-bold text-white block truncate">{rfqTargetProduct?.title}</span>
              <span className="text-ink-secondary text-[11px]">
                Supplier: {rfqTargetProduct?.supplier?.name} • Port: {rfqTargetProduct?.port_of_origin}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Target Order Quantity"
                type="number"
                min={rfqTargetProduct?.moq ?? 1}
                value={rfqTargetQty}
                onChange={(e) => setRfqTargetQty(Number(e.target.value))}
              />
              <Input
                label="Target Unit Price (USD)"
                type="number"
                step="0.01"
                value={rfqTargetPrice}
                onChange={(e) => setRfqTargetPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                Destination Port for Freight
              </label>
              <select
                value={rfqPort}
                onChange={(e) => setRfqPort(e.target.value)}
                className="w-full h-10 px-3 bg-canvas/80 text-white rounded-input border border-white/15 text-xs focus:outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="Port of Rotterdam, NL">Port of Rotterdam, NL (Europe)</option>
                <option value="Port of Long Beach, US">Port of Long Beach, US (West Coast)</option>
                <option value="Port of Hamburg, DE">Port of Hamburg, DE (Central Europe)</option>
                <option value="Port of Singapore, SG">Port of Singapore, SG (APAC Hub)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                Engineering Notes & Surface Treatment
              </label>
              <textarea
                rows={3}
                value={rfqNotes}
                onChange={(e) => setRfqNotes(e.target.value)}
                placeholder="Include CAD drawing links, inspection criteria (CMM, X-Ray), or specific polymer grades..."
                className="w-full p-3 bg-canvas/80 text-white rounded-input border border-white/15 text-xs placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div className="p-3 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-between text-xs">
              <span className="text-gold font-semibold">Estimated Batch Subtotal:</span>
              <span className="text-base font-bold text-white tabular-nums">
                ${(rfqTargetQty * rfqTargetPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRfqTargetProduct(null)}
                className="px-4 py-2 text-xs font-medium text-ink-secondary hover:text-white"
              >
                Cancel
              </button>
              <Button
                variant="primary"
                size="md"
                isLoading={rfqSubmitting}
                onClick={handleSendRfqSubmit}
                className="gap-2 font-bold"
              >
                <FileText className="w-4 h-4" />
                <span>Send Verified RFQ</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CatalogPage;
