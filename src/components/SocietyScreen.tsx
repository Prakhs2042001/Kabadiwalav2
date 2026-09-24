import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  PlusCircle,
  Clock,
  ArrowRight,
  Scale,
  Award
} from 'lucide-react';
import { SocietyData } from '../types';

interface SocietyScreenProps {
  societyData: SocietyData;
  onBack: () => void;
  onScheduleSocietyPickup: (date: string, flats: number) => void;
}

export const SocietyScreen: React.FC<SocietyScreenProps> = ({
  societyData,
  onBack,
  onScheduleSocietyPickup
}) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Saturday, 3 Oct 2026');
  const [targetFlats, setTargetFlats] = useState(85);
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    onScheduleSocietyPickup(selectedDate, targetFlats);
    setScheduledSuccess(true);
    setTimeout(() => {
      setScheduledSuccess(false);
      setShowScheduleModal(false);
    }, 2000);
  };

  const totalCollectedKg =
    societyData.monthlyTotals.eWasteKg +
    societyData.monthlyTotals.paperKg +
    societyData.monthlyTotals.plasticKg +
    societyData.monthlyTotals.metalKg +
    (societyData.monthlyTotals.otherKg || 0);

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
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
                Bulk Generator Mode
              </span>
              <span className="text-xs text-slate-500 font-mono">· RWA Certified</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#240A39] tracking-tight mt-0.5">
              {societyData.societyName} Dashboard
            </h1>
          </div>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule Society Drive</span>
        </button>
      </div>

      {/* Society Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E0D5C3] rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Flats</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-display font-black text-3xl text-slate-900 tabular-nums">
            {societyData.totalFlats}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            {societyData.activeFlats} flats actively segregating
          </div>
        </div>

        <div className="bg-white border border-[#E0D5C3] rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Aggregated Scrap</span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-display font-black text-3xl text-[#240A39] tabular-nums">
            {totalCollectedKg} <span className="text-lg font-bold text-amber-600">kg</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">This quarter verified</div>
        </div>

        <div className="bg-white border border-[#E0D5C3] rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Handover Compliance</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-display font-black text-3xl text-emerald-800 tabular-nums">
            {societyData.monthlyTotals.documentedPercentage}%
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Zero-landfill compliance
          </div>
        </div>

        <div className="bg-white border border-[#E0D5C3] rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Treasury Earnings</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-display font-black text-3xl text-slate-900 tabular-nums">
            ₹{(totalCollectedKg * 22).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Direct to RWA Welfare Fund</div>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upcoming Collection Drive & RWA Highlights */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-gradient-to-br from-[#3B1458] to-[#25083a] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Upcoming Society Collection Drive</span>
            </div>

            <h3 className="font-display font-black text-2xl text-white">
              {societyData.upcomingPickup?.date || 'Sunday, 28 Sep'}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-white/10">
              <div>
                <span className="text-purple-200 block text-[11px]">Registered Flats:</span>
                <strong className="text-white text-base font-mono">
                  {societyData.upcomingPickup?.registeredFlats || 42} / {societyData.totalFlats}
                </strong>
              </div>
              <div>
                <span className="text-purple-200 block text-[11px]">Assigned Partner:</span>
                <strong className="text-white text-base">
                  {societyData.upcomingPickup?.collectorName || societyData.assignedCollectorName}
                </strong>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowScheduleModal(true)}
                className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-bold text-xs transition-colors"
              >
                Modify or Reschedule Drive
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#E0D5C3] rounded-3xl p-6 shadow-xs space-y-3">
            <h4 className="font-display font-bold text-base text-[#240A39]">
              RWA Bulk Generator Benefits
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Bulk Rate Tier: Society gets +5% bonus on metal and e-waste volumes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Quarterly Municipal Swachh ESG Certificate issued directly to the society office.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Calibrated industrial floor scale provided during weekend collection camps.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Category Breakdown */}
        <div className="lg:col-span-6 bg-white border border-[#E0D5C3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-900">
              Material Segregation Breakdown
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Total {totalCollectedKg} kg
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold pb-1.5">
                <span className="text-slate-700">Paper (Newspaper & Cartons)</span>
                <span className="text-slate-900 font-mono font-bold">{societyData.monthlyTotals.paperKg} kg</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '50%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold pb-1.5">
                <span className="text-slate-700">Plastic (Bottles & Containers)</span>
                <span className="text-slate-900 font-mono font-bold">{societyData.monthlyTotals.plasticKg} kg</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold pb-1.5">
                <span className="text-slate-700">E-Waste (Electronics & Batteries)</span>
                <span className="text-slate-900 font-mono font-bold">{societyData.monthlyTotals.eWasteKg} kg</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold pb-1.5">
                <span className="text-slate-700">Metal (Aluminium & Iron)</span>
                <span className="text-slate-900 font-mono font-bold">{societyData.monthlyTotals.metalKg} kg</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '11%' }} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950">
            Green Valley Society qualifies for the <strong className="text-purple-900">Zero Landfill Community Certificate</strong> under Swachh Bharat Urban 2026.
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E7DDCE] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Schedule Society Scrap Drive
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800 p-1"
              >
                Close
              </button>
            </div>

            {scheduledSuccess ? (
              <div className="py-6 text-center space-y-2 text-emerald-800">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600" />
                <div className="font-bold text-base">Pickup Scheduled Successfully!</div>
                <div className="text-xs text-slate-600">
                  Notification broadcast sent to all residents in {societyData.societyName}.
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmSchedule} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Select Collection Date
                  </label>
                  <input
                    type="text"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#FAF8F5] border border-[#E7DDCE] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B1458]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Expected Participating Households
                  </label>
                  <input
                    type="number"
                    value={targetFlats}
                    onChange={(e) => setTargetFlats(parseInt(e.target.value) || 0)}
                    className="w-full h-11 px-3.5 bg-[#FAF8F5] border border-[#E7DDCE] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B1458]"
                  />
                </div>

                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-purple-950 text-xs">
                  Assigned Team: <span className="font-bold">Raj Scrap & Swachh Shakti</span> with calibrated vehicle floor scales.
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-[#3B1458] hover:bg-[#4C1D95] text-amber-400 font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  Confirm & Broadcast to Residents
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
