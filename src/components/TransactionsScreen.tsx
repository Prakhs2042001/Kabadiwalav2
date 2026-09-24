import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Scale,
  Receipt,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  CalendarPlus
} from 'lucide-react';
import { Transaction, TransactionStatus } from '../types';

interface TransactionsScreenProps {
  transactions: Transaction[];
  onViewTransaction: (transactionId: string) => void;
  onOpenHandover: (transactionId: string) => void;
  onViewReceipt: (transactionId: string) => void;
  onBookNew: () => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  transactions,
  onViewTransaction,
  onOpenHandover,
  onViewReceipt,
  onBookNew
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [search, setSearch] = useState('');

  const filteredTransactions = transactions.filter((tx) => {
    const isCompleted = tx.status === 'HANDOVER_CONFIRMED' || tx.status === 'RECYCLER_RECEIVED';
    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'ACTIVE' && !isCompleted) ||
      (filter === 'COMPLETED' && isCompleted);

    const matchesSearch =
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      (tx.wasteCategory || '').toLowerCase().includes(search.toLowerCase()) ||
      (tx.collectorName || '').toLowerCase().includes(search.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADFD0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
              Transaction History
            </span>
            <span className="text-xs text-slate-500 font-mono">· {transactions.length} Total Pickups</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#240A39] tracking-tight mt-0.5">
            Verified Handover Records
          </h1>
        </div>

        <button
          onClick={onBookNew}
          className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Book New Pickup</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E0D5C3] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, collector, or scrap type..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B1458]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-[#3B1458] text-white'
                  : 'bg-[#FAF8F5] text-slate-600 hover:bg-stone-100 border border-[#E0D5C3]'
              }`}
            >
              {f === 'ALL' ? 'All Transactions' : f === 'ACTIVE' ? 'Active / In-Transit' : 'Completed & Settled'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTransactions.map((tx) => {
          const isCompleted = tx.status === 'HANDOVER_CONFIRMED' || tx.status === 'RECYCLER_RECEIVED';
          return (
            <div
              key={tx.id}
              className="bg-white rounded-3xl border border-[#E0D5C3] shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      #{tx.id}
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate-900 mt-0.5">
                      {tx.wasteCategory} ({tx.subMaterial})
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {tx.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Collector:</span>
                    <strong className="text-slate-800">{tx.collectorName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time Window:</span>
                    <strong className="text-slate-800">{tx.timeSlot}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Weighed Quantity:</span>
                    <strong className="font-mono text-slate-900">
                      {tx.actualWeight ? `${tx.actualWeight} kg` : `~${tx.approximateWeight} kg`}
                    </strong>
                  </div>
                  {tx.finalValue ? (
                    <div className="flex justify-between pt-2 border-t border-slate-100 text-sm">
                      <span className="text-slate-500 font-medium">Payout Received:</span>
                      <strong className="font-mono font-black text-[#240A39]">₹{tx.finalValue}</strong>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[#EADFD0] flex items-center justify-between gap-2">
                <button
                  onClick={() => onViewTransaction(tx.id)}
                  className="text-xs font-bold text-[#3B1458] hover:underline flex items-center gap-1"
                >
                  <span>Track Lifecycle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {isCompleted ? (
                  <button
                    onClick={() => onViewReceipt(tx.id)}
                    className="h-9 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenHandover(tx.id)}
                    className="h-9 px-3 rounded-lg bg-[#3B1458] text-amber-400 hover:bg-[#4C1D95] font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Weigh</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
