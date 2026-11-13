import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BRAND_NAME } from '@/lib/config';
import { useAuth } from '@/context/AuthContext';
import { useScrolled } from '@/hooks/useScrolled';
import { CommandSearch } from './CommandSearch';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { storageService } from '@/services/storage';
import { rfqsService } from '@/services/rfqs';
import {
  FileSpreadsheet,
  UploadCloud,
  FileCheck2,
  Menu,
  X,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isScrolled = useScrolled(120);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bomModalOpen, setBomModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // BOM Upload modal state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [targetPort, setTargetPort] = useState('Port of Rotterdam, NL');
  const [bomNotes, setBomNotes] = useState('');

  const handleFileDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    let files: File[] = [];
    if ('dataTransfer' in e) {
      e.preventDefault();
      files = Array.from(e.dataTransfer.files);
    } else if (e.target.files) {
      files = Array.from(e.target.files);
    }
    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleBomSubmit = async () => {
    if (!user) {
      setBomModalOpen(false);
      navigate('/sign-in?next=/catalog');
      return;
    }

    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const urls: string[] = [];
      const keys: string[] = [];

      for (const file of uploadedFiles) {
        const { data } = await storageService.uploadRfqAttachment(file);
        if (data) {
          urls.push(data.url);
          keys.push(data.key);
        }
      }

      // Create RFQ for multi-item BOM
      await rfqsService.create({
        buyer_id: user.id,
        product_id: 'prod-cnc-titanium-manifold', // Parent product placeholder
        target_qty: 500,
        target_unit_price: 120.0,
        destination_port: targetPort,
        notes: `Bulk BOM upload with ${uploadedFiles.length} file(s). ${bomNotes}`,
        attachment_urls: urls,
        attachment_keys: keys,
      });

      setUploadSuccess(true);
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(false);
        setBomModalOpen(false);
        setUploadedFiles([]);
        navigate('/dashboard/buyer');
      }, 1500);
    } catch {
      setIsUploading(false);
    }
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300 w-full',
          isScrolled
            ? 'glass-strong border-b border-white/10 shadow-xl backdrop-blur-2xl py-2.5'
            : 'bg-canvas/50 backdrop-blur-md border-b border-transparent py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo Mark + Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl shrink-0"
            aria-label={`${BRAND_NAME} Home`}
          >
            {/* Geometric luxury industrial glyph */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-elevated to-canvas border border-white/20 flex items-center justify-center shadow-md group-hover:border-gold/50 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 18L12 4L20 18H15L12 12.5L9 18H4Z"
                  fill="#f7b117"
                  className="transition-transform group-hover:scale-105"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-gold transition-colors">
                {BRAND_NAME}
              </span>
              <span className="text-[10px] text-ink-secondary tracking-widest uppercase -mt-1 font-mono">
                B2B Global
              </span>
            </div>
          </Link>

          {/* Docked Search Bar on Scroll */}
          <div
            className={cn(
              'hidden md:flex flex-1 max-w-md mx-2 transition-all duration-300',
              isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            )}
          >
            <CommandSearch variant="nav" className="w-full" />
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wide text-ink-secondary">
            <Link
              to="/catalog"
              className={cn(
                'hover:text-white transition-colors py-1',
                location.pathname === '/catalog' && 'text-gold'
              )}
            >
              Categories
            </Link>
            <Link
              to="/catalog?filter=suppliers"
              className="hover:text-white transition-colors py-1"
            >
              Suppliers
            </Link>
            <a href="#how-it-works" className="hover:text-white transition-colors py-1">
              How It Works
            </a>
            <a href="#escrow-assurance" className="hover:text-white transition-colors py-1 flex items-center gap-1.5">
              <span>Trade Escrow</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            </a>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Upload BOM / RFQ List Shortcut Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setBomModalOpen(true)}
              className="hidden sm:inline-flex gap-1.5 text-xs h-9 border-muted/40 hover:border-gold/50"
              title="Upload parts spreadsheet or engineering BOM"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Upload BOM</span>
            </Button>

            {/* Auth Menu or Sign In */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-elevated/70 border border-white/10 hover:border-gold/40 text-xs font-medium text-white transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-gold/20 text-gold flex items-center justify-center font-bold text-xs">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden xl:inline max-w-[100px] truncate">{user.company_name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass-strong rounded-card p-2 border border-white/15 shadow-2xl z-50 text-xs space-y-1">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="font-bold text-white truncate">{user.full_name}</p>
                      <p className="text-[11px] text-ink-secondary truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-gold/15 text-gold text-[10px] font-bold">
                        Role: {user.role.toUpperCase()}
                      </span>
                    </div>

                    <Link
                      to="/dashboard/buyer"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-elevated text-ink-body hover:text-white"
                    >
                      <User className="w-3.5 h-3.5 text-gold" />
                      <span>Buyer Dashboard</span>
                    </Link>

                    <Link
                      to="/dashboard/seller"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-elevated text-ink-body hover:text-white"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-viz" />
                      <span>Supplier Portal</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-status-error/15 text-status-error text-left"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="text-xs font-semibold text-ink-secondary hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Primary RFQ CTA */}
            <Link to="/catalog">
              <Button variant="primary" size="sm" className="h-9 px-4 text-xs">
                Request Quote
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-ink-secondary hover:text-white hover:bg-white/5"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col glass-strong backdrop-blur-2xl p-6">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <span className="font-display font-bold text-lg text-white">{BRAND_NAME}</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl text-ink-secondary hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="py-4">
            <CommandSearch variant="hero" onClose={() => setMobileMenuOpen(false)} />
          </div>

          <div className="flex flex-col gap-4 text-base font-semibold py-4 border-b border-white/10">
            <Link
              to="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-gold"
            >
              Browse Products & Categories
            </Link>
            <Link
              to="/catalog?filter=suppliers"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-gold"
            >
              Verified Supplier Directory
            </Link>
            <Link
              to="/dashboard/buyer"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-gold"
            >
              Buyer Workspace
            </Link>
            <Link
              to="/dashboard/seller"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-gold"
            >
              Supplier Workspace
            </Link>
          </div>

          <div className="mt-auto pt-6 flex flex-col gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMobileMenuOpen(false);
                setBomModalOpen(true);
              }}
              className="w-full gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-gold" />
              <span>Upload BOM / RFQ Sheet</span>
            </Button>
            <Link to="/catalog" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Source Products Direct
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Upload BOM Modal */}
      <Modal
        isOpen={bomModalOpen}
        onClose={() => setBomModalOpen(false)}
        title="Upload Bill of Materials (BOM) / RFQ List"
        description="Drop your multi-line parts spreadsheet or CAD spec sheet. Our AI matches your lines with audited Tier-1 manufacturers within 24 hours."
      >
        {uploadSuccess ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-status-success mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">BOM Submitted for Sourcing</h4>
            <p className="text-xs text-ink-secondary max-w-sm mx-auto">
              Files securely uploaded to InsForge Storage. Direct factory quotes will land in your Buyer Dashboard.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Drag & Drop Zone */}
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-muted/50 hover:border-gold/60 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition-colors bg-canvas/40"
            >
              <UploadCloud className="w-10 h-10 text-gold mb-2" />
              <p className="text-sm font-semibold text-white">
                Drag & drop CSV, XLSX, PDF, or STEP files
              </p>
              <p className="text-xs text-ink-secondary mt-1">
                Up to 20 MB per attachment • AES-256 encrypted storage
              </p>
              <input
                type="file"
                multiple
                accept=".csv,.xlsx,.xls,.pdf,.step,.stp,.dwg"
                onChange={handleFileDrop}
                className="hidden"
              />
            </label>

            {/* Uploaded File List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                <div className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary">
                  Attached Documents ({uploadedFiles.length})
                </div>
                {uploadedFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-xl bg-canvas/70 border border-white/10 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCheck2 className="w-4 h-4 text-gold shrink-0" />
                      <span className="text-white truncate">{f.name}</span>
                      <span className="text-ink-secondary text-[10px]">
                        ({(f.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedFiles(uploadedFiles.filter((_, idx) => idx !== i))}
                      className="text-ink-secondary hover:text-status-error p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Destination Port and Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-1">
                  Target Destination Port
                </label>
                <select
                  value={targetPort}
                  onChange={(e) => setTargetPort(e.target.value)}
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
                  Special Tolerances / Lead Time Target
                </label>
                <input
                  type="text"
                  value={bomNotes}
                  onChange={(e) => setBomNotes(e.target.value)}
                  placeholder="e.g. ±0.005mm CNC tolerance, need Q3 batch"
                  className="w-full h-10 px-3 bg-canvas/80 text-white rounded-input border border-white/15 text-xs focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                <AlertCircle className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>NDA & escrow assurance pre-applied</span>
              </div>
              <Button
                variant="primary"
                size="md"
                isLoading={isUploading}
                disabled={uploadedFiles.length === 0}
                onClick={handleBomSubmit}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Submit BOM for Quotes</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
