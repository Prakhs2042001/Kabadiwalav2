import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Scale,
  Receipt,
  Recycle,
  Sparkles,
  Phone,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Transaction, TransactionStatus } from '../types';

interface TrackingScreenProps {
  transaction: Transaction;
  onBack: () => void;
  onOpenHandover: (transactionId: string) => void;
  onViewReceipt: (transactionId: string) => void;
  onMarkRecyclerReceived: (transactionId: string) => void;
}

export const TrackingScreen: React.FC<TrackingScreenProps> = ({
  transaction,
  onBack,
  onOpenHandover,
  onViewReceipt,
  onMarkRecyclerReceived
}) => {
  const stepsOrder: { status: TransactionStatus; label: string; actor: string }[] = [
    { status: 'PICKUP_REQUESTED', label: 'Pickup Requested', actor: 'Household' },
    { status: 'COLLECTOR_ASSIGNED', label: 'Collector Assigned', actor: 'Smart Dispatch' },
    { status: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled', actor: 'Collector Confirmed' },
    { status: 'MATERIAL_WEIGHED', label: 'Material Weighed', actor: 'Digital Scale' },
    { status: 'HANDOVER_CONFIRMED', label: 'Handover Confirmed', actor: 'Verified Transaction' },
    { status: 'RECYCLER_RECEIVED', label: 'Recycler Received', actor: 'Authorized Smelter' },
  ];

  const getStepIndex = (status: TransactionStatus) => {
    return stepsOrder.findIndex((s) => s.status === status);
  };

  const currentIdx = getStepIndex(transaction.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
                Traceability Monitor
              </span>
              <span className="text-xs font-mono text-slate-500">· Transaction #{transaction.id}</span>
            </div>
            <h1 className="font-display font-black text-2xl text-[#240A39] tracking-tight mt-0.5">
              Material Chain of Custody
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {transaction.status === 'HANDOVER_CONFIRMED' || transaction.status === 'RECYCLER_RECEIVED' ? (
            <button
              onClick={() => onViewReceipt(transaction.id)}
              className="h-11 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Receipt className="w-4 h-4 text-amber-300" />
              <span>Digital Receipt</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenHandover(transaction.id)}
              className="h-11 px-4 rounded-xl bg-[#3B1458] hover:bg-[#4C1D95] text-amber-400 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Scale className="w-4 h-4" />
              <span>Collector Weighing</span>
            </button>
          )}
        </div>
      </div>

      {/* Transaction Details Card */}
      <div className="bg-white rounded-3xl border border-[#E0D5C3] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-500">Material Category:</div>
            <div className="font-display font-black text-xl text-slate-900">
              {transaction.wasteCategory} ({transaction.subMaterial})
            </div>
          </div>

          <div className="sm:text-right">
            <div className="text-xs text-slate-500">Weighed Quantity:</div>
            <div className="font-display font-black text-2xl text-[#240A39] tabular-nums">
              {transaction.actualWeight ? `${transaction.actualWeight} kg` : `~${transaction.approximateWeight} kg`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block mb-0.5">Assigned Collector:</span>
            <strong className="text-slate-800 text-sm">{transaction.collectorName}</strong>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Pickup Slot:</span>
            <strong className="text-slate-800 text-sm">{transaction.timeSlot}</strong>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Destination Recycler:</span>
            <strong className="text-slate-800 text-sm">{transaction.recyclerName}</strong>
          </div>
        </div>
      </div>

      {/* 6-Step Visual Timeline */}
      <div className="bg-white rounded-3xl border border-[#E0D5C3] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-slate-900">
            Chain of Custody Stages
          </h3>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
            Verifiable Digital Hash
          </span>
        </div>

        <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EADFD0]">
          {stepsOrder.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={step.status} className="relative flex items-start gap-4 pl-1">
                {/* Node circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                    isCompleted
                      ? 'bg-[#3B1458] text-white shadow-xs'
                      : 'bg-white border-2 border-slate-300 text-transparent'
                  } ${isCurrent ? 'ring-4 ring-amber-400/40 bg-amber-500 text-[#270A3C]' : ''}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[2.8]" />
                  ) : (
                    <Circle className="w-2.5 h-2.5 fill-current" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-bold ${
                        isCurrent
                          ? 'text-[#2E1065]'
                          : isCompleted
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                        Active Stage
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {step.actor}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Handover or Receipt Simulation Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
          {transaction.status !== 'HANDOVER_CONFIRMED' && transaction.status !== 'RECYCLER_RECEIVED' ? (
            <button
              onClick={() => onOpenHandover(transaction.id)}
              className="h-11 px-5 rounded-xl bg-[#3B1458] hover:bg-[#4C1D95] text-amber-400 font-bold text-xs flex items-center gap-2"
            >
              <Scale className="w-4 h-4" />
              <span>Simulate Doorstep Weighing with Collector</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => onViewReceipt(transaction.id)}
                className="h-11 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2"
              >
                <Receipt className="w-4 h-4 text-amber-300" />
                <span>View Full Handover Certificate</span>
              </button>

              {transaction.status === 'HANDOVER_CONFIRMED' && (
                <button
                  onClick={() => onMarkRecyclerReceived(transaction.id)}
                  className="h-11 px-5 rounded-xl bg-white border border-[#E0D5C3] hover:bg-stone-50 text-slate-700 font-bold text-xs flex items-center gap-2"
                >
                  <Recycle className="w-4 h-4 text-amber-600" />
                  <span>Simulate Recycler Intake Confirmation</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
