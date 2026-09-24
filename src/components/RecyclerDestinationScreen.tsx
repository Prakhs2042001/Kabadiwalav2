import React from 'react';
import {
  ArrowLeft,
  Recycle,
  Building2,
  Truck,
  Home,
  ShieldCheck,
  ChevronRight,
  Factory,
  Sparkles,
  MapPin,
  CheckCircle2,
  CalendarPlus
} from 'lucide-react';
import { RecyclerDestination } from '../types';

interface RecyclerDestinationScreenProps {
  recyclers: RecyclerDestination[];
  onBack: () => void;
  onBookPickup: () => void;
}

export const RecyclerDestinationScreen: React.FC<RecyclerDestinationScreenProps> = ({
  recyclers,
  onBack,
  onBookPickup
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Bar / Header */}
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
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
                End-to-End Custody
              </span>
              <span className="text-xs text-slate-500 font-mono">· CPCB Rule Verified</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#240A39] tracking-tight mt-0.5">
              Where Does Your Scrap Really Go?
            </h1>
          </div>
        </div>

        <button
          onClick={onBookPickup}
          className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Book a Doorstep Pickup</span>
        </button>
      </div>

      {/* Hero Visual Banner with Industrial Facility Image */}
      <div className="rounded-3xl overflow-hidden shadow-lg border border-[#E0D5C3] relative aspect-[21/9] bg-stone-900">
        <img
          src="/src/assets/images/industrial_recycling_plant_1790222530077.jpg"
          alt="Authorized industrial secondary raw materials processing facility"
          className="w-full h-full object-cover opacity-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b052d]/90 via-[#1b052d]/40 to-transparent pointer-events-none" />

        <div className="absolute bottom-6 left-6 right-6 text-white max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero Open-Burning · 100% Documented Recycling</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Transforming urban discards into secondary industrial raw materials
          </h2>
          <p className="text-xs sm:text-sm text-purple-200">
            Every transaction generates a digital chain of custody that binds the neighborhood kabadiwala to certified smelting, pulping, and polymer re-extrusion plants.
          </p>
        </div>
      </div>

      {/* 4-Stage Traceability Flowchart */}
      <div className="bg-white border border-[#E0D5C3] rounded-3xl p-8 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800">
            Chain of Custody
          </span>
          <h3 className="font-display font-bold text-xl text-[#240A39] mt-1">
            4-Stage Material Handover Lifecycle
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Stage 1 */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-[#E7DDCE] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3B1458] text-amber-400 mx-auto flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <div className="font-display font-bold text-sm text-slate-900">1. Household / Flat</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Resident segregates scrap, checks live rates, and books a pickup.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-[#E7DDCE] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3B1458] text-amber-400 mx-auto flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div className="font-display font-bold text-sm text-slate-900">2. Verified Collector</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Doorstep digital weighing with photo proof and dual OTP payout confirmation.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-[#E7DDCE] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3B1458] text-amber-400 mx-auto flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="font-display font-bold text-sm text-slate-900">3. Ward Aggregator</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Materials sorted by grade, baled, and compiled into bulk shipment manifests.
            </p>
          </div>

          {/* Stage 4 */}
          <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center">
              <Factory className="w-6 h-6" />
            </div>
            <div className="font-display font-bold text-sm text-[#240A39]">4. Certified Recycler</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Industrial reprocessing into certified ingots, pulp rolls, and polymer granules.
            </p>
          </div>
        </div>
      </div>

      {/* Recyclers Grid */}
      <div>
        <h3 className="font-display font-bold text-xl text-[#240A39] mb-4">
          CPCB-Registered Partner Facilities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recyclers.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-3xl border border-[#E0D5C3] shadow-sm p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {facility.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{facility.state}</span>
                </div>

                <h4 className="font-display font-bold text-base text-slate-900">
                  {facility.name}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{facility.location}</span>
                </div>

                <div className="pt-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700 block mb-0.5">Monthly Processing Capacity:</span>
                  <span className="font-mono font-bold text-[#240A39]">{facility.capacityMonthly}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Process: </strong>
                  {facility.processDescription}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>CPCB Registry: Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
