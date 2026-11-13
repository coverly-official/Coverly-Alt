import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/queries/useProduct';
import { useProducts } from '@/hooks/queries/useProducts';
import { Gallery } from '@/components/product/Gallery';
import { SpecPanel } from '@/components/product/SpecPanel';
import { RFQPanel } from '@/components/product/RFQPanel';
import { SupplierDossier } from '@/components/product/SupplierDossier';
import { ProductCard } from '@/components/catalog/ProductCard';
import { QuickViewDrawer } from '@/components/catalog/QuickViewDrawer';
import { CompareTray } from '@/components/catalog/CompareTray';
import { ErrorPanel } from '@/components/ui/ErrorPanel';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/data/types';
import { ChevronRight } from 'lucide-react';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, isLoading, error, refetch } = useProduct(id);

  // Suggested / related products in same category
  const { products: allProducts } = useProducts(
    product ? { categoryId: product.category_id } : undefined
  );
  const relatedProducts = allProducts.filter((p) => p.id !== id).slice(0, 4);

  // Local state for pricing tier selection linking to RFQ
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [rfqQuantity, setRfqQuantity] = useState(100);
  const [rfqUnitPrice, setRfqUnitPrice] = useState(0);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);

  // Drawer / Compare state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [mobileRfqOpen, setMobileRfqOpen] = useState(false);

  // Sync tier selection when product loads
  React.useEffect(() => {
    if (product) {
      const defaultTier = product.price_tiers[0];
      setSelectedTierIndex(0);
      setRfqQuantity(product.moq);
      setRfqUnitPrice(defaultTier?.unit_price || 50);
      if (product.customization?.length) {
        setSelectedCustomizations([product.customization[0]]);
      }
    }
  }, [product]);

  const handleSelectTier = (index: number) => {
    if (!product) return;
    const tier = product.price_tiers[index];
    if (tier) {
      setSelectedTierIndex(index);
      setRfqQuantity(tier.min_qty);
      setRfqUnitPrice(tier.unit_price);
    }
  };

  const handleToggleCustomization = (item: string) => {
    setSelectedCustomizations((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const handleToggleCompare = (p: Product) => {
    setComparedProducts((prev) => {
      if (prev.some((item) => item.id === p.id)) {
        return prev.filter((item) => item.id !== p.id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, p];
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Skeleton variant="text" className="w-48 h-4" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="w-full aspect-[4/3] rounded-stage" />
            <div className="grid grid-cols-4 gap-2">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <Skeleton variant="text" className="w-3/4 h-8" />
            <Skeleton variant="text" className="w-1/2 h-4" />
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
          <div className="lg:col-span-3">
            <Skeleton className="h-96 rounded-card" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <ErrorPanel
          title="Component Not Found"
          message={error ? error.message : "The requested industrial SKU could not be found or has been retired."}
          onRetry={refetch}
        />
        <Link to="/catalog">
          <Button variant="secondary" className="mt-4">
            Back to Marketplace Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-ink-secondary mb-6">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          <Link to="/catalog" className="hover:text-white transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          {product.category && (
            <>
              <Link
                to={`/catalog?cat=${product.category.slug}`}
                className="hover:text-white transition-colors"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted" />
            </>
          )}
          <span className="text-white font-medium truncate max-w-xs">{product.title}</span>
        </div>

        {/* Above-the-fold 3-Zone Split on a 12-Col Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Zone 1: Left (5 cols) — Gallery & CAD/Inspection downloads */}
          <div className="lg:col-span-5">
            <Gallery product={product} />
          </div>

          {/* Zone 2: Center (4 cols) — Specs, Volume Pricing Matrix, Customizations */}
          <div className="lg:col-span-4">
            <SpecPanel
              product={product}
              selectedTierIndex={selectedTierIndex}
              onSelectTier={handleSelectTier}
              selectedCustomizations={selectedCustomizations}
              onToggleCustomization={handleToggleCustomization}
            />
          </div>

          {/* Zone 3: Right (3 cols) — Sticky RFQ and Instant Sample Box */}
          <div className="hidden lg:block lg:col-span-3">
            <RFQPanel
              product={product}
              quantity={rfqQuantity}
              onQuantityChange={setRfqQuantity}
              unitPrice={rfqUnitPrice}
              onUnitPriceChange={setRfqUnitPrice}
            />
          </div>
        </div>

        {/* Below-the-fold: Supplier Trust Dossier */}
        <SupplierDossier supplier={product.supplier} />

        {/* Related Factory Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <div className="my-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gold block">
                  Same Manufacturing Cell
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Related Engineering SKUs
                </h3>
              </div>
              <Link
                to={`/catalog?cat=${product.category?.slug}`}
                className="text-xs font-semibold text-gold hover:text-white transition-colors"
              >
                View all in {product.category?.name} →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                  onRequestQuote={(prod) => navigate(`/product/${prod.id}`)}
                  onToggleCompare={handleToggleCompare}
                  isCompared={comparedProducts.some((item) => item.id === p.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar for RFQ */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-canvas/95 border-t border-white/15 backdrop-blur-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-ink-secondary block">Unit Price From</span>
          <span className="text-base font-bold tabular-nums text-gold">
            ${product.price_tiers[product.price_tiers.length - 1]?.unit_price}
          </span>
          <span className="text-[10px] text-ink-secondary ml-1">FOB</span>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setMobileRfqOpen(true)}
          className="font-bold px-6"
        >
          Request Quote
        </Button>
      </div>

      {/* Mobile RFQ Bottom Sheet */}
      {mobileRfqOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-canvas/80 backdrop-blur-md">
          <div className="relative glass-strong rounded-t-card p-6 border-t border-white/20 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setMobileRfqOpen(false)}
              className="absolute top-4 right-4 p-2 text-ink-secondary hover:text-white"
            >
              ✕
            </button>
            <RFQPanel
              product={product}
              quantity={rfqQuantity}
              onQuantityChange={setRfqQuantity}
              unitPrice={rfqUnitPrice}
              onUnitPriceChange={setRfqUnitPrice}
            />
          </div>
        </div>
      )}

      {/* Quick View Drawer */}
      <QuickViewDrawer
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onRequestQuote={(p) => navigate(`/product/${p.id}`)}
      />

      {/* Compare Tray */}
      <CompareTray
        products={comparedProducts}
        onRemove={(remId) => setComparedProducts((prev) => prev.filter((p) => p.id !== remId))}
        onClear={() => setComparedProducts([])}
        onRequestQuote={(p) => navigate(`/product/${p.id}`)}
      />
    </div>
  );
};

export default ProductPage;
