import React from 'react';
import { CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, MapPin, Clock, Calendar, User } from 'lucide-react';
import { Transaction } from '../types';

interface ConfirmationScreenProps {
  transaction: Transaction;
  onTrackTransaction: (transactionId: string) => void;
  onGoHome: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  transaction,
  onTrackTransaction,
  onGoHome
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Celebration Icon Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#240A39] tracking-tight">
          Pickup Request Confirmed!
        </h1>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 text-[#3B1458] border border-purple-200 text-xs font-mono font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Immutable ID: {transaction.id}</span>
        </div>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#E0D5C3] shadow-sm space-y-6">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
          Booking Record Details
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">Assigned Neighborhood Collector</span>
            <span className="font-display font-bold text-base text-slate-900">{transaction.collectorName}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Selected Arrival Window</span>
            <span className="font-display font-bold text-base text-slate-900">{transaction.timeSlot}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Scrap Category</span>
            <span className="font-display font-bold text-base text-slate-900">{transaction.wasteCategory} ({transaction.subMaterial})</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Estimated Quantity</span>
            <span className="font-display font-bold text-base text-[#240A39] font-mono">~{transaction.approximateWeight} kg</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-600">
          <span className="text-slate-400 block mb-0.5">Pickup Location</span>
          <span className="font-medium text-slate-800">{transaction.pickupAddress}</span>
        </div>

        {/* SMS Notification Banner */}
        <div className="bg-purple-50 border border-purple-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-purple-950">
          <MessageSquare className="w-5 h-5 text-[#3B1458] shrink-0" />
          <div>
            <span className="font-bold">SMS & WhatsApp confirmation dispatched.</span> The collector will contact you 15 minutes before reaching with a calibrated digital hanging scale.
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => onTrackTransaction(transaction.id)}
          className="w-full sm:flex-1 h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <span>Track Custody & Timeline</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onGoHome}
          className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-white border border-[#E0D5C3] hover:bg-stone-50 text-slate-700 font-bold text-xs transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};
