import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  Scale,
  Building2,
  AlertCircle,
  TrendingUp,
  XCircle,
  Phone,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { Kabadiwala, Pickup, PickupStatus } from '../../types';
import { api } from '../../services/api';

interface KabadiwalaDashboardProps {
  kabadiwala: Kabadiwala;
  pickups: Pickup[];
  onUpdatePickupStatus: (
    pickupId: string,
    newStatus: PickupStatus,
    actualKg?: number,
    finalAmount?: number
  ) => void;
  onUpdateRates?: (updatedKabadiwala: Kabadiwala) => void;
}

export const KabadiwalaDashboard: React.FC<KabadiwalaDashboardProps> = ({
  kabadiwala,
  pickups,
  onUpdatePickupStatus
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'active' | 'rates' | 'history'>('requests');
  const [settlingPickup, setSettlingPickup] = useState<Pickup | null>(null);
  const [actualWeightInput, setActualWeightInput] = useState<number>(0);

  // Filter pickups assigned to this kabadiwala
  const myPickups = pickups.filter((p) => p.kabadiwala_id === kabadiwala.kabadiwala_id);

  const pendingRequests = myPickups.filter((p) => p.status === 'Requested');
  const acceptedPickups = myPickups.filter((p) => p.status === 'Accepted');
  const onTheWayPickups = myPickups.filter((p) => p.status === 'On the Way');
  const completedPickups = myPickups.filter((p) => p.status === 'Completed');

  const totalCollectedKg = completedPickups.reduce(
    (sum, p) => sum + (p.actual_weight || p.estimated_weight),
    0
  );
  const totalPayoutDisbursed = completedPickups.reduce(
    (sum, p) => sum + (p.final_amount || p.estimated_value),
    0
  );

  const handleStartSettlement = (pickup: Pickup) => {
    setSettlingPickup(pickup);
    setActualWeightInput(pickup.estimated_weight);
  };

  const handleCompleteHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlingPickup) return;

    // Calculate proportional final amount based on actual weighed weight
    const ratio = actualWeightInput / (settlingPickup.estimated_weight || 1);
    const calculatedFinal = Math.round(settlingPickup.estimated_value * ratio);

    try {
      const numericId = parseInt(settlingPickup.pickup_id.replace(/\D/g, '')) || 1;
      await api.completePickup(
        numericId,
        settlingPickup.items.map((it, idx) => ({
          id: idx + 1,
          actualWeight: actualWeightInput / settlingPickup.items.length,
          finalRate: it.rate_per_kg,
        })),
        'UPI',
        'Weighed via digital scale at doorstep.'
      );
    } catch (err) {
      console.warn('API completion log:', err);
    }

    onUpdatePickupStatus(
      settlingPickup.pickup_id,
      'Completed',
      actualWeightInput,
      calculatedFinal
    );

    setSettlingPickup(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#240A39] rounded-3xl p-6 sm:p-8 text-white border border-[#E0D5C3] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Kabadiwala Business Portal</span>
            </span>
            <span className="text-xs text-purple-200 font-mono">
              · ID: {kabadiwala.kabadiwala_id}
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            {kabadiwala.business_name}
          </h1>
          <p className="text-xs text-purple-200">
            Proprietor: <strong className="text-white">{kabadiwala.owner_name}</strong> · Phone: {kabadiwala.phone}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-purple-200">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{kabadiwala.area}, {kabadiwala.city} (Radius: {kabadiwala.service_radius} km)</span>
            </span>
            <span>·</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{kabadiwala.verification_status} by {kabadiwala.warehouse_name}</span>
            </span>
          </div>
        </div>

        {/* Quick Operating Status Pill */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-center sm:text-right space-y-1">
          <span className="text-[11px] font-mono uppercase text-purple-300 block">Pickup Readiness</span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Active & Accepting Doorstep Requests</span>
          </div>
        </div>
      </div>

      {/* Metrics Row (Section 13: Today's pickups, pending, accepted, completed, scrap collected) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-[#E0D5C3] shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Pending Requests</span>
          <div className="font-display font-black text-3xl text-amber-600 mt-1 tabular-nums">
            {pendingRequests.length}
          </div>
          <div className="text-[10px] text-amber-700 font-bold mt-1">Needs confirmation</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E0D5C3] shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Accepted Pickups</span>
          <div className="font-display font-black text-3xl text-purple-900 mt-1 tabular-nums">
            {acceptedPickups.length}
          </div>
          <div className="text-[10px] text-purple-700 font-bold mt-1">Scheduled slots</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E0D5C3] shadow-xs">
          <span className="text-xs text-slate-500 font-medium">On The Way</span>
          <div className="font-display font-black text-3xl text-blue-600 mt-1 tabular-nums">
            {onTheWayPickups.length}
          </div>
          <div className="text-[10px] text-blue-700 font-bold mt-1">En route to household</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E0D5C3] shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Completed Pickups</span>
          <div className="font-display font-black text-3xl text-emerald-800 mt-1 tabular-nums">
            {completedPickups.length}
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-1">Verified handovers</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E0D5C3] shadow-xs col-span-2 lg:col-span-1">
          <span className="text-xs text-slate-500 font-medium">Total Scrap Collected</span>
          <div className="font-display font-black text-2xl text-[#240A39] mt-1 tabular-nums">
            {totalCollectedKg.toFixed(1)} <span className="text-xs text-slate-500">kg</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            Paid: ₹{totalPayoutDisbursed}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E0D5C3] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'requests'
              ? 'bg-[#240A39] text-amber-400 shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
          }`}
        >
          Incoming Requests ({pendingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'active'
              ? 'bg-[#240A39] text-amber-400 shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
          }`}
        >
          Active Schedule ({acceptedPickups.length + onTheWayPickups.length})
        </button>

        <button
          onClick={() => setActiveTab('rates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'rates'
              ? 'bg-[#240A39] text-amber-400 shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
          }`}
        >
          My Buying Rates & Categories ({kabadiwala.rates.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'history'
              ? 'bg-[#240A39] text-amber-400 shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
          }`}
        >
          Completed Records ({completedPickups.length})
        </button>
      </div>

      {/* Tab Content 1: Incoming Pickup Requests (Section 14) */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-xl text-slate-900">
              New Pickup Requests
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Requests received from households within your {kabadiwala.service_radius} km service radius
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingRequests.map((req) => (
              <div
                key={req.pickup_id}
                className="bg-white rounded-3xl border-2 border-amber-300 p-6 shadow-sm space-y-4 relative"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                      New Booking Request #{req.pickup_id}
                    </span>
                    <h3 className="font-display font-black text-xl text-slate-900 mt-1.5">
                      Customer: {req.household_name}
                    </h3>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      Phone: {req.household_phone}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-mono">Est. Payout</span>
                    <span className="font-display font-black text-2xl text-[#240A39]">
                      ₹{req.estimated_value}
                    </span>
                  </div>
                </div>

                {/* Distance and Address */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E0D5C3] text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center gap-1 text-purple-900">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>📍 1.2 km away ({req.area})</span>
                    </span>
                    <span className="text-amber-800 font-mono">Slot: {req.scheduled_date}</span>
                  </div>
                  <div className="text-slate-600 truncate">{req.pickup_address}</div>
                </div>

                {/* Waste items */}
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-700">Requested Scrap Items:</span>
                  <div className="flex flex-wrap gap-2">
                    {req.items.map((it) => (
                      <span
                        key={it.category}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 font-mono text-slate-800 font-semibold"
                      >
                        {it.category} ({it.estimated_kg} kg) @ ₹{it.rate_per_kg}/kg
                      </span>
                    ))}
                  </div>
                </div>

                {req.special_instructions && (
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-950 text-[11px]">
                    <span className="font-bold">Household Note: </span>
                    {req.special_instructions}
                  </div>
                )}

                {/* Action Buttons Required by Section 14 */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => onUpdatePickupStatus(req.pickup_id, 'Cancelled')}
                    className="h-11 rounded-xl border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-50 transition-colors"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => onUpdatePickupStatus(req.pickup_id, 'Accepted')}
                    className="h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-black text-xs shadow-xs transition-colors"
                  >
                    Accept Pickup
                  </button>
                </div>
              </div>
            ))}

            {pendingRequests.length === 0 && (
              <div className="col-span-2 bg-white rounded-3xl p-12 border border-[#E0D5C3] text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  All Caught Up!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  There are no pending unaccepted pickup requests right now. New neighborhood requests will automatically appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 2: Active Schedule (Accepted & On The Way) */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          <h2 className="font-display font-black text-xl text-slate-900">
            Active Scheduled Pickups
          </h2>

          <div className="space-y-4">
            {[...acceptedPickups, ...onTheWayPickups].map((p) => (
              <div
                key={p.pickup_id}
                className="bg-white rounded-3xl border border-[#E0D5C3] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#240A39]">
                      #{p.pickup_id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                        p.status === 'On the Way'
                          ? 'bg-blue-100 text-blue-900 animate-pulse'
                          : 'bg-purple-100 text-purple-900'
                      }`}
                    >
                      Status: {p.status}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-lg text-slate-900">
                    {p.household_name} · {p.household_phone}
                  </h3>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    📍 {p.pickup_address}
                  </div>
                  <div className="text-xs text-slate-700 font-mono">
                    Time: {p.scheduled_date} ({p.time_slot}) · Est: {p.estimated_weight} kg
                  </div>
                </div>

                {/* Progress Transitions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  {p.status === 'Accepted' && (
                    <button
                      onClick={() => onUpdatePickupStatus(p.pickup_id, 'On the Way')}
                      className="w-full sm:w-auto h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Mark "On The Way"</span>
                    </button>
                  )}

                  {p.status === 'On the Way' && (
                    <button
                      onClick={() => handleStartSettlement(p)}
                      className="w-full sm:w-auto h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Scale className="w-4 h-4" />
                      <span>Weigh Scrap & Complete Handover</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {acceptedPickups.length === 0 && onTheWayPickups.length === 0 && (
              <div className="bg-white rounded-3xl p-10 border border-[#E0D5C3] text-center text-xs text-slate-500">
                No active pickups scheduled. Accept an incoming request to start your route.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 3: Rates & Waste Categories (Section 14) */}
      {activeTab === 'rates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-black text-xl text-slate-900">
                Current Buying Rates & Categories
              </h2>
              <p className="text-xs text-slate-500">
                Data provided by Partner Warehouse: <strong className="text-slate-800">{kabadiwala.warehouse_name}</strong>
              </p>
            </div>

            <div className="text-xs font-mono text-slate-600 bg-stone-100 px-3 py-1.5 rounded-xl">
              Rate Managed By: {kabadiwala.rate_managed_by === 'warehouse' ? 'Partner Warehouse' : 'Self-Adjusted'}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E0D5C3] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#240A39] text-white uppercase font-mono tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">Sub-Category</th>
                    <th className="py-3.5 px-4 font-bold">Active Rate</th>
                    <th className="py-3.5 px-4 font-bold">Last Updated</th>
                    <th className="py-3.5 px-4 font-bold">Verification Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {kabadiwala.rates.map((rate) => (
                    <tr key={rate.rate_id} className="hover:bg-amber-50/40">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {rate.category}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {rate.sub_category}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-base text-[#240A39]">
                        ₹{rate.rate_per_kg} / kg
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {rate.updated_ago_text || 'Today'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Warehouse Benchmarked</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Completed Records History */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <h2 className="font-display font-black text-xl text-slate-900">
            Completed Pickup History
          </h2>

          <div className="bg-white rounded-3xl border border-[#E0D5C3] divide-y divide-slate-100 overflow-hidden shadow-xs">
            {completedPickups.map((p) => (
              <div key={p.pickup_id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#240A39]">
                      #{p.pickup_id}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Settled ✓
                    </span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 mt-1">
                    {p.household_name} · {p.area}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Weighed: {p.actual_weight} kg · Scheduled: {p.scheduled_date}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Amount Paid</div>
                  <div className="font-mono font-black text-xl text-emerald-800">
                    ₹{p.final_amount}
                  </div>
                </div>
              </div>
            ))}

            {completedPickups.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">
                No completed pickups recorded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Weigh Scrap & Complete Handover Modal */}
      {settlingPickup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#E0D5C3] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-purple-900">
                  Doorstep Settlement
                </span>
                <h3 className="font-display font-black text-lg text-slate-900">
                  Weigh & Handover Verification
                </h3>
              </div>
              <button
                onClick={() => setSettlingPickup(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <div>Customer: <strong>{settlingPickup.household_name}</strong></div>
              <div>Estimated Weight: <strong>{settlingPickup.estimated_weight} kg</strong></div>
              <div>Estimated Payout: <strong>₹{settlingPickup.estimated_value}</strong></div>
            </div>

            <form onSubmit={handleCompleteHandover} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Actual Digital Scale Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={actualWeightInput}
                  onChange={(e) => setActualWeightInput(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full h-11 px-3 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] font-mono font-bold text-slate-900 text-sm focus:ring-2 focus:ring-[#240A39]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex justify-between items-center">
                <span>Calculated Final Payout:</span>
                <strong className="font-mono text-lg text-[#240A39]">
                  ₹{Math.round(settlingPickup.estimated_value * (actualWeightInput / (settlingPickup.estimated_weight || 1)))}
                </strong>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Confirm Weighing & Settle Pickup
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
