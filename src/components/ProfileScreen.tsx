import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Clock,
  History,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Globe,
  Plus,
  Check,
  Building
} from 'lucide-react';
import { Transaction } from '../types';

interface ProfileScreenProps {
  onOpenAssisted: () => void;
  onViewTransaction: (transactionId: string) => void;
  transactions: Transaction[];
  onOpenAdmin: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenAssisted,
  onViewTransaction,
  transactions,
  onOpenAdmin
}) => {
  const [userName, setUserName] = useState('Rajesh Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [preferredSlot, setPreferredSlot] = useState('1 PM – 4 PM');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const savedAddresses = [
    { id: 'addr-1', label: 'Home', address: 'Flat 402, Shanti Vihar, Sector 14, Gurugram', isDefault: true },
    { id: 'addr-2', label: 'Parents / Society', address: 'Tower B-601, Green Valley Society, Dwarka', isDefault: false },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E0D5C3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#3B1458] text-amber-400 font-black text-2xl flex items-center justify-center shadow-sm">
            RS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-2xl text-[#240A39]">
                {userName}
              </h1>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                Verified Resident
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 mt-0.5">{phone}</p>
            <p className="text-xs text-slate-400 mt-0.5">Green Valley Society Partner · Gurugram Ward 42</p>
          </div>
        </div>

        <button
          onClick={onOpenAssisted}
          className="h-10 px-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold text-xs flex items-center gap-2 self-start sm:self-auto hover:bg-amber-100 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-amber-800" />
          <span>Assisted Support</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Saved Addresses & Preferred Slot */}
        <div className="space-y-6">
          {/* Saved Addresses */}
          <div className="bg-white rounded-3xl p-6 border border-[#E0D5C3] shadow-xs space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#3B1458]" />
              <span>Saved Pickup Addresses</span>
            </h3>

            <div className="space-y-3">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E0D5C3] flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-mono font-bold text-[#3B1458] bg-purple-100 px-1.5 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{addr.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Pickup Slot */}
          <div className="bg-white rounded-3xl p-6 border border-[#E0D5C3] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3B1458]" />
                <span>Preferred Pickup Window</span>
              </h3>
              <span className="text-xs font-mono font-bold text-[#3B1458] bg-purple-50 px-2 py-0.5 rounded-md">
                {preferredSlot}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['10 AM – 1 PM', '1 PM – 4 PM', '4 PM – 7 PM'].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setPreferredSlot(slot)}
                  className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                    preferredSlot === slot
                      ? 'bg-[#3B1458] text-white border-[#3B1458]'
                      : 'bg-[#FAF8F5] text-slate-600 border-[#E0D5C3] hover:bg-stone-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Transaction History & System Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E0D5C3] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-[#3B1458]" />
                <span>Recent Scrap Handovers</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">{transactions.length} Total</span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => onViewTransaction(tx.id)}
                  className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E0D5C3] hover:border-[#3B1458] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#3B1458]">
                        #{tx.id}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {tx.wasteCategory} ({tx.actualWeight || tx.approximateWeight} kg)
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Partner: {tx.collectorName}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-[#240A39] block">
                      ₹{tx.finalValue || ((tx.approximateWeight || 0) * (tx.indicativeRate || 0))}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold uppercase">
                      {tx.status === 'RECYCLER_RECEIVED' ? 'Recycled' : 'Settled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-center space-y-2">
            <button
              onClick={onOpenAdmin}
              className="text-xs text-[#3B1458] hover:underline font-bold"
            >
              Access SIH 2026 Jury & Admin Analytics Portal →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
