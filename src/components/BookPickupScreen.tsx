import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Clock,
  Scale,
  ShieldCheck,
  Cpu,
  Newspaper,
  Layers,
  Wrench,
  Boxes,
  Navigation,
  Sparkles,
  IndianRupee,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Collector, MaterialRate, WasteCategory } from '../types';

interface BookPickupScreenProps {
  initialCategory?: WasteCategory;
  initialMaterialName?: string;
  collectors: Collector[];
  rates: MaterialRate[];
  onConfirmBooking: (bookingData: {
    wasteCategory: WasteCategory;
    subMaterial: string;
    approximateWeight: number;
    pickupAddress: string;
    timeSlot: string;
    selectedCollector: Collector;
    indicativeRate: number;
  }) => void;
  onCancel: () => void;
}

export const BookPickupScreen: React.FC<BookPickupScreenProps> = ({
  initialCategory = 'E-Waste',
  initialMaterialName = '',
  collectors,
  rates,
  onConfirmBooking,
  onCancel
}) => {
  // Step state: 1 to 6
  const [step, setStep] = useState<number>(1);

  // Form states
  const [category, setCategory] = useState<WasteCategory>(initialCategory);
  const [subMaterial, setSubMaterial] = useState<string>(initialMaterialName || '');
  const [approxWeight, setApproxWeight] = useState<number>(10);
  const [address, setAddress] = useState<string>('Flat 402, Shanti Vihar, Sector 14, Gurugram');
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState<boolean>(true);
  const [timeSlot, setTimeSlot] = useState<string>('1 PM – 4 PM');
  const [selectedCollectorId, setSelectedCollectorId] = useState<string>(collectors[0]?.id || '');

  // Category choices
  const categoryOptions: {
    category: WasteCategory;
    title: string;
    sub: string;
    icon: React.ElementType;
  }[] = [
    { category: 'Paper', title: 'Paper & Raddi', sub: 'Newspapers, cartons, books, magazines', icon: Newspaper },
    { category: 'Metal', title: 'Metal & Alloys', sub: 'Iron, aluminium, copper wire, brass', icon: Wrench },
    { category: 'E-Waste', title: 'E-Waste', sub: 'Phones, PCBs, cables, dead gadgets', icon: Cpu },
    { category: 'Plastic', title: 'Plastic & Bottles', sub: 'PET bottles, buckets, containers', icon: Layers },
    { category: 'Other', title: 'Batteries & Glass', sub: 'Lead batteries, glass bottles', icon: Boxes },
  ];

  // Preset weights
  const weightPresets = [5, 10, 20, 35, 50, 100];

  // 3-hour time slots
  const timeSlots = [
    { slot: '10 AM – 1 PM', label: 'Morning Slot' },
    { slot: '1 PM – 4 PM', label: 'Afternoon Slot' },
    { slot: '4 PM – 7 PM', label: 'Evening Slot' },
  ];

  // Filter collectors who accept the selected category
  const eligibleCollectors = collectors.filter((c) =>
    c.materialsAccepted.includes(category)
  );
  const displayCollectors = eligibleCollectors.length > 0 ? eligibleCollectors : collectors.slice(0, 3);

  const selectedCollector =
    collectors.find((c) => c.id === selectedCollectorId) || displayCollectors[0] || collectors[0];

  // Compute indicative rate for selected category
  const matchingRate = rates.find((r) => r.category === category);
  const indicativeRate = matchingRate ? matchingRate.indicativeRate : 25;
  const estimatedPayout = approxWeight * indicativeRate;

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onConfirmBooking({
        wasteCategory: category,
        subMaterial: subMaterial || `${category} Scrap Mix`,
        approximateWeight: approxWeight,
        pickupAddress: address,
        timeSlot,
        selectedCollector,
        indicativeRate
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Steps Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADFD0]">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-xl text-slate-700 hover:bg-stone-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
                Step {step} of 6
              </span>
              <span className="text-xs text-slate-500">· Doorstep Scrap Booking</span>
            </div>
            <h1 className="font-display font-black text-2xl text-[#240A39] tracking-tight mt-0.5">
              {step === 1 && '1. What type of scrap are you recycling?'}
              {step === 2 && '2. Approximate quantity estimate'}
              {step === 3 && '3. Doorstep pickup location'}
              {step === 4 && '4. Preferred 3-hour arrival slot'}
              {step === 5 && '5. Choose a verified neighborhood collector'}
              {step === 6 && '6. Review and confirm booking'}
            </h1>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-[#E0D5C3] hover:bg-stone-100 self-start sm:self-auto transition-colors"
        >
          Cancel Booking
        </button>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-[#EADFD0] h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-[#3B1458] h-full transition-all duration-300 rounded-full"
          style={{ width: `${(step / 6) * 100}%` }}
        />
      </div>

      {/* 2-Column Responsive Layout: Form on Left, Sticky Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Left Column: Current Step Input Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Waste Category */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Select the primary material for this pickup request. You can add more secondary materials at the doorstep with the collector.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = category === opt.category;
                  return (
                    <button
                      key={opt.category}
                      onClick={() => setCategory(opt.category)}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all min-h-[72px] active:scale-[0.99] ${
                        isSelected
                          ? 'bg-purple-50/80 border-[#3B1458] ring-2 ring-[#3B1458]/20 shadow-xs'
                          : 'bg-white border-[#E7DDCE] hover:bg-stone-50'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#3B1458] text-amber-400' : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-display font-bold text-sm text-slate-900">
                          {opt.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {opt.sub}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#3B1458] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Specific Sub-Material Input (Optional) */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Specific material or items (optional):
                </label>
                <input
                  type="text"
                  value={subMaterial}
                  onChange={(e) => setSubMaterial(e.target.value)}
                  placeholder="e.g., Old English newspapers, broken AC outdoor unit, copper wiring"
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E7DDCE] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B1458]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Approximate Quantity */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Enter an estimate in kilograms. The collector will weigh everything precisely on a certified digital scale at your doorstep.
              </p>

              <div className="bg-white rounded-2xl border border-[#E7DDCE] p-6 shadow-xs text-center space-y-4">
                <div className="text-slate-500 text-xs font-semibold">Estimated Weight</div>
                <div className="font-display font-black text-5xl text-[#240A39] tabular-nums">
                  {approxWeight} <span className="text-2xl font-bold text-amber-600">kg</span>
                </div>

                <div className="flex items-center gap-3 max-w-sm mx-auto">
                  <button
                    onClick={() => setApproxWeight((w) => Math.max(1, w - 1))}
                    className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-lg flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={approxWeight}
                    onChange={(e) => setApproxWeight(Number(e.target.value))}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <button
                    onClick={() => setApproxWeight((w) => w + 1)}
                    className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-lg flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-500 mb-2">Quick Presets:</div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {weightPresets.map((w) => (
                      <button
                        key={w}
                        onClick={() => setApproxWeight(w)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          approxWeight === w
                            ? 'bg-[#3B1458] text-white'
                            : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                        }`}
                      >
                        {w} kg
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Pickup Location */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Where should the verified collector arrive?
              </p>

              <div className="bg-white rounded-2xl border border-[#E7DDCE] p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <Navigation className="w-4 h-4 text-emerald-600" />
                    <span>GPS Sector 14, Gurugram (Detected)</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">Serviceable Zone</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Doorstep Address / Apartment / Landmark:
                  </label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DDCE] text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B1458]"
                    placeholder="Enter house/flat number, apartment name, street and pincode..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Preferred 3-Hour Slot */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Select a convenient 3-hour window for the collector to visit:
              </p>

              <div className="space-y-3">
                {timeSlots.map((ts) => {
                  const isSelected = timeSlot === ts.slot;
                  return (
                    <button
                      key={ts.slot}
                      onClick={() => setTimeSlot(ts.slot)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all min-h-[64px] active:scale-[0.99] ${
                        isSelected
                          ? 'bg-purple-50/80 border-[#3B1458] ring-2 ring-[#3B1458]/20 shadow-xs'
                          : 'bg-white border-[#E7DDCE] hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-[#3B1458] text-amber-400' : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{ts.slot}</div>
                          <div className="text-xs text-slate-500">{ts.label}</div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#3B1458] text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Choose Collector */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Compare verified collectors available in your sector:
              </p>

              <div className="space-y-3">
                {displayCollectors.map((col) => {
                  const isSelected = selectedCollectorId === col.id;
                  return (
                    <div
                      key={col.id}
                      onClick={() => setSelectedCollectorId(col.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50/80 border-[#3B1458] ring-2 ring-[#3B1458]/20 shadow-sm'
                          : 'bg-white border-[#E7DDCE] hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-slate-900">{col.businessName}</span>
                            {col.isVerified && (
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Partner: <span className="font-medium text-slate-700">{col.name}</span>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-[#3B1458] bg-purple-100 px-2 py-0.5 rounded-md font-mono">
                          {col.distanceKm} km away
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span>Accepted: {col.materialsAccepted.join(' · ')}</span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Scale className="w-3.5 h-3.5" />
                          <span>Calibrated Scale Guaranteed</span>
                        </span>

                        {isSelected && (
                          <span className="text-xs font-bold text-[#3B1458] flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Selected
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Review & Final Confirmation */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#E7DDCE] p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-md inline-flex">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Ready for Confirmation</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Category:</span>
                    <strong className="text-slate-900 text-sm">{category}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Quantity:</span>
                    <strong className="text-slate-900 text-sm font-mono">{approxWeight} kg (Approx)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Time Window:</span>
                    <strong className="text-slate-900 text-sm">{timeSlot}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Selected Partner:</span>
                    <strong className="text-slate-900 text-sm">{selectedCollector.businessName}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800 block mb-0.5">Pickup Address:</span>
                  {address}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleNext}
              className="flex-1 h-12 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-[#240A39] font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>{step === 6 ? 'Confirm & Schedule Pickup' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Sticky Live Booking Summary & Guarantee Card */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white border border-[#E0D5C3] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-[#240A39] border-b border-[#EADFD0] pb-3">
              Booking Overview
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Selected Material:</span>
                <span className="font-bold text-slate-900">{category}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Indicative Benchmark Rate:</span>
                <span className="font-mono font-bold text-[#240A39]">₹{indicativeRate}/kg</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Estimated Quantity:</span>
                <span className="font-mono font-bold text-slate-900">{approxWeight} kg</span>
              </div>

              <div className="pt-3 border-t border-dashed border-[#EADFD0] flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[11px]">Projected Payout</span>
                  <span className="font-display font-black text-2xl text-[#240A39] tabular-nums">
                    ₹{estimatedPayout}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono text-right max-w-[120px]">
                  Confirmed on digital scale at doorstep
                </span>
              </div>
            </div>

            {/* Scale Guarantee Badge */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Scale className="w-4 h-4 text-amber-800" />
                <span>Calibrated Digital Scale Guarantee</span>
              </div>
              <p className="text-[11px] text-amber-900/90 leading-relaxed">
                Zero arbitrary weight deductions. If you notice any scale discrepancy, you can cancel at zero cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
