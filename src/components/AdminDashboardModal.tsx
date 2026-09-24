import React from 'react';
import {
  X,
  BarChart3,
  Users,
  Truck,
  Recycle,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { AdminMetrics } from '../types';

interface AdminDashboardModalProps {
  metrics: AdminMetrics;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  metrics,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#E7DDCE] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#3B1458] text-white p-4.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-amber-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-extrabold text-base text-white">
                  Pilot Admin Console
                </h3>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-300 px-1.5 py-0.2 rounded">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-purple-200">
                Informal recycling visibility & traceability metrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-200 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto bg-[#FAF8F5]">
          {/* Top 8 Prototype Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Households
              </span>
              <span className="font-display font-black text-xl text-[#2E1065] tabular-nums">
                {metrics.totalHouseholds.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Active base</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Collectors
              </span>
              <span className="font-display font-black text-xl text-[#2E1065] tabular-nums">
                {metrics.totalCollectors}
              </span>
              <span className="text-[10px] text-purple-600 block mt-0.5">Digital scaled</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Recyclers
              </span>
              <span className="font-display font-black text-xl text-[#2E1065] tabular-nums">
                {metrics.recyclerPartners}
              </span>
              <span className="text-[10px] text-blue-600 block mt-0.5">Authorized hubs</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Pickups
              </span>
              <span className="font-display font-black text-xl text-[#2E1065] tabular-nums">
                {metrics.totalPickups.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Completed</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Material Routed
              </span>
              <span className="font-display font-black text-xl text-emerald-700 tabular-nums">
                {metrics.totalMaterialRoutedKg.toLocaleString()} <span className="text-xs font-normal">kg</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">12.48 tonnes</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Documented
              </span>
              <span className="font-display font-black text-xl text-[#2E1065] tabular-nums">
                {metrics.documentedHandoversPercentage}%
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Audit verified</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Repeat Users
              </span>
              <span className="font-display font-black text-xl text-[#2E1065] tabular-nums">
                {metrics.repeatUsersPercentage}%
              </span>
              <span className="text-[10px] text-amber-700 block mt-0.5">High retention</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Rejected Scrap
              </span>
              <span className="font-display font-black text-xl text-stone-700 tabular-nums">
                {metrics.rejectedMaterialKg} <span className="text-xs font-normal">kg</span>
              </span>
              <span className="text-[10px] text-stone-500 block mt-0.5">1.4% rejection</span>
            </div>
          </div>

          {/* Simple Chart 1: Material by Category */}
          <div className="bg-white p-4.5 rounded-3xl border border-[#E7DDCE] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-xs text-slate-900">
                Material Routed by Category
              </h4>
              <span className="text-[10px] font-semibold text-slate-500">12,480 kg total</span>
            </div>

            <div className="space-y-2 text-xs">
              {metrics.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-700">{cat.category}</span>
                    <span className="text-slate-900 tabular-nums">
                      {cat.kg.toLocaleString()} kg ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        cat.category === 'Paper'
                          ? 'bg-amber-600'
                          : cat.category === 'Metal'
                          ? 'bg-blue-600'
                          : cat.category === 'Plastic'
                          ? 'bg-emerald-600'
                          : cat.category === 'E-Waste'
                          ? 'bg-purple-600'
                          : 'bg-stone-500'
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simple Chart 2: Weekly Activity & Documented vs Undocumented */}
          <div className="bg-white p-4.5 rounded-3xl border border-[#E7DDCE] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-xs text-slate-900">
                  Weekly Volume & Documented Ratio
                </h4>
                <div className="text-[10px] text-slate-500">
                  Documented handovers (purple) vs total volume (light purple)
                </div>
              </div>
              <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full">
                92.4% Average
              </span>
            </div>

            {/* Simple Bar Comparison Visual */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
              {(metrics.weeklyVolume || []).map((wv) => {
                const routed = wv.routedKg || 3000;
                const doc = wv.documentedKg || 2500;
                const heightPercent = Math.round((routed / 4000) * 100);
                const docPercent = Math.round((doc / 4000) * 100);
                return (
                  <div key={wv.week} className="flex flex-col items-center">
                    <div className="h-28 w-10 bg-purple-100 rounded-xl relative flex items-end justify-center p-1 overflow-hidden">
                      <div
                        className="w-full bg-[#3B1458] rounded-lg transition-all"
                        style={{ height: `${(docPercent / heightPercent) * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-[11px] text-slate-800 mt-2">{wv.week}</span>
                    <span className="text-[10px] text-slate-500 tabular-nums">{routed} kg</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-[#E7DDCE] text-center shrink-0">
          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
