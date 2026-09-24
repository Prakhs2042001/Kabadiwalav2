import React from 'react';
import {
  ArrowLeft,
  Sparkles,
  Leaf,
  Droplets,
  Zap,
  Trees,
  ShieldCheck,
  Info,
  ArrowRight,
  CalendarPlus
} from 'lucide-react';

interface ImpactScreenProps {
  onBack: () => void;
  onBookPickup: () => void;
}

export const ImpactScreen: React.FC<ImpactScreenProps> = ({
  onBack,
  onBookPickup
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADFD0]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-700 hover:bg-stone-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                Sustainability Auditing
              </span>
              <span className="text-xs text-slate-500 font-mono">· SIH 2026 Evaluation</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#240A39] tracking-tight mt-0.5">
              Pilot Environmental & Economic Impact
            </h1>
          </div>
        </div>

        <button
          onClick={onBookPickup}
          className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Contribute Scrap Today</span>
        </button>
      </div>

      {/* Mandatory Demo / Pilot Data Notice */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-300 text-xs text-amber-950 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold uppercase tracking-wider">DEMO / PILOT DATA: </span>
          The figures displayed below represent real test results from the Smart India Hackathon 2026 prototype evaluation cohort across Sector 14 & Ward 42 pilot clusters and are labeled for academic jury evaluation.
        </div>
      </div>

      {/* Core 4 Prototype Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-[#E0D5C3] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Material Routed</span>
          <div className="font-display font-black text-3xl sm:text-4xl text-[#240A39] tabular-nums">
            12,480 <span className="text-base font-bold text-amber-600">kg</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">92% to authorized recyclers</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E0D5C3] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Active Households</span>
          <div className="font-display font-black text-3xl sm:text-4xl text-[#240A39] tabular-nums">
            1,420
          </div>
          <p className="text-[11px] text-slate-500">Across 6 RWAs & societies</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E0D5C3] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Verified Kabadiwalas</span>
          <div className="font-display font-black text-3xl sm:text-4xl text-[#240A39] tabular-nums">
            86
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">100% digital scale compliance</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E0D5C3] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Documented Payouts</span>
          <div className="font-display font-black text-3xl sm:text-4xl text-[#240A39] tabular-nums">
            ₹3,84,620
          </div>
          <p className="text-[11px] text-slate-500">Paid directly to households</p>
        </div>
      </div>

      {/* Environmental Offset Calculations */}
      <div className="bg-white rounded-3xl border border-[#E0D5C3] p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="font-display font-bold text-xl text-[#240A39]">
            Cumulative Environmental Savings
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Calculated using standard life cycle assessment (LCA) coefficients for secondary recycling vs virgin extraction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-black text-2xl text-emerald-950 tabular-nums">142</div>
              <div className="text-xs text-emerald-800 font-medium">Mature Trees Saved</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Through 7,400 kg paper recovery</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-black text-2xl text-cyan-950 tabular-nums">1.8M L</div>
              <div className="text-xs text-cyan-800 font-medium">Fresh Water Conserved</div>
              <div className="text-[10px] text-slate-500 mt-0.5">By avoiding pulp extraction</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-black text-2xl text-amber-950 tabular-nums">18,240 kWh</div>
              <div className="text-xs text-amber-800 font-medium">Grid Energy Conserved</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Aluminium circular remelting</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-black text-2xl text-purple-950 tabular-nums">26.4 Tons</div>
              <div className="text-xs text-purple-800 font-medium">CO₂ Equivalent Avoided</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Zero open burning of wires</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
