import React from 'react';
import {
  MapPin,
  FileText,
  Package,
  Wrench,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Building2,
  Scale,
  Sparkles,
  CheckCircle2,
  Truck,
  TrendingUp,
  Clock
} from 'lucide-react';
import { WasteCategoryType } from '../types';

interface HeroLandingProps {
  onFindKabadiwala: () => void;
  onOpenLogin: () => void;
  onSelectCategory: (category: WasteCategoryType) => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onFindKabadiwala,
  onOpenLogin,
  onSelectCategory
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-[#f3fdff] via-[#e3f8ff] to-[#edfafd] border-b border-[#bfeef7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Connected Network Trust Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#bdeaf6] text-xs font-mono font-bold text-[#0a446d] shadow-xs">
              <Building2 className="w-4 h-4 text-[#0a5b95]" />
              <span>Connected Local Partner Warehouse Network</span>
            </div>

            {/* Prompt Required Hero Heading */}
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#0a3f68] tracking-tight leading-[1.1]">
              Sell Your Scrap to the Right Kabadiwala Near You
            </h1>

            {/* Prompt Required Subheading */}
            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto">
              Find nearby local Kabadiwalas, compare scrap rates and schedule a pickup from your doorstep.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onFindKabadiwala}
                className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-gradient-to-r from-[#57d9ee] to-[#0a5b95] hover:from-[#49d0e8] hover:to-[#084d7e] text-white font-black text-sm flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <MapPin className="w-5 h-5 text-white" />
                <span>Find Kabadiwala Near Me</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-white hover:bg-sky-50 text-slate-800 border border-[#c1e9f6] font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Login / Select Role</span>
              </button>
            </div>

            {/* Prompt Required Trust Statement */}
            <div className="pt-6">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-[#eaf9ff] border border-[#bdeaf6] text-xs text-[#0d4d7a] font-semibold shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#0a5b95] shrink-0" />
                <span>Find verified local Kabadiwalas through our connected local network.</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                We do not fabricate listings. Verified Kabadiwala profiles and rates are supplied directly by established local Partner Warehouses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Major Waste Categories Section (Section 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
            Accepted Scrap Categories
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#240A39]">
            What Scrap Do You Have Today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Select a category to compare live rates from verified local buyers in your locality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Category 1: Paper */}
          <div
            onClick={() => onSelectCategory('Paper')}
            className="p-6 rounded-3xl bg-white border border-[#E0D5C3] shadow-xs hover:border-[#240A39] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#240A39] flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                📄
              </div>
              <h3 className="font-display font-black text-xl text-slate-900 group-hover:text-[#240A39]">
                Paper
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Newspaper, cardboard, books, carton boxes & office records.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#240A39]">
              <span>Indicative: ₹18–₹24/kg</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Category 2: Plastic */}
          <div
            onClick={() => onSelectCategory('Plastic')}
            className="p-6 rounded-3xl bg-white border border-[#E0D5C3] shadow-xs hover:border-[#240A39] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                🧴
              </div>
              <h3 className="font-display font-black text-xl text-slate-900 group-hover:text-[#240A39]">
                Plastic
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                PET bottles, plastic containers, mixed plastic, crates & buckets.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#240A39]">
              <span>Indicative: ₹21–₹27/kg</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Category 3: Metal */}
          <div
            onClick={() => onSelectCategory('Metal')}
            className="p-6 rounded-3xl bg-white border border-[#E0D5C3] shadow-xs hover:border-[#240A39] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-900 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                🔩
              </div>
              <h3 className="font-display font-black text-xl text-slate-900 group-hover:text-[#240A39]">
                Metal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Iron, aluminium, copper, brass and other domestic metals.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#240A39]">
              <span>Indicative: ₹40–₹50/kg</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Category 4: E-Waste */}
          <div
            onClick={() => onSelectCategory('E-Waste')}
            className="p-6 rounded-3xl bg-white border border-[#E0D5C3] shadow-xs hover:border-[#240A39] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#240A39] flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                💻
              </div>
              <h3 className="font-display font-black text-xl text-slate-900 group-hover:text-[#240A39]">
                E-Waste
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Electronic waste, old computers, PCBs, printers & appliances.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#240A39]">
              <span>Indicative: ₹165–₹210/kg</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (Section 4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E0D5C3] p-8 sm:p-12 shadow-sm space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              Seamless 4-Step Process
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#240A39]">
              How Navonmesh Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Transforming informal scrap sales into a transparent, verifiable digital transaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E0D5C3] relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#240A39] text-amber-400 font-mono font-bold text-sm flex items-center justify-center">
                    01
                  </div>
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-display font-black text-lg text-slate-900">
                  Detect Your Location
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Allow the application to find Kabadiwalas near your area using precise GPS or manual locality lookup.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                Service radius verification
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E0D5C3] relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#240A39] text-amber-400 font-mono font-bold text-sm flex items-center justify-center">
                    02
                  </div>
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-display font-black text-lg text-slate-900">
                  Select Your Scrap
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Choose Paper, Plastic, Metal or E-Waste. Select multiple categories to filter buyers who take them all.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                Multi-category filter
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E0D5C3] relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#240A39] text-amber-400 font-mono font-bold text-sm flex items-center justify-center">
                    03
                  </div>
                  <Scale className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-display font-black text-lg text-slate-900">
                  Compare Rates
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  See nearby Kabadiwalas, their verified rates, distance and pickup availability side-by-side.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                Transparent comparison
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E0D5C3] relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#240A39] text-amber-400 font-mono font-bold text-sm flex items-center justify-center">
                    04
                  </div>
                  <Truck className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-display font-black text-lg text-slate-900">
                  Schedule Pickup
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Choose your preferred Kabadiwala, check estimated payout, and book a doorstep slot.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                Doorstep weighing & payment
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={onFindKabadiwala}
              className="h-12 px-8 rounded-xl bg-[#240A39] hover:bg-[#3B1458] text-amber-400 font-bold text-xs inline-flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>Start Discovery & Rate Comparison</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Partner Warehouse Model Architecture Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-emerald-500/10 border border-[#E0D5C3] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-950 uppercase">
              <Building2 className="w-4 h-4 text-[#240A39]" />
              <span>Partner Warehouse Data Architecture</span>
            </div>
            <h3 className="font-display font-black text-xl text-[#240A39]">
              How Partner Warehouses Power the Platform
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Local warehouses maintain existing ground relationships with local Kabadiwalas. Instead of random listings, warehouses provide us with verified Kabadiwala profiles, contact details, service radii, and verified rates.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl border border-[#E0D5C3] text-center">
              <div className="font-mono font-black text-lg text-[#240A39]">14+</div>
              <div className="text-[10px] text-slate-500">Verified Buyers</div>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#E0D5C3] text-center">
              <div className="font-mono font-black text-lg text-emerald-700">100%</div>
              <div className="text-[10px] text-slate-500">Partner Vetted</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
