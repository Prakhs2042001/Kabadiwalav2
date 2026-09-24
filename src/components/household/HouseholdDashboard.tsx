import React, { useState } from 'react';
import {
  Package,
  Calendar,
  Clock,
  MapPin,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Receipt,
  Scale,
  Building2,
  XCircle
} from 'lucide-react';
import { Pickup, PickupStatus, Kabadiwala } from '../../types';

interface HouseholdDashboardProps {
  pickups: Pickup[];
  nearbyKabadiwalasCount: number;
  onFindKabadiwalas: () => void;
  onCancelPickup: (pickupId: string) => void;
  onViewKabadiwalaProfile: (kabadiwalaId: string) => void;
}

export const HouseholdDashboard: React.FC<HouseholdDashboardProps> = ({
  pickups,
  nearbyKabadiwalasCount,
  onFindKabadiwalas,
  onCancelPickup,
  onViewKabadiwalaProfile
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  // Compute metrics for Section 12
  const upcomingPickups = pickups.filter(
    (p) => p.status === 'Requested' || p.status === 'Accepted' || p.status === 'On the Way'
  );
  const completedPickups = pickups.filter((p) => p.status === 'Completed');
  const totalScrapSoldKg = completedPickups.reduce(
    (sum, p) => sum + (p.actual_weight || p.estimated_weight),
    0
  );
  const totalEarnings = completedPickups.reduce(
    (sum, p) => sum + (p.final_amount || p.estimated_value),
    0
  );

  const filteredPickups = pickups.filter((p) => {
    if (activeTab === 'active') {
      return p.status !== 'Completed' && p.status !== 'Cancelled';
    }
    if (activeTab === 'completed') {
      return p.status === 'Completed';
    }
    return true;
  });

  const getStatusColor = (status: PickupStatus) => {
    switch (status) {
      case 'Requested':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Accepted':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'On the Way':
        return 'bg-blue-100 text-blue-900 border-blue-300 animate-pulse';
      case 'Picked Up':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  const getStatusStepIndex = (status: PickupStatus) => {
    const sequence: PickupStatus[] = ['Requested', 'Accepted', 'On the Way', 'Picked Up', 'Completed'];
    return sequence.indexOf(status);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0D5C3]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
              Resident Dashboard
            </span>
            <span className="text-xs text-slate-500 font-mono">· Account: Rahul Verma</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#240A39] tracking-tight mt-0.5">
            My Dashboard
          </h1>
        </div>

        <button
          onClick={onFindKabadiwalas}
          className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <MapPin className="w-4 h-4" />
          <span>Find Nearby Kabadiwalas</span>
        </button>
      </div>

      {/* 4 Cards Required by Section 12 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Nearby Kabadiwalas */}
        <div className="bg-white rounded-3xl p-6 border border-[#E0D5C3] shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Nearby Kabadiwalas</span>
            <div className="font-display font-black text-3xl text-[#240A39] tabular-nums">
              {nearbyKabadiwalasCount}
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold pt-2 border-t border-slate-100 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active in service radius</span>
          </div>
        </div>

        {/* Card 2: Upcoming Pickup */}
        <div className="bg-white rounded-3xl p-6 border border-[#E0D5C3] shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Upcoming Pickups</span>
            <div className="font-display font-black text-3xl text-amber-600 tabular-nums">
              {upcomingPickups.length}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-mono truncate">
            {upcomingPickups[0] ? `${upcomingPickups[0].time_slot}` : 'No pending bookings'}
          </div>
        </div>

        {/* Card 3: Completed Pickups */}
        <div className="bg-white rounded-3xl p-6 border border-[#E0D5C3] shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Completed Pickups</span>
            <div className="font-display font-black text-3xl text-emerald-800 tabular-nums">
              {completedPickups.length}
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold pt-2 border-t border-slate-100">
            100% digital weight verified
          </div>
        </div>

        {/* Card 4: Total Scrap Sold */}
        <div className="bg-white rounded-3xl p-6 border border-[#E0D5C3] shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Total Scrap Sold</span>
            <div className="font-display font-black text-3xl text-[#240A39] tabular-nums">
              {totalScrapSoldKg.toFixed(1)} <span className="text-lg font-bold text-slate-500">kg</span>
            </div>
          </div>
          <div className="text-[11px] text-[#240A39] font-bold pt-2 border-t border-slate-100 flex items-center justify-between font-mono">
            <span>Total Earned:</span>
            <span>₹{totalEarnings}</span>
          </div>
        </div>
      </div>

      {/* Pickups Timeline & Management Section */}
      <div className="bg-white rounded-3xl border border-[#E0D5C3] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-display font-black text-xl text-slate-900">
              My Scrap Pickups & Handovers
            </h2>
            <p className="text-xs text-slate-500">
              Track requests through the 5 stages: Requested → Accepted → On the Way → Picked Up → Completed.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#FAF8F5] p-1 rounded-xl border border-[#E0D5C3]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all' ? 'bg-[#240A39] text-white' : 'text-slate-600'
              }`}
            >
              All ({pickups.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'active' ? 'bg-[#240A39] text-white' : 'text-slate-600'
              }`}
            >
              Active ({upcomingPickups.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'completed' ? 'bg-[#240A39] text-white' : 'text-slate-600'
              }`}
            >
              Completed ({completedPickups.length})
            </button>
          </div>
        </div>

        {/* Pickup List */}
        <div className="space-y-6">
          {filteredPickups.map((p) => {
            const currentStepIdx = getStatusStepIndex(p.status);
            const stages: PickupStatus[] = ['Requested', 'Accepted', 'On the Way', 'Picked Up', 'Completed'];

            return (
              <div
                key={p.pickup_id}
                className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E0D5C3] space-y-5"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#240A39]">
                        #{p.pickup_id}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStatusColor(
                          p.status
                        )}`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <div className="font-display font-black text-lg text-slate-900">
                      Collector: {p.kabadiwala_name}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-500">
                      {p.status === 'Completed' ? 'Final Payment' : 'Estimated Value'}:
                    </div>
                    <div className="font-display font-black text-2xl text-[#240A39]">
                      ₹{p.final_amount || p.estimated_value}
                    </div>
                  </div>
                </div>

                {/* Visual 5-Stage Timeline Bar (Section 12 requirement) */}
                {p.status !== 'Cancelled' && (
                  <div className="py-2">
                    <div className="grid grid-cols-5 gap-1 text-center">
                      {stages.map((stageName, idx) => {
                        const isDone = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;

                        return (
                          <div key={stageName} className="space-y-1.5">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isCurrent
                                  ? 'bg-amber-500'
                                  : isDone
                                  ? 'bg-[#240A39]'
                                  : 'bg-stone-200'
                              }`}
                            />
                            <div
                              className={`text-[10px] font-bold ${
                                isCurrent
                                  ? 'text-amber-700'
                                  : isDone
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {stageName}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-200/80">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase font-bold">
                      Scheduled Window
                    </span>
                    <span className="font-bold text-slate-800">
                      {p.scheduled_date} ({p.time_slot})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase font-bold">
                      Scrap Items
                    </span>
                    <span className="font-medium text-slate-800">
                      {p.items.map((it) => `${it.category} (~${it.estimated_kg}kg)`).join(', ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase font-bold">
                      Pickup Address
                    </span>
                    <span className="font-medium text-slate-800 truncate block" title={p.pickup_address}>
                      {p.pickup_address}
                    </span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                  <div className="text-[11px] text-slate-500 font-mono">
                    Collector Contact: {p.kabadiwala_phone}
                  </div>

                  <div className="flex items-center gap-2">
                    {p.status === 'Requested' && (
                      <button
                        onClick={() => onCancelPickup(p.pickup_id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-50"
                      >
                        Cancel Pickup
                      </button>
                    )}

                    <button
                      onClick={() => onViewKabadiwalaProfile(p.kabadiwala_id)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E0D5C3] text-slate-700 font-bold text-xs hover:bg-stone-100"
                    >
                      View Kabadiwala
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredPickups.length === 0 && (
            <div className="text-center py-10 space-y-3">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-500">No pickups found in this view.</div>
              <button
                onClick={onFindKabadiwalas}
                className="h-10 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-bold text-xs"
              >
                Schedule Your First Pickup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
