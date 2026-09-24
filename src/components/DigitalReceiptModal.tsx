import React, { useState } from 'react';
import {
  X,
  Share2,
  Download,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Recycle,
  Check,
  Copy,
  Printer
} from 'lucide-react';
import { Transaction } from '../types';

interface DigitalReceiptModalProps {
  transaction: Transaction;
  onClose: () => void;
  onMarkRecyclerReceived?: (transactionId: string) => void;
  onViewTraceability?: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  transaction,
  onClose,
  onMarkRecyclerReceived,
  onViewTraceability
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `Verified Handover Receipt\nTransaction ID: ${transaction.id}\nMaterial: ${transaction.wasteCategory}\nWeight: ${transaction.actualWeight || transaction.approximateWeight} kg\nTotal: ₹${transaction.finalValue}\nCollector: ${transaction.collectorName}\nTraceability: SIH-2026-CPCB Verified`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#E7DDCE] shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Receipt Header Bar */}
        <div className="bg-[#3B1458] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-extrabold text-base text-white tracking-tight">
              Verified Handover
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Receipt Body */}
        <div className="p-5 space-y-4 bg-[#FAF8F5]">
          <div className="text-center pb-2 border-b border-dashed border-slate-300 space-y-1">
            <div className="font-display font-black text-xl text-[#0D3B66]">
              Navonmesh
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              National Digital Scrap Trust Protocol · SIH 2026
            </div>
            <div className="text-xs font-mono font-bold text-slate-700 bg-purple-100/70 py-1 px-3 rounded-full inline-block mt-1">
              {transaction.id}
            </div>
          </div>

          {/* Core Handover Metrics */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-500">Material Category:</span>
              <span className="font-bold text-slate-900">{transaction.wasteCategory}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-500">Verified Weight:</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {transaction.actualWeight || transaction.approximateWeight} kg
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-500">Final Agreed Rate:</span>
              <span className="font-bold text-slate-900 tabular-nums">
                ₹{transaction.finalRate || transaction.indicativeRate}/kg
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-dashed border-slate-300 bg-amber-50 -mx-2 px-2 rounded-lg">
              <span className="font-bold text-amber-950">Final Handover Value:</span>
              <span className="font-display font-black text-base text-[#2E1065] tabular-nums">
                ₹{transaction.finalValue || ((transaction.approximateWeight || 0) * (transaction.indicativeRate || 0))}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-500">Collector:</span>
              <span className="font-medium text-slate-900">{transaction.collectorName}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-500">Resident / Household:</span>
              <span className="font-medium text-slate-900">{transaction.customerName}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-medium text-slate-900 tabular-nums">
                {transaction.createdAt || '23 Sep 2026 · 02:30 PM'}
              </span>
            </div>
          </div>

          {/* QR Code Placeholder with Stylized Verification */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
            {/* SVG QR Code Simulation */}
            <div className="w-24 h-24 bg-slate-900 p-2 rounded-xl flex items-center justify-center text-white">
              <QrCode className="w-20 h-20 text-white" />
            </div>
            <div className="text-[10px] text-slate-500">
              Scan to verify on National Recycling Ledger:
              <div className="font-mono font-bold text-slate-700 text-[11px]">
                {transaction.qrCodeHash || 'KC-HASH-2026-VERIFIED'}
              </div>
            </div>
          </div>

          {/* Recycler Trace Status */}
          <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold">Chain Traceable: </span>
              {transaction.recyclerName || 'Attero E-Waste & Precious Metals Smelter'}
            </div>
          </div>

          {/* Action Buttons: Share & Download */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleShare}
              className="h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#270A3C] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] min-h-[44px]"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied Details' : 'Share Receipt'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="h-11 rounded-xl bg-white border border-[#E7DDCE] hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all min-h-[44px]"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print / PDF</span>
            </button>
          </div>

          {/* Destination Explore Link */}
          {onViewTraceability && (
            <button
              onClick={() => {
                onClose();
                onViewTraceability();
              }}
              className="w-full text-center text-xs font-bold text-[#3B1458] hover:underline pt-1 block"
            >
              Where Does This Scrap Go Next? →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
