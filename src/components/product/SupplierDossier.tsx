import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SupplierBadge } from '@/components/ui/SupplierBadge';
import { FlagIcon } from '@/components/ui/FlagIcon';
import type { Supplier } from '@/data/types';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Award,
  Download,
  Check
} from 'lucide-react';

export interface SupplierDossierProps {
  supplier?: Supplier;
}

export const SupplierDossier: React.FC<SupplierDossierProps> = ({ supplier }) => {
  const [downloadedReport, setDownloadedReport] = useState<string | null>(null);

  if (!supplier) return null;

  const handleDownload = (name: string) => {
    setDownloadedReport(name);
    setTimeout(() => setDownloadedReport(null), 2500);
  };

  return (
    <GlassCard variant="glass-strong" className="p-8 sm:p-10 border border-white/15 my-12 shadow-2xl">
      {/* Dossier Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-elevated to-canvas border border-gold/40 flex items-center justify-center font-display font-bold text-lg text-gold shadow-md">
            {supplier.logo_initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                {supplier.name}
              </h2>
              <SupplierBadge verified={supplier.verified} tier={supplier.tier} size="md" />
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-secondary mt-1">
              <FlagIcon countryCode={supplier.country_code} size="sm" />
              <span>{supplier.country_name}</span>
              <span>•</span>
              <span>Direct Manufacturer (No Intermediaries)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-ink-secondary">
          <span className="px-3 py-1.5 rounded-xl bg-canvas/70 border border-white/10 tabular-nums">
            Audited on: <strong>March 2026</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
            Status: Active Production
          </span>
        </div>
      </div>

      {/* Metrics Grid with Radial Progress Ring Visuals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-b border-white/10">
        {/* Metric 1: On-Time Delivery Ring */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#424769" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray="88, 100"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-bold tabular-nums text-white">
              {supplier.on_time_pct}%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-white block">On-Time Dispatch</span>
            <span className="text-[10px] text-ink-secondary">Across 850+ orders</span>
          </div>
        </div>

        {/* Metric 2: Repeat Order Rate Ring */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#424769" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#f7b117"
                strokeWidth="3"
                strokeDasharray="80, 100"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-bold tabular-nums text-white">
              {supplier.repeat_order_pct}%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-white block">Repeat Order Rate</span>
            <span className="text-[10px] text-ink-secondary">OEM buyer retention</span>
          </div>
        </div>

        {/* Metric 3: Factory Floor Area */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-canvas/70 border border-white/10 flex items-center justify-center text-cyan-viz shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-base font-bold tabular-nums text-white block">
              {(supplier.factory_area_sqm).toLocaleString()} m²
            </span>
            <span className="text-[10px] text-ink-secondary">Floor Space Capacity</span>
          </div>
        </div>

        {/* Metric 4: Annual Output Volume */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-canvas/70 border border-white/10 flex items-center justify-center text-gold shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-base font-bold text-white block">
              {supplier.annual_output}
            </span>
            <span className="text-[10px] text-ink-secondary">Annual Verified Export</span>
          </div>
        </div>
      </div>

      {/* Certifications and Downloadable Third-Party Audit Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        {/* Verified Certifications */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-secondary mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>Audited Manufacturing Certifications</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {supplier.certifications.map((cert) => (
              <span
                key={cert}
                className="px-3 py-1.5 rounded-xl bg-canvas/80 border border-white/15 text-xs font-mono font-bold text-white flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-gold stroke-[3]" />
                <span>{cert}</span>
              </span>
            ))}
            <span className="px-3 py-1.5 rounded-xl bg-canvas/80 border border-white/15 text-xs text-ink-secondary">
              Years on platform: <strong className="text-white">{supplier.years_on_platform} yrs</strong>
            </span>
          </div>
        </div>

        {/* Downloadable Inspection Reports */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-secondary mb-3 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-cyan-viz" />
            <span>Third-Party Verification Dossiers</span>
          </h4>
          <div className="space-y-2">
            {supplier.audit_reports.map((report) => (
              <div
                key={report.name}
                className="flex items-center justify-between p-3 rounded-xl bg-canvas/60 border border-white/10 text-xs"
              >
                <div>
                  <span className="text-white font-semibold block">{report.name}</span>
                  <span className="text-[10px] text-ink-secondary">
                    Auditor: {report.auditor} • Validated {report.date}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(report.name)}
                  className="px-2.5 py-1 rounded-lg bg-elevated/70 border border-white/15 hover:border-gold/40 text-[11px] font-semibold text-white flex items-center gap-1.5 transition-colors"
                >
                  {downloadedReport === report.name ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-status-success" />
                      <span className="text-status-success">Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-gold" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
