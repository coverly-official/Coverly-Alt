import React, { useState } from 'react';
import { ProductVisual } from '@/components/ui/ProductVisual';
import { Modal } from '@/components/ui/Modal';
import { FileCode2, FileText, Play, ZoomIn, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/data/types';

export interface GalleryProps {
  product: Product;
}

export const Gallery: React.FC<GalleryProps> = ({ product }) => {
  const [selectedAngle, setSelectedAngle] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [cadDownloaded, setCadDownloaded] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // Loupe Zoom Magnifier coordinates
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50, clientX: 0, clientY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x,
      y,
      clientX: e.clientX - rect.left,
      clientY: e.clientY - rect.top,
    });
  };

  const handleDownloadCad = () => {
    setCadDownloaded(true);
    setTimeout(() => setCadDownloaded(false), 2500);
  };

  const handleDownloadPdf = () => {
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 2500);
  };

  return (
    <div className="space-y-4 select-none">
      {/* Main Interactive Stage with Loupe Zoom Lens */}
      <div
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden rounded-stage border border-white/15 bg-gradient-to-b from-elevated/80 to-canvas cursor-crosshair shadow-2xl"
      >
        <ProductVisual
          categorySlug={product.category?.slug}
          angleIndex={selectedAngle}
          aspectRatio="4/3"
          className="w-full"
        />

        {/* Hover Circular Magnified Loupe Lens */}
        {isZooming && (
          <div
            className="absolute pointer-events-none w-36 h-36 rounded-full border-2 border-gold shadow-2xl overflow-hidden backdrop-blur-none z-30"
            style={{
              left: `${zoomPos.clientX - 72}px`,
              top: `${zoomPos.clientY - 72}px`,
              boxShadow: '0 0 24px rgba(247, 177, 23, 0.4), inset 0 0 16px rgba(0,0,0,0.6)',
            }}
          >
            <div
              className="w-full h-full bg-elevated scale-[2.2] origin-center flex items-center justify-center"
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              }}
            >
              <ProductVisual
                categorySlug={product.category?.slug}
                angleIndex={selectedAngle}
                aspectRatio="4/3"
                showStageLighting={false}
              />
            </div>
          </div>
        )}

        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-canvas/80 backdrop-blur-md border border-white/10 text-[10px] text-ink-secondary flex items-center gap-1">
          <ZoomIn className="w-3 h-3 text-gold" />
          <span>Hover to magnify 2.2X</span>
        </div>
      </div>

      {/* Thumbnail Angles Rail + Factory Video Tour Thumbnail */}
      <div className="grid grid-cols-4 gap-3">
        {[0, 1, 2].map((angle) => (
          <button
            key={angle}
            type="button"
            onClick={() => setSelectedAngle(angle)}
            className={cn(
              'rounded-xl overflow-hidden border p-1 bg-canvas/60 transition-all',
              selectedAngle === angle
                ? 'border-gold shadow-md'
                : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
            )}
            aria-label={`View angle ${angle + 1}`}
          >
            <ProductVisual
              categorySlug={product.category?.slug}
              angleIndex={angle}
              aspectRatio="4/3"
              showStageLighting={false}
            />
            <div className="text-[10px] font-mono text-center text-ink-secondary mt-1">
              Angle 0{angle + 1}
            </div>
          </button>
        ))}

        {/* Factory Video Tour Thumbnail */}
        <button
          type="button"
          onClick={() => setVideoModalOpen(true)}
          className="rounded-xl overflow-hidden border border-white/15 p-1 bg-elevated/60 hover:border-gold/60 transition-all flex flex-col items-center justify-center text-center group"
          title="Watch verified plant inspection video"
        >
          <div className="w-8 h-8 rounded-full bg-gold/20 text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-canvas transition-all flex items-center justify-center mb-1">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <span className="text-[10px] font-bold text-white leading-tight">Plant Tour</span>
          <span className="text-[9px] text-gold font-mono">1080p HD</span>
        </button>
      </div>

      {/* CAD / Engineering Downloads Strip */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleDownloadCad}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-elevated/70 border border-white/15 hover:border-gold/40 text-xs font-semibold text-white transition-colors"
        >
          {cadDownloaded ? (
            <>
              <Check className="w-3.5 h-3.5 text-status-success" />
              <span className="text-status-success">STEP Downloaded</span>
            </>
          ) : (
            <>
              <FileCode2 className="w-3.5 h-3.5 text-gold" />
              <span>Download 3D CAD (.STEP)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDownloadPdf}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-elevated/70 border border-white/15 hover:border-gold/40 text-xs font-semibold text-white transition-colors"
        >
          {pdfDownloaded ? (
            <>
              <Check className="w-3.5 h-3.5 text-status-success" />
              <span className="text-status-success">PDF Downloaded</span>
            </>
          ) : (
            <>
              <FileText className="w-3.5 h-3.5 text-cyan-viz" />
              <span>Inspection Spec (.PDF)</span>
            </>
          )}
        </button>
      </div>

      {/* Video Tour Modal */}
      <Modal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        title="Verified Facility Video Inspection"
        description={`${product.supplier?.name} — 5-Axis Hermle Machining Center & Cleanroom Live Feed`}
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
            {/* Simulated industrial factory floor video display */}
            <div className="absolute inset-0 bg-gradient-to-tr from-canvas via-elevated to-black opacity-90" />
            <div className="relative z-10 text-center space-y-3 p-6">
              <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-gold mx-auto animate-pulse">
                <Play className="w-7 h-7 fill-gold ml-1" />
              </div>
              <p className="text-sm font-bold text-white">
                Live Plant Audit Stream • Stuttgart Production Cell #3
              </p>
              <p className="text-xs text-ink-secondary max-w-md mx-auto">
                Footage verified by TÜV Rheinland on-site audit team. Full CNC spindle coolant cycles, robotic transfer arms, and cleanroom packaging validation.
              </p>
            </div>
            <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-emerald-400">
              ● REC STREAM 60 FPS
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
