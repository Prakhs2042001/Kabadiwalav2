import React from 'react';
import {
  X,
  MapPin,
  ShieldCheck,
  Truck,
  Clock,
  Phone,
  Building2,
  Calendar,
  Star,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Kabadiwala } from '../../types';

interface KabadiwalaProfileModalProps {
  kabadiwala: Kabadiwala | null;
  onClose: () => void;
  onSchedulePickup: (kabadiwala: Kabadiwala) => void;
}

export const KabadiwalaProfileModal: React.FC<KabadiwalaProfileModalProps> = ({
  kabadiwala,
  onClose,
  onSchedulePickup
}) => {
  if (!kabadiwala) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E0D5C3] shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#240A39] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Kabadiwala</span>
            </span>
          </div>

          <h2 className="font-display font-black text-2xl text-white tracking-tight">
            {kabadiwala.business_name}
          </h2>
          <p className="text-xs text-purple-200 mt-1">
            Proprietor: {kabadiwala.owner_name} · Service Radius: {kabadiwala.service_radius} km
          </p>

          <div className="flex items-center gap-3 mt-3 text-xs text-amber-300 font-mono">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>📍 {kabadiwala.distance_km || 1.8} km away</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{kabadiwala.rating} ({kabadiwala.review_count} reviews)</span>
            </span>
          </div>
        </div>

        {/* Body (Section 10 Requirements) */}
        <div className="p-6 space-y-5 bg-[#FAF8F5] text-xs text-slate-700">
          {/* Partner Warehouse Link */}
          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 flex items-center gap-2.5 text-purple-950">
            <Building2 className="w-4 h-4 text-[#240A39] shrink-0" />
            <div>
              <span className="font-bold">Connected Partner Warehouse: </span>
              <span className="font-mono text-[11px]">{kabadiwala.warehouse_name || 'Asansol Central Hub'}</span>
            </div>
          </div>

          {/* Waste Accepted */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
              Waste Accepted
            </div>
            <div className="flex flex-wrap gap-2">
              {kabadiwala.waste_categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E0D5C3] font-bold text-slate-800 flex items-center gap-1 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{cat}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Current Rates List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="font-bold text-slate-900 uppercase tracking-wider">
                Current Buying Rates
              </span>
              <span className="text-slate-500">
                Rate Updated: 24 September 2026 ({kabadiwala.rates[0]?.updated_ago_text || '2 hours ago'})
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-[#E0D5C3] divide-y divide-slate-100 overflow-hidden shadow-2xs">
              {kabadiwala.rates.map((rate) => (
                <div key={rate.rate_id} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{rate.category}</div>
                    <div className="text-[11px] text-slate-500">{rate.sub_category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-black text-base text-[#240A39]">
                      ₹{rate.rate_per_kg}/kg
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Active Rate</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup & Operating Hours */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E0D5C3] space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">
                Pickup Service
              </span>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>{kabadiwala.pickup_available ? '🚚 Available' : 'Walk-in only'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E0D5C3] space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">
                Operating Hours
              </span>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{kabadiwala.operating_hours}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E0D5C3] space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">
              Shop / Scrap Yard Location
            </span>
            <div className="text-slate-800 leading-relaxed font-medium">
              {kabadiwala.address}, {kabadiwala.area}, {kabadiwala.city} — {kabadiwala.pin_code}
            </div>
          </div>

          {/* Schedule Pickup CTA */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onSchedulePickup(kabadiwala);
              }}
              className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <span>Schedule Pickup with {kabadiwala.business_name}</span>
              <ArrowRight className="w-4 h-4 text-[#240A39]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
