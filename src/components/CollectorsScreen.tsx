import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Phone,
  Scale,
  CalendarPlus,
  Clock,
  MapPin,
  Check,
  Filter,
  CheckCircle2,
  Award
} from 'lucide-react';
import { Collector, WasteCategory } from '../types';

interface CollectorsScreenProps {
  collectors: Collector[];
  onBookWithCollector: (collector: Collector) => void;
  onCallCollector: (phone: string, name: string) => void;
}

export const CollectorsScreen: React.FC<CollectorsScreenProps> = ({
  collectors,
  onBookWithCollector,
  onCallCollector
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filteredCollectors = collectors.filter((col) => {
    const matchesSearch =
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (col.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.locality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'All' ||
      col.materialsAccepted.includes(selectedFilter as WasteCategory);

    return matchesSearch && matchesFilter;
  });

  const categories = ['All', 'Paper', 'Metal', 'Plastic', 'E-Waste', 'Other'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
              Neighborhood Directory
            </span>
            <span className="text-xs text-slate-500 font-mono">
              · {collectors.length} Verified Kabadiwalas Active
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#240A39] tracking-tight mt-1">
            Verified Local Scrap Collectors
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Each collector is equipped with an authenticated digital scale, background ID verification, and direct links to CPCB-registered recycling facilities.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-[#E0D5C3] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collector name, locality, or scrap business..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B1458]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === cat
                  ? 'bg-[#3B1458] text-white'
                  : 'bg-[#FAF8F5] text-slate-600 hover:bg-stone-100 border border-[#E0D5C3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Collectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollectors.map((col) => (
          <div
            key={col.id}
            className="bg-white rounded-3xl border border-[#E0D5C3] shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-lg text-slate-900">
                      {col.businessName}
                    </h3>
                    {col.isVerified && (
                      <span title="Background & Scale Verified">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Proprietor: <strong className="text-slate-700">{col.name}</strong>
                  </p>
                </div>

                <span className="font-mono text-xs font-bold text-[#3B1458] bg-purple-100 px-2.5 py-1 rounded-md">
                  {col.distanceKm} km away
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{col.locality}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Available slots: {col.availableSlots.join(', ')}</span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-800 font-medium pt-1">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Calibrated digital hanging scale attached</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
                  Accepted Categories:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {col.materialsAccepted.map((mat) => (
                    <span
                      key={mat}
                      className="text-xs text-slate-700 bg-stone-100 px-2 py-0.5 rounded-md font-medium"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-[#EADFD0] flex items-center gap-2">
              <button
                onClick={() => onCallCollector(col.phone, col.name)}
                className="h-11 px-3.5 rounded-xl border border-[#E0D5C3] hover:bg-stone-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Call Collector"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </button>

              <button
                onClick={() => onBookWithCollector(col)}
                className="flex-1 h-11 bg-amber-500 hover:bg-amber-400 text-[#240A39] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Book Pickup</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
