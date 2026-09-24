import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Truck,
  Star,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  Building2,
  AlertCircle,
  ArrowUpDown,
  Sparkles,
  Info
} from 'lucide-react';
import { Kabadiwala, WasteCategoryType } from '../../types';

interface KabadiwalaDiscoveryProps {
  kabadiwalas: Kabadiwala[];
  selectedCategories: WasteCategoryType[];
  userLocation: { area: string; city: string; lat: number; lng: number };
  onViewProfile: (kabadiwala: Kabadiwala) => void;
  onSchedulePickup: (kabadiwala: Kabadiwala) => void;
  onBackToCategories: () => void;
}

type SortFilter = 'nearest' | 'highest_rate' | 'highest_rated' | 'pickup_only';

export const KabadiwalaDiscovery: React.FC<KabadiwalaDiscoveryProps> = ({
  kabadiwalas,
  selectedCategories,
  userLocation,
  onViewProfile,
  onSchedulePickup,
  onBackToCategories
}) => {
  const [activeSort, setActiveSort] = useState<SortFilter>('nearest');
  const [viewMode, setViewMode] = useState<'cards' | 'comparison_table'>('cards');

  // Filter kabadiwalas that accept at least all selectedCategories
  let filtered = kabadiwalas.filter((k) => {
    if (selectedCategories.length === 0) return true;
    return selectedCategories.every((cat) => k.waste_categories.includes(cat));
  });

  // Apply pickup only filter if selected
  if (activeSort === 'pickup_only') {
    filtered = filtered.filter((k) => k.pickup_available);
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (activeSort === 'nearest') {
      return (a.distance_km || 999) - (b.distance_km || 999);
    }
    if (activeSort === 'highest_rated') {
      return b.rating - a.rating;
    }
    if (activeSort === 'highest_rate') {
      // Calculate average rate for selected categories
      const getAvgRate = (k: Kabadiwala) => {
        const relevantRates = k.rates.filter((r) =>
          selectedCategories.length === 0 ? true : selectedCategories.includes(r.category)
        );
        if (relevantRates.length === 0) return 0;
        const sum = relevantRates.reduce((acc, r) => acc + r.rate_per_kg, 0);
        return sum / relevantRates.length;
      };
      return getAvgRate(b) - getAvgRate(a);
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0D5C3]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-md">
              Step 3 of 4 — Compare & Select
            </span>
            <span className="text-xs text-slate-500 font-mono">
              · Location: {userLocation.area}, {userLocation.city}
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#240A39] tracking-tight">
            Kabadiwalas Near You
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Verified buyers supplied by local Partner Warehouses within their active service radius.
          </p>
        </div>

        <button
          onClick={onBackToCategories}
          className="h-10 px-4 rounded-xl border border-[#E0D5C3] text-xs font-bold text-slate-700 hover:bg-stone-100 self-start sm:self-auto transition-colors"
        >
          ← Edit Categories ({selectedCategories.join(', ') || 'All'})
        </button>
      </div>

      {/* Filter and View Toggle Controls */}
      <div className="bg-white border border-[#E0D5C3] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Sort Pill Buttons (Prompt Section 9) */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Sort:
          </span>

          <button
            onClick={() => setActiveSort('nearest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSort === 'nearest'
                ? 'bg-[#240A39] text-amber-400 shadow-xs'
                : 'bg-[#FAF8F5] text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
            }`}
          >
            📍 Nearest
          </button>

          <button
            onClick={() => setActiveSort('highest_rate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSort === 'highest_rate'
                ? 'bg-[#240A39] text-amber-400 shadow-xs'
                : 'bg-[#FAF8F5] text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
            }`}
          >
            💰 Highest Rate
          </button>

          <button
            onClick={() => setActiveSort('highest_rated')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSort === 'highest_rated'
                ? 'bg-[#240A39] text-amber-400 shadow-xs'
                : 'bg-[#FAF8F5] text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
            }`}
          >
            ⭐ Highest Rated
          </button>

          <button
            onClick={() => setActiveSort('pickup_only')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSort === 'pickup_only'
                ? 'bg-[#240A39] text-amber-400 shadow-xs'
                : 'bg-[#FAF8F5] text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
            }`}
          >
            🚚 Pickup Available
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <span className="text-xs text-slate-500 font-mono">
            {sorted.length} Kabadiwala{sorted.length === 1 ? '' : 's'} available
          </span>
          <div className="bg-[#FAF8F5] border border-[#E0D5C3] p-1 rounded-xl flex items-center">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards' ? 'bg-[#240A39] text-white' : 'text-slate-600'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('comparison_table')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'comparison_table' ? 'bg-[#240A39] text-white' : 'text-slate-600'
              }`}
            >
              Comparison Table
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Table View (Section 9 Requirement) */}
      {viewMode === 'comparison_table' ? (
        <div className="bg-white rounded-3xl border border-[#E0D5C3] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#240A39] text-white uppercase font-mono tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Kabadiwala</th>
                  <th className="py-3.5 px-4 font-bold">Distance</th>
                  <th className="py-3.5 px-4 font-bold">Partner Warehouse</th>
                  <th className="py-3.5 px-4 font-bold">Rates (per kg)</th>
                  <th className="py-3.5 px-4 font-bold">Pickup</th>
                  <th className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sorted.map((k) => (
                  <tr key={k.kabadiwala_id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{k.business_name}</span>
                        {k.verification_status === 'Verified' && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Proprietor: {k.owner_name} · ⭐ {k.rating} ({k.review_count})
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-slate-800">
                      📍 {k.distance_km || 1.8} km away
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-[11px] text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md font-mono">
                        {k.warehouse_name ? k.warehouse_name.replace('Partner Warehouse — ', '') : 'Partner Hub'}
                      </span>
                    </td>

                    <td className="py-4 px-4 space-y-1">
                      <div className="flex flex-wrap gap-1.5">
                        {k.rates.map((r) => (
                          <span
                            key={r.rate_id}
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                              selectedCategories.includes(r.category)
                                ? 'bg-amber-100 text-[#240A39] border border-amber-300'
                                : 'bg-stone-100 text-slate-700'
                            }`}
                          >
                            {r.category}: ₹{r.rate_per_kg}/kg
                          </span>
                        ))}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Updated {k.rates[0]?.updated_ago_text || 'recently'}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {k.pickup_available ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 w-max">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Available</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          Walk-in only
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewProfile(k)}
                          className="px-3 py-1.5 rounded-lg border border-[#E0D5C3] text-slate-700 font-bold text-xs hover:bg-stone-100"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onSchedulePickup(k)}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#240A39] font-black text-xs shadow-xs"
                        >
                          Schedule
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards Grid View (Prompt Section 7 Requirement) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((k) => (
            <div
              key={k.kabadiwala_id}
              className="bg-white rounded-3xl border border-[#E0D5C3] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-black text-xl text-slate-900">
                      {k.business_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span>Owner: {k.owner_name}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {k.rating} ({k.review_count})
                      </span>
                    </div>
                  </div>

                  {k.verification_status === 'Verified' && (
                    <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                {/* Distance & Warehouse Tag */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="font-mono font-bold text-[#240A39] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{k.distance_km || 1.8} km away</span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono truncate max-w-[170px]" title={k.warehouse_name}>
                    via {k.warehouse_name ? k.warehouse_name.replace('Partner Warehouse — ', '') : 'Partner Hub'}
                  </span>
                </div>

                {/* Rate Showcase (Prompt Section 7 format) */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E0D5C3] space-y-1.5">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Current Buying Rates</span>
                    <span className="text-[10px] text-emerald-700 lowercase font-normal">
                      updated {k.rates[0]?.updated_ago_text || 'today'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {k.rates.map((rate) => {
                      const isHighlighted = selectedCategories.includes(rate.category);
                      return (
                        <div
                          key={rate.rate_id}
                          className={`p-1.5 rounded-lg border text-xs flex justify-between items-center ${
                            isHighlighted
                              ? 'bg-amber-100/70 border-amber-300 font-bold text-[#240A39]'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{rate.category}:</span>
                          <span className="font-mono">₹{rate.rate_per_kg}/kg</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pickup & Operating Hours */}
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{k.operating_hours}</span>
                  </div>

                  {k.pickup_available ? (
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      <span>🚚 Pickup Available</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">Walk-in only</span>
                  )}
                </div>
              </div>

              {/* Action Buttons: View Details & Schedule Pickup */}
              <div className="pt-3 border-t border-[#E0D5C3] grid grid-cols-2 gap-3">
                <button
                  onClick={() => onViewProfile(k)}
                  className="h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs flex items-center justify-center transition-colors"
                >
                  View Details
                </button>

                <button
                  onClick={() => onSchedulePickup(k)}
                  className="h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Schedule Pickup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sorted.length === 0 && (
        <div className="bg-white rounded-3xl p-12 border border-[#E0D5C3] text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">
            No Kabadiwalas Found for Selected Criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your scrap categories or expand your location area to discover buyers connected via our partner warehouse network.
          </p>
          <button
            onClick={onBackToCategories}
            className="h-10 px-6 rounded-xl bg-[#240A39] text-amber-400 font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
