import React, { useState } from 'react';
import { Search, Info, TrendingUp, TrendingDown, Clock, ShieldCheck, ArrowRight, Sparkles, Calculator, CheckCircle2 } from 'lucide-react';
import { MaterialRate, WasteCategory } from '../types';

interface RatesScreenProps {
  rates: MaterialRate[];
  onBookMaterial: (category: WasteCategory, materialName?: string) => void;
}

export const RatesScreen: React.FC<RatesScreenProps> = ({ rates, onBookMaterial }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedMaterialId, setExpandedMaterialId] = useState<string | null>(null);

  // Calculator State
  const [calcMaterialId, setCalcMaterialId] = useState<string>(rates[0]?.id || 'r1');
  const [calcWeight, setCalcWeight] = useState<number>(15);

  const categories = ['All', 'Paper', 'Metal', 'Plastic', 'E-Waste', 'Other'];

  const filteredRates = rates.filter((rate) => {
    const matchesCategory = selectedCategory === 'All' || rate.category === selectedCategory;
    const matchesSearch =
      rate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rate.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rate.acceptedItems.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const selectedCalcMaterial = rates.find((r) => r.id === calcMaterialId) || rates[0];
  const calculatedEstimatedTotal = selectedCalcMaterial
    ? selectedCalcMaterial.indicativeRate * calcWeight
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Calculator Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
              Marketplace Pricing Index
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Commodity Benchmark
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#240A39] tracking-tight text-balance">
            Real-time, transparent scrap rates across your city
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Eliminate arbitrary deductions. Our indicative rates are derived from daily wholesale aggregator spot prices, guaranteeing that you receive full value for segregated secondary resources.
          </p>

          {/* Mandatory Disclaimer Box */}
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
            <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed">
              <span className="font-bold">Important transparency note:</span> Indicative rates are published to set fair expectations. Final price is confirmed after precision digital weighing and material grade inspection by the verified collector at your doorstep.
            </div>
          </div>
        </div>

        {/* Interactive Earnings Calculator */}
        <div className="lg:col-span-5 bg-white border border-[#E0D5C3] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#3B1458] uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>Instant Scrap Value Estimator</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Select Material Grade:
              </label>
              <select
                value={calcMaterialId}
                onChange={(e) => setCalcMaterialId(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B1458]"
              >
                {rates.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.category}) — ₹{r.indicativeRate}/{r.unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                <span>Estimated Weight:</span>
                <span className="font-mono text-sm text-[#240A39] font-bold">{calcWeight} kg</span>
              </div>
              <input
                type="range"
                min="2"
                max="100"
                step="1"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>2 kg</span>
                <span>25 kg</span>
                <span>50 kg</span>
                <span>100 kg</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EADFD0] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500">Estimated Doorstep Value</p>
                <p className="font-display font-black text-2xl text-[#240A39] tabular-nums">
                  ₹{calculatedEstimatedTotal}
                </p>
              </div>

              <button
                onClick={() =>
                  onBookMaterial(
                    selectedCalcMaterial.category,
                    selectedCalcMaterial.name
                  )
                }
                className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Book This Scrap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E0D5C3] rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search newspaper, copper, PET bottle, battery..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B1458]/20 focus:border-[#3B1458]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all min-h-[38px] ${
                  selectedCategory === cat
                    ? 'bg-[#3B1458] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rates Cards Grid (Responsive: 1 col on mobile, 2 on tablet, 3 on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRates.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-[#E0D5C3] text-slate-500 text-sm">
            No scrap items matched "{searchQuery}". Try searching for paper, aluminium, or copper.
          </div>
        ) : (
          filteredRates.map((item) => {
            const isExpanded = expandedMaterialId === item.id;
            const maxRate = Math.max(...item.history7Days.map((d) => d.rate));
            const minRate = Math.min(...item.history7Days.map((d) => d.rate));
            const range = maxRate - minRate || 1;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E0D5C3] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Main Card Header */}
                <div
                  onClick={() => setExpandedMaterialId(isExpanded ? null : item.id)}
                  className="p-5 flex items-start justify-between cursor-pointer hover:bg-stone-50/60 transition-colors"
                >
                  <div className="space-y-1.5 pr-2">
                    <span className="font-display font-bold text-base text-slate-900 block">
                      {item.name}
                    </span>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-semibold text-[#3B1458]">{item.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Updated {item.lastUpdatedMins}m ago
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-display font-black text-[#2E1065] tabular-nums">
                      ₹{item.indicativeRate}
                      <span className="text-xs font-normal text-slate-500">/{item.unit}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                      Indicative
                    </div>
                  </div>
                </div>

                {/* 7-Day Trend Sparkline (SVG) */}
                <div className="px-5 pb-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-slate-500">
                    7-Day Price Trend:
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-32 h-7 overflow-visible" viewBox="0 0 100 24">
                      {(() => {
                        const points = item.history7Days
                          .map((pt, i) => {
                            const x = (i / (item.history7Days.length - 1)) * 100;
                            const y = 20 - ((pt.rate - minRate) / range) * 16;
                            return `${x},${y}`;
                          })
                          .join(' ');

                        return (
                          <>
                            <polyline
                              fill="none"
                              stroke="#8B5CF6"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={points}
                            />
                            {item.history7Days.map((pt, i) => {
                              const x = (i / (item.history7Days.length - 1)) * 100;
                              const y = 20 - ((pt.rate - minRate) / range) * 16;
                              return (
                                <circle
                                  key={i}
                                  cx={x}
                                  cy={y}
                                  r={i === item.history7Days.length - 1 ? 3.5 : 1.5}
                                  className={
                                    i === item.history7Days.length - 1
                                      ? 'fill-amber-500 stroke-white stroke-2'
                                      : 'fill-[#3B1458]'
                                  }
                                />
                              );
                            })}
                          </>
                        );
                      })()}
                    </svg>

                    <span
                      className={`text-xs font-bold tabular-nums ${
                        item.change24h >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {item.change24h >= 0 ? `+₹${item.change24h}` : `-₹${Math.abs(item.change24h)}`}
                    </span>
                  </div>
                </div>

                {/* Expanded Details & Direct Book CTA */}
                {isExpanded ? (
                  <div className="px-5 pb-5 pt-3 bg-[#FAF8F5] border-t border-slate-100 space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="text-xs text-slate-500">
                      <strong className="text-slate-800">Accepted: </strong>
                      {item.acceptedItems.join(', ')}
                    </div>

                    <div className="text-xs text-amber-950 bg-amber-100/70 p-2.5 rounded-xl border border-amber-200">
                      <strong>Sorting Tip: </strong>
                      {item.tips}
                    </div>

                    <button
                      onClick={() => onBookMaterial(item.category, item.name)}
                      className="w-full h-11 bg-[#3B1458] hover:bg-[#4C1D95] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <span>Book Pickup for {item.name}</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                ) : (
                  <div className="px-5 pb-4 pt-2 flex items-center justify-between border-t border-slate-50 text-xs">
                    <button
                      onClick={() => setExpandedMaterialId(item.id)}
                      className="text-slate-500 hover:text-slate-800 font-medium"
                    >
                      View details & tips
                    </button>
                    <button
                      onClick={() => onBookMaterial(item.category, item.name)}
                      className="text-[#3B1458] hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
