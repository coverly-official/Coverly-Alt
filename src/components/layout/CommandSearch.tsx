import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, ArrowRight, Clock, Building2, Package, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { mockCategories } from '@/data/categories';
import { mockProducts } from '@/data/products';
import { mockSuppliers } from '@/data/suppliers';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn } from '@/lib/utils';

export interface CommandSearchProps {
  variant?: 'nav' | 'hero';
  className?: string;
  onClose?: () => void;
}

export const CommandSearch: React.FC<CommandSearchProps> = ({
  variant = 'nav',
  className,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const debouncedQuery = useDebounce(query, 180);
  const modalRef = useFocusTrap(isOpen, () => setIsOpen(false));
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter products and suppliers
  const filteredProducts = debouncedQuery.trim()
    ? mockProducts.filter((p) => {
        const matchesCat = category === 'all' || p.category_id === category;
        const matchesQ =
          p.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          p.hs_code.toLowerCase().includes(debouncedQuery.toLowerCase());
        return matchesCat && matchesQ;
      }).slice(0, 5)
    : [];

  const filteredSuppliers = debouncedQuery.trim()
    ? mockSuppliers.filter((s) =>
        s.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        s.country_name?.toLowerCase().includes(debouncedQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const totalResults = filteredProducts.length + filteredSuppliers.length;

  const handleSubmit = (targetQuery?: string, targetCat?: string) => {
    const q = targetQuery ?? query;
    const cat = targetCat ?? category;
    setIsOpen(false);
    navigate(`/catalog?q=${encodeURIComponent(q)}&cat=${encodeURIComponent(cat)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (totalResults > 0 ? (prev + 1) % totalResults : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (totalResults > 0 ? (prev - 1 + totalResults) % totalResults : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < filteredProducts.length) {
        const prod = filteredProducts[selectedIndex];
        if (prod) {
          setIsOpen(false);
          navigate(`/product/${prod.id}`);
          return;
        }
      } else {
        const supIndex = selectedIndex - filteredProducts.length;
        const sup = filteredSuppliers[supIndex];
        if (sup) {
          setIsOpen(false);
          navigate(`/catalog?supplier=${sup.id}`);
          return;
        }
      }
      handleSubmit();
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Bar */}
      <div
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={cn(
          'flex items-center gap-2 rounded-2xl border transition-all duration-200 cursor-pointer select-none',
          variant === 'hero'
            ? 'h-14 px-4 bg-canvas/90 border-white/20 hover:border-gold/60 shadow-xl backdrop-blur-xl'
            : 'h-10 px-3 bg-canvas/70 border-white/15 hover:border-white/30 text-xs text-ink-secondary'
        )}
      >
        <Search className={cn('text-gold shrink-0', variant === 'hero' ? 'w-5 h-5' : 'w-4 h-4')} />
        
        {variant === 'hero' && (
          <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-white/10 text-xs text-ink-secondary font-medium">
            <span>All Categories</span>
          </div>
        )}

        <span className={cn('flex-1 text-ink-secondary truncate', variant === 'hero' ? 'text-sm' : 'text-xs')}>
          Search 4,200+ verified factories, parts, HS codes...
        </span>

        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-elevated/80 border border-white/10 text-[11px] font-mono text-ink-secondary">
          <Command className="w-3 h-3" />
          <span>K</span>
        </kbd>
      </div>

      {/* Command Palette Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-canvas/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Palette Dialog */}
          <div
            ref={modalRef}
            tabIndex={-1}
            className="relative w-full max-w-2xl glass-strong rounded-card border border-white/20 shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-canvas/60">
              <Search className="w-5 h-5 text-gold shrink-0" />
              
              {/* Category dropdown */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-elevated/70 text-xs text-white rounded-lg px-2.5 py-1 border border-white/15 focus:outline-none focus:ring-1 focus:ring-gold"
                aria-label="Filter by category"
              >
                <option value="all">All Sectors</option>
                {mockCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                ref={inputRef}
                autoFocus
                type="text"
                role="combobox"
                aria-expanded={totalResults > 0}
                aria-autocomplete="list"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search titanium manifold, ISO 13485 PCBA, HS code..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-ink-secondary hover:text-white rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-elevated border border-white/15 text-ink-secondary font-mono">
                ESC
              </kbd>
            </div>

            {/* Results / Suggestions Container */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
              {!query.trim() ? (
                <>
                  {/* Suggested Industries */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary mb-2.5 px-2">
                      Popular Industrial Sectors
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {mockCategories.slice(0, 4).map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleSubmit('', cat.id)}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-canvas/40 hover:bg-elevated border border-white/10 hover:border-gold/40 text-left transition-colors"
                        >
                          <Package className="w-4 h-4 text-gold shrink-0" />
                          <span className="text-xs font-medium text-white truncate">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent Searches */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary mb-2.5 px-2">
                      Recent Sourcing Queries
                    </div>
                    <div className="space-y-1">
                      {['5-axis titanium manifold', 'Cleanroom medical PEEK tooling', '8-layer HDI PCBA with microvias'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setQuery(s);
                            handleSubmit(s);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-elevated/70 text-left text-xs text-ink-body group transition-colors"
                        >
                          <span className="flex items-center gap-2.5">
                            <Clock className="w-3.5 h-3.5 text-muted group-hover:text-gold" />
                            <span>{s}</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-gold transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {totalResults === 0 ? (
                    <div className="text-center py-8 text-ink-secondary">
                      <p className="text-sm">No exact matches for &quot;{query}&quot;</p>
                      <button
                        type="button"
                        onClick={() => handleSubmit()}
                        className="mt-3 text-xs text-gold hover:underline font-semibold"
                      >
                        Search entire catalog for &quot;{query}&quot; →
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Product Results */}
                      {filteredProducts.length > 0 && (
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary mb-2 px-2">
                            Industrial Products ({filteredProducts.length})
                          </div>
                          <div className="space-y-1">
                            {filteredProducts.map((prod, idx) => {
                              const isSelected = selectedIndex === idx;
                              return (
                                <div
                                  key={prod.id}
                                  onClick={() => {
                                    setIsOpen(false);
                                    navigate(`/product/${prod.id}`);
                                  }}
                                  className={cn(
                                    'flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors',
                                    isSelected
                                      ? 'bg-elevated border-l-2 border-gold text-white'
                                      : 'hover:bg-elevated/60 text-ink-body'
                                  )}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <Package className="w-4 h-4 text-gold shrink-0" />
                                    <div className="truncate">
                                      <p className="text-xs font-semibold text-white truncate">{prod.title}</p>
                                      <p className="text-[11px] text-ink-secondary truncate">
                                        MOQ: {prod.moq} pcs • Lead time: {prod.lead_time_days} days • Port: {prod.port_of_origin}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-xs font-bold tabular-nums text-gold shrink-0 ml-3">
                                    ${prod.price_tiers[0]?.unit_price}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Supplier Results */}
                      {filteredSuppliers.length > 0 && (
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary mb-2 px-2">
                            Verified Factories ({filteredSuppliers.length})
                          </div>
                          <div className="space-y-1">
                            {filteredSuppliers.map((sup, idx) => {
                              const isSelected = selectedIndex === filteredProducts.length + idx;
                              return (
                                <div
                                  key={sup.id}
                                  onClick={() => {
                                    setIsOpen(false);
                                    navigate(`/catalog?supplier=${sup.id}`);
                                  }}
                                  className={cn(
                                    'flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors',
                                    isSelected
                                      ? 'bg-elevated border-l-2 border-gold text-white'
                                      : 'hover:bg-elevated/60 text-ink-body'
                                  )}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <Building2 className="w-4 h-4 text-gold shrink-0" />
                                    <div className="truncate">
                                      <p className="text-xs font-semibold text-white truncate">{sup.name}</p>
                                      <p className="text-[11px] text-ink-secondary truncate">
                                        {sup.country_name} • {sup.on_time_pct}% On-time • {sup.certifications.slice(0, 3).join(', ')}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-bold shrink-0">
                                    {sup.tier}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Footer helper */}
            <div className="px-4 py-2.5 bg-canvas/90 border-t border-white/10 flex items-center justify-between text-[11px] text-ink-secondary">
              <span>Press <kbd className="text-white font-mono">↵ Enter</kbd> to open or search</span>
              <span>Use <kbd className="text-white font-mono">↑↓</kbd> to navigate</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
