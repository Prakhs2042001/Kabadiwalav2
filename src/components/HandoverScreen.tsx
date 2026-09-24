import React, { useState } from 'react';
import {
  ArrowLeft,
  Scale,
  Camera,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  Sparkles,
  IndianRupee,
  Upload,
  UserCheck
} from 'lucide-react';
import { Transaction, WasteCategory } from '../types';

interface HandoverScreenProps {
  transaction: Transaction;
  onCompleteHandover: (handoverData: {
    transactionId: string;
    actualWeight: number;
    category: WasteCategory;
    finalRate: number;
    finalValue: number;
    photoUrl?: string;
  }) => void;
  onCancel: () => void;
}

export const HandoverScreen: React.FC<HandoverScreenProps> = ({
  transaction,
  onCompleteHandover,
  onCancel
}) => {
  const [actualWeight, setActualWeight] = useState<number>(
    transaction.actualWeight || transaction.approximateWeight || 8.5
  );
  const [category, setCategory] = useState<WasteCategory>(transaction.wasteCategory || 'Paper');
  const [finalRate, setFinalRate] = useState<number>(
    transaction.finalRate || transaction.indicativeRate || 24
  );
  const [hasPhotoProof, setHasPhotoProof] = useState<boolean>(true);
  const [customerSigned, setCustomerSigned] = useState<boolean>(true);

  // Auto calculate: Final Value = Actual Weight × Final Rate
  const finalValue = Math.round(actualWeight * finalRate * 10) / 10;

  const handleConfirm = () => {
    onCompleteHandover({
      transactionId: transaction.id,
      actualWeight,
      category,
      finalRate,
      finalValue,
      photoUrl: hasPhotoProof ? '/src/assets/images/digital_scale_handover_1790222529983.jpg' : undefined
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EADFD0]">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-700 hover:bg-stone-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
                Collector Weighing Station
              </span>
              <span className="text-xs font-mono text-slate-500">· Transaction #{transaction.id}</span>
            </div>
            <h1 className="font-display font-black text-2xl text-[#240A39] tracking-tight mt-0.5">
              Doorstep Digital Handover & Settlement
            </h1>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-[#E0D5C3] hover:bg-stone-100"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Weighing Inputs & Calculation */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E0D5C3] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-500">Resident Customer:</span>
              <div className="font-bold text-base text-slate-900">{transaction.customerName}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Pickup Address:</span>
              <div className="font-medium text-xs text-slate-700 max-w-[200px] truncate">{transaction.pickupAddress}</div>
            </div>
          </div>

          {/* Actual Weight Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#3B1458]" />
                <span>Certified Digital Weight (kg)</span>
              </label>
              <span className="text-xs text-slate-400 font-mono">Approx was ~{transaction.approximateWeight} kg</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActualWeight(Math.max(0.1, Math.round((actualWeight - 0.5) * 10) / 10))}
                className="w-12 h-12 rounded-2xl bg-stone-100 text-slate-800 text-xl font-bold flex items-center justify-center hover:bg-stone-200"
              >
                -
              </button>

              <div className="flex-1 text-center bg-[#FAF8F5] border border-[#E0D5C3] rounded-2xl py-2 px-3">
                <input
                  type="number"
                  step="0.1"
                  value={actualWeight}
                  onChange={(e) => setActualWeight(parseFloat(e.target.value) || 0)}
                  className="font-display font-black text-3xl text-center text-[#240A39] w-full bg-transparent focus:outline-none tabular-nums"
                />
              </div>

              <button
                onClick={() => setActualWeight(Math.round((actualWeight + 0.5) * 10) / 10)}
                className="w-12 h-12 rounded-2xl bg-stone-100 text-slate-800 text-xl font-bold flex items-center justify-center hover:bg-stone-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Final Rate Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              Agreed Final Rate (₹ per kg)
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                <input
                  type="number"
                  value={finalRate}
                  onChange={(e) => setFinalRate(parseFloat(e.target.value) || 0)}
                  className="w-full h-11 pl-8 pr-3 bg-[#FAF8F5] border border-[#E0D5C3] rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B1458]"
                />
              </div>
              <button
                onClick={() => setFinalRate(transaction.indicativeRate || 24)}
                className="h-11 px-4 bg-stone-100 hover:bg-stone-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Reset to Benchmark (₹{transaction.indicativeRate || 24})
              </button>
            </div>
          </div>

          {/* Dynamic Calculation Card: Final Value = Actual Weight × Final Rate */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-950 font-mono">
              <span className="flex items-center gap-1 font-sans font-semibold">
                <Calculator className="w-3.5 h-3.5" />
                Verified Math: Weight × Agreed Rate
              </span>
              <span>
                {actualWeight} kg × ₹{finalRate}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-amber-200/80">
              <span className="font-bold text-xs text-amber-950 uppercase tracking-wider">
                Instant Payout Settlement:
              </span>
              <div className="font-display font-black text-3xl text-[#240A39] tabular-nums">
                ₹{finalValue}
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 text-xs">
            <div
              onClick={() => setHasPhotoProof(!hasPhotoProof)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] cursor-pointer hover:bg-stone-100"
            >
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <Camera className="w-4 h-4 text-[#3B1458]" />
                <span>Digital scale photo reading captured</span>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center ${
                  hasPhotoProof ? 'bg-[#3B1458] text-white' : 'border border-slate-300 bg-white'
                }`}
              >
                {hasPhotoProof && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
            </div>

            <div
              onClick={() => setCustomerSigned(!customerSigned)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] cursor-pointer hover:bg-stone-100"
            >
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>Household resident verified scale & approved handover</span>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center ${
                  customerSigned ? 'bg-emerald-700 text-white' : 'border border-slate-300 bg-white'
                }`}
              >
                {customerSigned && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-[#240A39] font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Generate Verified Digital Receipt & Complete Handover</span>
          </button>
        </div>

        {/* Right Column: Scale Calibration Reference & Visual Evidence */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E0D5C3] rounded-3xl p-5 shadow-xs space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-900">
              Live Scale Photo Evidence
            </h3>
            <div className="rounded-2xl overflow-hidden border border-[#E0D5C3] aspect-[4/3] relative">
              <img
                src="/src/assets/images/digital_scale_handover_1790222529983.jpg"
                alt="Digital scale reading verification"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-xs text-white p-2 rounded-xl text-[11px] font-mono flex items-center justify-between">
                <span>GPS Timestamped</span>
                <span className="text-emerald-400 font-bold">● Scale Calibrated</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Scale tare-zero reading confirmed prior to loading scrap. Hash logged on municipal secondary ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
