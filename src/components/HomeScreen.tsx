import React from 'react';
import {
  CalendarPlus,
  IndianRupee,
  Search,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Recycle,
  Cpu,
  Newspaper,
  Layers,
  Wrench,
  Boxes,
  Scale,
  Building2,
  QrCode,
  Truck,
  FileCheck
} from 'lucide-react';
import { MaterialRate, Transaction, WasteCategory } from '../types';

interface HomeScreenProps {
  onBookPickup: (preselectedCategory?: WasteCategory) => void;
  onViewRates: () => void;
  onFindCollector: () => void;
  onViewTransaction: (transactionId: string) => void;
  onOpenAssisted: () => void;
  onOpenHandover: (transactionId: string) => void;
  rates: MaterialRate[];
  latestTransaction?: Transaction;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onBookPickup,
  onViewRates,
  onFindCollector,
  onViewTransaction,
  onOpenAssisted,
  onOpenHandover,
  rates,
  latestTransaction
}) => {
  const categories: {
    category: WasteCategory;
    label: string;
    rateHint: string;
    subtext: string;
    icon: React.ElementType;
    bgClass: string;
    iconColor: string;
  }[] = [
    {
      category: 'Paper',
      label: 'Paper & Raddi',
      rateHint: '₹24/kg',
      subtext: 'Newspaper, Books, Cardboard',
      icon: Newspaper,
      bgClass: 'bg-amber-50/80 hover:bg-amber-100/90 border-amber-200/80',
      iconColor: 'text-amber-800'
    },
    {
      category: 'Metal',
      label: 'Metal & Alloys',
      rateHint: '₹32 – ₹620/kg',
      subtext: 'Copper, Aluminium, Iron, Brass',
      icon: Wrench,
      bgClass: 'bg-blue-50/80 hover:bg-blue-100/90 border-blue-200/80',
      iconColor: 'text-blue-800'
    },
    {
      category: 'E-Waste',
      label: 'E-Waste & Tech',
      rateHint: '₹100/kg',
      subtext: 'PCBs, Mobile Phones, Appliances',
      icon: Cpu,
      bgClass: 'bg-purple-50/80 hover:bg-purple-100/90 border-purple-200/80',
      iconColor: 'text-purple-800'
    },
    {
      category: 'Plastic',
      label: 'Plastics & PET',
      rateHint: '₹18/kg',
      subtext: 'Bottles, Hard Plastic, Containers',
      icon: Layers,
      bgClass: 'bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-200/80',
      iconColor: 'text-emerald-800'
    },
    {
      category: 'Other',
      label: 'Batteries & Glass',
      rateHint: '₹4 – ₹85/kg',
      subtext: 'Lead-Acid, Beer Bottles, Tyres',
      icon: Boxes,
      bgClass: 'bg-stone-100/80 hover:bg-stone-200/90 border-stone-200',
      iconColor: 'text-stone-800'
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Live Market Rates Ticker Banner */}
      <div className="bg-[#2E1065] text-white py-2.5 px-4 overflow-hidden border-b border-[#4C1D95]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 shrink-0 pr-4 font-mono uppercase tracking-wider text-amber-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Regional Benchmark</span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5 text-xs text-slate-200 font-mono">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span>Newspaper:</span>
              <span className="text-amber-400 font-bold">₹24/kg</span>
              <span className="text-emerald-400 text-[11px]">(+₹2.00)</span>
            </div>
            <span className="text-white/30">·</span>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span>Copper Wire:</span>
              <span className="text-amber-400 font-bold">₹620/kg</span>
              <span className="text-emerald-400 text-[11px]">(+₹15.00)</span>
            </div>
            <span className="text-white/30">·</span>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span>Aluminium Cans:</span>
              <span className="text-amber-400 font-bold">₹145/kg</span>
            </div>
            <span className="text-white/30">·</span>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span>Cardboard / Gatta:</span>
              <span className="text-amber-400 font-bold">₹12/kg</span>
            </div>
            <span className="text-white/30">·</span>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span>E-Waste (PCBs):</span>
              <span className="text-amber-400 font-bold">₹100/kg</span>
            </div>
          </div>

          <button
            onClick={onViewRates}
            className="hidden md:flex items-center gap-1 shrink-0 pl-4 text-amber-300 hover:text-white font-medium transition-colors"
          >
            <span>All Rates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Smart India Hackathon 2026 Prototype · Verified Trust Layer</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#240A39] tracking-tight leading-[1.08] text-balance">
              Sell scrap at fair, verified rates with doorstep digital weighing.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl text-balance">
              Connecting urban households and housing societies with verified neighborhood kabadiwalas. Calibrated digital scales prevent weight manipulation, transparent benchmark prices ensure fair earnings, and digital receipts guarantee authorized recycling.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onBookPickup()}
                className="h-13 px-7 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-[#240A39] font-black text-base rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all"
              >
                <CalendarPlus className="w-5 h-5 stroke-[2.5]" />
                <span>Book a Doorstep Pickup</span>
              </button>

              <button
                onClick={onViewRates}
                className="h-13 px-6 bg-white hover:bg-stone-50 active:scale-[0.98] text-slate-800 font-bold text-sm rounded-xl flex items-center justify-center gap-2 border border-[#E0D5C3] shadow-sm hover:border-[#3B1458] transition-all"
              >
                <IndianRupee className="w-4 h-4 text-amber-600" />
                <span>Check Live Scrap Rates</span>
              </button>

              <button
                onClick={onOpenAssisted}
                className="h-13 px-5 bg-purple-50 hover:bg-purple-100 active:scale-[0.98] text-[#3B1458] font-bold text-sm rounded-xl flex items-center justify-center gap-2 border border-purple-200 transition-all"
                title="Toll-Free Call or WhatsApp Booking"
              >
                <PhoneCall className="w-4 h-4 text-purple-700" />
                <span>Assisted 1800-KABADI</span>
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-6 border-t border-[#EADFD0] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-[#240A39] tabular-nums">
                  12,480<span className="text-amber-600 text-lg font-bold">kg</span>
                </p>
                <p className="text-xs text-slate-500 font-medium">Scrap Recycled</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-[#240A39] tabular-nums">
                  86<span className="text-amber-600 text-lg font-bold">+</span>
                </p>
                <p className="text-xs text-slate-500 font-medium">Calibrated Scales</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-[#240A39] tabular-nums">
                  ₹3.8<span className="text-amber-600 text-lg font-bold">L+</span>
                </p>
                <p className="text-xs text-slate-500 font-medium">Paid Directly</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-[#240A39] tabular-nums">
                  100<span className="text-amber-600 text-lg font-bold">%</span>
                </p>
                <p className="text-xs text-slate-500 font-medium">Receipt Verification</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset & Live Verification Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E0D5C3] aspect-[16/11] bg-stone-900 group">
              <img
                src="/src/assets/images/hero_circular_recycling_1790222504620.jpg"
                alt="Neighborhood circular scrap collection hub with calibrated digital scale"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Floating Verification Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#3B1458] flex items-center justify-center text-amber-400 shrink-0">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                          Calibrated Scale Guaranteed
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 mt-1">
                        Zero Weight Manipulation Guarantee
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Dual sign-off & digital photo proof attached to every receipt
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onFindCollector}
                    className="shrink-0 text-xs font-bold text-[#3B1458] hover:underline flex items-center gap-0.5 mt-1"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Live Transaction Pill */}
            {latestTransaction && (
              <div
                onClick={() => onViewTransaction(latestTransaction.id)}
                className="mt-3 p-3 rounded-xl bg-white border border-[#EADFD0] shadow-sm flex items-center justify-between cursor-pointer hover:border-amber-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-slate-700">
                    Latest Pickup: <strong className="text-slate-900 font-bold">{latestTransaction.id}</strong> ({latestTransaction.wasteCategory} · {latestTransaction.actualWeight} kg)
                  </span>
                </div>
                <span className="text-xs text-amber-700 font-bold flex items-center gap-1">
                  Track
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. High-Contrast Waste Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold font-mono text-amber-800 uppercase tracking-wider">
              Material Categories
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#240A39] tracking-tight mt-1">
              Select what you want to recycle today
            </h2>
          </div>

          <button
            onClick={onViewRates}
            className="text-xs font-bold text-[#3B1458] hover:text-[#4C1D95] flex items-center gap-1 hover:underline"
          >
            <span>View 18+ sub-material price breakdown</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.category}
                onClick={() => onBookPickup(cat.category)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left group flex flex-col justify-between shadow-sm hover:shadow-md ${cat.bgClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${cat.iconColor}`} />
                    </div>
                    <span className="font-mono text-xs font-black text-slate-900 bg-white/90 px-2 py-1 rounded-md shadow-xs border border-black/5">
                      {cat.rateHint}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-[#240A39] transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {cat.subtext}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-[#3B1458]">
                  <span>Book Pickup</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. The 4-Step Trust Protocol (How It Works) */}
      <section className="bg-white border-y border-[#EADFD0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold font-mono text-amber-800 uppercase tracking-wider">
              Transparent & Verifiable
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#240A39] tracking-tight mt-1 text-balance">
              The 4-Step Verified Scrap Lifecycle
            </h2>
            <p className="text-slate-600 text-sm mt-2 text-balance">
              Bridging informal collectors and households with digital accountability from first touch to final smelter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative space-y-3">
              <div className="font-mono text-amber-600 text-sm font-black">01.</div>
              <h3 className="font-display font-bold text-lg text-[#240A39]">
                Request & Lock Rate
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select your scrap category, enter an approximate weight, and lock in the transparent regional benchmark price before booking.
              </p>
              <div className="text-[11px] font-mono text-slate-500">
                No surprises · Clear indicative baseline
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative space-y-3">
              <div className="font-mono text-amber-600 text-sm font-black">02.</div>
              <h3 className="font-display font-bold text-lg text-[#240A39]">
                Verified Collector Assigned
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A nearby verified kabadiwala arrives at your preferred 3-hour slot carrying an authenticated, calibrated digital scale.
              </p>
              <div className="text-[11px] font-mono text-slate-500">
                Background verified · Nearby locality
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative space-y-3">
              <div className="font-mono text-amber-600 text-sm font-black">03.</div>
              <h3 className="font-display font-bold text-lg text-[#240A39]">
                Precision Digital Weighing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Materials are weighed on a digital scale in front of you. Both parties confirm weight and take a photo record to lock the transaction.
              </p>
              <div className="text-[11px] font-mono text-slate-500">
                Weight × Rate = Exact payout
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative space-y-3">
              <div className="font-mono text-amber-600 text-sm font-black">04.</div>
              <h3 className="font-display font-bold text-lg text-[#240A39]">
                Certified Recycler Receipt
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive an instant digital receipt with a verifiable QR code. Follow your scrap's journey directly to CPCB-registered recycling facilities.
              </p>
              <div className="text-[11px] font-mono text-slate-500">
                100% Circular · Zero landfill dump
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Deep-Dive Bento Feature Showcases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Bento Card 1: Precision Digital Scales */}
          <div className="bg-[#FAF8F5] border border-[#E0D5C3] rounded-3xl p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
                <Scale className="w-3.5 h-3.5" />
                <span>Anti-Manipulation Hardware Guarantee</span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#240A39] tracking-tight">
                Calibrated digital scales replace rusted spring balances
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                Traditional informal scrap trade suffers from 10–25% weight manipulation through tampered mechanical spring balances. Navonmesh provides neighborhood collectors with certified digital scales, ensuring 100% parity between household and collector.
              </p>

              <div className="rounded-2xl overflow-hidden border border-[#EADFD0] aspect-[4/3] bg-stone-900">
                <img
                  src="/src/assets/images/digital_scale_handover_1790222517495.jpg"
                  alt="Precision calibrated digital scale weighing scrap metals"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-[#EADFD0] flex items-center justify-between">
              <div className="text-xs text-slate-500">
                <span className="font-bold text-slate-800">86 Active Scales</span> calibrated weekly in pilot cluster
              </div>
              <button
                onClick={() => onBookPickup()}
                className="text-xs font-bold text-[#3B1458] hover:underline flex items-center gap-1"
              >
                <span>Experience Verification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Card 2: Industrial Recycler Traceability */}
          <div className="bg-[#FAF8F5] border border-[#E0D5C3] rounded-3xl p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold">
                <Recycle className="w-3.5 h-3.5" />
                <span>CPCB Authorized Recycler Traceability</span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#240A39] tracking-tight">
                Where does your scrap really go? Complete chain of custody.
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                Informal dumps burning wires for copper pollute urban groundwaters. We guarantee materials collected are batched through registered aggregators directly to authorized smelters, paper pulpers, and polymer reprocessors.
              </p>

              <div className="rounded-2xl overflow-hidden border border-[#EADFD0] aspect-[16/9] bg-stone-900">
                <img
                  src="/src/assets/images/industrial_recycling_plant_1790222530077.jpg"
                  alt="Industrial authorized recycling and circular smelting facility"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-[#EADFD0] flex items-center justify-between">
              <div className="text-xs text-slate-500">
                <span className="font-bold text-slate-800">4 Authorized Partners</span> (Attero, Gencrest, Swachh Smelters)
              </div>
              <button
                onClick={onFindCollector}
                className="text-xs font-bold text-[#3B1458] hover:underline flex items-center gap-1"
              >
                <span>View Recycler Chain</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Society & Bulk Generator Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#3B1458] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Housing Societies & RWAs</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-snug">
              Organize Society Scrap Drives with 1-Tap Aggregation
            </h2>

            <p className="text-purple-200 text-sm sm:text-base leading-relaxed">
              Resident Welfare Associations (RWAs) can aggregate scrap across 200+ flats. Earn society treasury bonuses, achieve 90%+ documented waste segregation, and issue verifiable ESG certificates for municipal green compliance.
            </p>

            <div className="pt-3 flex flex-wrap gap-3">
              <button
                onClick={() => onBookPickup()}
                className="h-12 px-6 bg-amber-500 hover:bg-amber-400 text-[#270A3C] font-bold text-sm rounded-xl transition-all shadow-sm"
              >
                Schedule Society Drive
              </button>

              <button
                onClick={onOpenAssisted}
                className="h-12 px-5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/20 transition-colors"
              >
                Speak with Society Coordinator
              </button>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none hidden lg:block" />
        </div>
      </section>

      {/* 7. Low-Literacy & Assisted Booking Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 text-amber-800" />
              <span>Zero-Barrier Assisted Booking For Everyone</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#240A39]">
              No app? Low digital literacy? Book via Toll-Free IVR or WhatsApp.
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl">
              Our automated voice assistant speaks Hindi and English. Senior citizens and domestic helpers can call <strong>1800-KABADI (1800-522-234)</strong> or send a simple WhatsApp message to request an immediate verified pickup.
            </p>
          </div>

          <div className="shrink-0 flex gap-3">
            <button
              onClick={onOpenAssisted}
              className="h-12 px-6 bg-[#3B1458] hover:bg-[#4C1D95] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Simulate 1800-KABADI</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
