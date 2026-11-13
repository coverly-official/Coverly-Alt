import React from 'react';
import { KPICard } from '@/components/dashboard/KPICard';
import { ActionQueue } from '@/components/dashboard/ActionQueue';
import { PipelineChart } from '@/components/dashboard/PipelineChart';
import { QuoteTable } from '@/components/dashboard/QuoteTable';
import { EscrowTimeline } from '@/components/dashboard/EscrowTimeline';
import { useQuotes } from '@/hooks/queries/useQuotes';
import { useRfqs } from '@/hooks/queries/useRfqs';
import { FileSpreadsheet, FileCheck2, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BuyerDashboard: React.FC = () => {
  const { quotes, refetch: refetchQuotes } = useQuotes();
  const { rfqs } = useRfqs();

  const awaitingQuotesCount = quotes.filter((q) => q.status === 'counter_offered' || q.status === 'pending').length;

  return (
    <div className="space-y-8 select-none">
      {/* Page Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">
            Procurement Operations
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            Real-time telemetry across multi-plant RFQs, counter-offers, and milestone escrow.
          </p>
        </div>

        <Link to="/catalog">
          <button
            type="button"
            className="h-10 px-5 rounded-xl bg-gold hover:bg-gold-hover text-canvas font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <span>Source New SKU</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      {/* KPI Row (Frosted Glass Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          label="Open RFQs in Market"
          value={rfqs.length || 6}
          change="+2 this week"
          isPositive={true}
          icon={<FileSpreadsheet className="w-4 h-4" />}
        />

        <KPICard
          label="Quotes Awaiting Approval"
          value={awaitingQuotesCount || 3}
          isActionRequired={true}
          actionNote="Immediate review required"
          icon={<FileCheck2 className="w-4 h-4" />}
        />

        <KPICard
          label="Active Purchase Orders"
          value="4 Batches"
          change="100% on schedule"
          isPositive={true}
          icon={<Truck className="w-4 h-4" />}
        />

        <KPICard
          label="Institutional Escrow Balance"
          value="$148,250"
          change="Protected funds"
          isPositive={true}
          icon={<ShieldCheck className="w-4 h-4" />}
        />
      </div>

      {/* Action Queue & Escrow Milestone Timeline Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ActionQueue />
        </div>
        <div className="lg:col-span-5">
          <EscrowTimeline />
        </div>
      </div>

      {/* Quote Comparison Table */}
      <div>
        <QuoteTable quotes={quotes} onRefresh={refetchQuotes} />
      </div>

      {/* Procurement Spend Pipeline Chart */}
      <div>
        <PipelineChart
          title="Procurement Spend & Escrow Disbursements"
          subtitle="Monthly capital deployed to verified European and Asian manufacturers"
        />
      </div>
    </div>
  );
};

export default BuyerDashboard;
