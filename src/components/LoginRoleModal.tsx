import React, { useState } from 'react';
import {
  X,
  Home,
  Recycle,
  Truck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  currentRole: UserRole | null;
}

export const LoginRoleModal: React.FC<LoginRoleModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  currentRole
}) => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('household');
  const [loginPhone, setLoginPhone] = useState('9876543210');

  if (!isOpen) return null;

  const handleContinue = (role: UserRole) => {
    onSelectRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#E0D5C3] shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="bg-[#240A39] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full">
              Platform Authentication
            </span>
          </div>

          <h2 className="font-display font-black text-2xl text-white tracking-tight">
            How do you want to use the platform?
          </h2>
          <p className="text-xs text-purple-200 mt-1 max-w-md">
            Choose your account role to access your personalized marketplace dashboard.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 bg-[#FAF8F5]">
          {/* Two Primary Role Cards Required by Prompt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Household Card */}
            <div
              onClick={() => handleContinue('household')}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left group hover:scale-[1.02] ${
                currentRole === 'household'
                  ? 'border-[#240A39] bg-white shadow-md ring-2 ring-[#240A39]/10'
                  : 'border-[#E0D5C3] bg-white hover:border-[#240A39]'
              }`}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#240A39] flex items-center justify-center text-2xl mb-4 group-hover:bg-amber-200 transition-colors">
                  🏠
                </div>
                <h3 className="font-display font-black text-xl text-slate-900 group-hover:text-[#240A39]">
                  Household
                </h3>
                <p className="text-xs font-bold text-amber-700 mt-0.5">
                  "I want to sell my scrap."
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Discover verified neighborhood Kabadiwalas, compare rates, and book doorstep pickup.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#240A39]">Continue as Resident</span>
                <div className="w-8 h-8 rounded-full bg-amber-500 text-[#240A39] flex items-center justify-center shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Recycler Card */}
            <div
              onClick={() => handleContinue('recycler')}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left group hover:scale-[1.02] ${
                currentRole === 'recycler'
                  ? 'border-[#240A39] bg-white shadow-md ring-2 ring-[#240A39]/10'
                  : 'border-[#E0D5C3] bg-white hover:border-[#240A39]'
              }`}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mb-4 group-hover:bg-emerald-200 transition-colors">
                  ♻️
                </div>
                <h3 className="font-display font-black text-xl text-slate-900 group-hover:text-[#240A39]">
                  Recycler
                </h3>
                <p className="text-xs font-bold text-emerald-700 mt-0.5">
                  "I want to manage recyclable materials."
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Industrial paper mills, metal smelters, and plastic reclaimers procuring secondary bulk batches.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">Recycler Portal</span>
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Role Access: Kabadiwala & Platform Admin */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
              Partner Network & Administration
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Kabadiwala Login Button */}
              <button
                onClick={() => handleContinue('kabadiwala')}
                className="p-3 rounded-xl bg-white border border-stone-200 hover:border-[#240A39] text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#240A39] flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 group-hover:text-[#240A39]">
                      Kabadiwala Login
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Partner-registered scrap buyer
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#240A39]" />
              </button>

              {/* Platform Admin Login Button */}
              <button
                onClick={() => handleContinue('admin')}
                className="p-3 rounded-xl bg-white border border-stone-200 hover:border-[#240A39] text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#240A39] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 group-hover:text-[#240A39]">
                      Platform Admin
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Manage warehouses & data
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#240A39]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
