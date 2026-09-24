import React, { useState } from 'react';
import {
  Recycle,
  Building2,
  ShieldCheck,
  Package,
  Truck,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  BarChart3,
  Factory
} from 'lucide-react';
import { Recycler, WasteCategoryType } from '../../types';

interface RecyclerDashboardProps {
  recycler: Recycler;
}

export const RecyclerDashboard: React.FC<RecyclerDashboardProps> = ({ recycler }) => {
  const [activeTab, setActiveTab] = useState<'demands' | 'inward' | 'compliance'>('demands');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#1C3F3A] rounded-3xl p-6 sm:p-8 text-white border border-[#E0D5C3] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Factory className="w-3.5 h-3.5" />
              <span>Industrial Recycler Portal</span>
            </span>
            <span className="text-xs text-emerald-200 font-mono">
              · Separate Bulk Entity (Not a Kabadiwala)
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            {recycler.business_name}
          </h1>
          <p className="text-xs text-emerald-200">
            Head of Procurement: <strong className="text-white">{recycler.contact_person}</strong> · Phone: {recycler.phone}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-emerald-200">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{recycler.facility_location}</span>
            </span>
            <span>·</span>
            <span className="text-amber-300 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CPCB License: {recycler.cpcb_license_number}</span>
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-center sm:text-right space-y-1">
          <span className="text-[11px] font-mono uppercase text-emerald-300 block">Processing Capacity</span>
          <div className="font-display font-black text-xl text-white">
            {recycler.monthly_processing_capacity}
          </div>
        </div>
      </div>

      {/* Recycler Role Clarification Callout */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Recycle className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            <strong>Chain of Custody Notice:</strong> Recyclers procure industrial quantities directly from aggregate partner warehouses, while Kabadiwalas handle household doorstep collections.
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md shrink-0">
          Secondary Raw Material
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E0D5C3] pb-3">
        <button
          onClick={() => setActiveTab('demands')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'demands'
              ? 'bg-[#1C3F3A] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
          }`}
        >
          Procurement Demands ({recycler.current_procurement_demands.length})
        </button>
        <button
          onClick={() => setActiveTab('inward')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'inward'
              ? 'bg-[#1C3F3A] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
          }`}
        >
          Warehouse Inward Batches (3)
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'compliance'
              ? 'bg-[#1C3F3A] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-[#E0D5C3] hover:bg-stone-100'
          }`}
        >
          CPCB & EPR Compliance
        </button>
      </div>

      {/* Demands View */}
      {activeTab === 'demands' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-xl text-slate-900">
              Active Bulk Procurement Orders
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Sourced from Partner Warehouses (Asansol Hub & Gurugram Aggregator)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recycler.current_procurement_demands.map((demand, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-[#E0D5C3] p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    Target Category: {demand.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Quota Open
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="font-display font-black text-3xl text-slate-900 tabular-nums">
                    {demand.required_tons} <span className="text-base text-slate-500 font-medium">Metric Tons</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Secondary raw material specifications: Baled, sorted & moisture tested.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E0D5C3] flex items-center justify-between text-xs">
                  <span className="text-slate-500">Warehouse Purchase Rate:</span>
                  <span className="font-mono font-black text-base text-emerald-800">
                    ₹{demand.procurement_price_per_ton.toLocaleString('en-IN')} / Ton
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Linked with Partner Warehouse — Asansol Central Hub</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inward Batches */}
      {activeTab === 'inward' && (
        <div className="space-y-6">
          <h2 className="font-display font-black text-xl text-slate-900">
            Recent Batches Received from Partner Warehouses
          </h2>

          <div className="bg-white rounded-3xl border border-[#E0D5C3] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1C3F3A] text-white uppercase font-mono text-[11px]">
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Source Warehouse</th>
                  <th className="py-3 px-4">Material</th>
                  <th className="py-3 px-4">Net Weight</th>
                  <th className="py-3 px-4">Inspection Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold">#BATCH-AS-9821</td>
                  <td className="py-3 px-4">Partner Warehouse — Asansol</td>
                  <td className="py-3 px-4">Heavy Melting Scrap (Iron)</td>
                  <td className="py-3 px-4 font-mono font-bold">18.4 Tons</td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                      Verified & Ingested
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold">#BATCH-GGN-4412</td>
                  <td className="py-3 px-4">Partner Warehouse — Gurugram North</td>
                  <td className="py-3 px-4">Baled Corrugated Cardboard</td>
                  <td className="py-3 px-4 font-mono font-bold">24.2 Tons</td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                      Verified & Ingested
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold">#BATCH-AS-9910</td>
                  <td className="py-3 px-4">Partner Warehouse — Asansol</td>
                  <td className="py-3 px-4">Sorted PET Flakes</td>
                  <td className="py-3 px-4 font-mono font-bold">12.0 Tons</td>
                  <td className="py-3 px-4">
                    <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold text-[11px]">
                      Weighbridge Transit
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="bg-white rounded-3xl border border-[#E0D5C3] p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <FileCheck className="w-5 h-5" />
            <h3 className="font-display font-black text-lg text-slate-900">
              CPCB Extended Producer Responsibility (EPR) Audit
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All scrap volumes ingested by {recycler.business_name} are traceable through partner warehouse manifests, enabling direct EPR credit generation and zero-leakage compliance auditing.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-slate-400 block font-mono text-[10px]">CPCB REGISTRATION</span>
              <span className="font-mono font-bold text-slate-900">{recycler.cpcb_license_number}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-slate-400 block font-mono text-[10px]">AUDIT STATUS</span>
              <span className="font-bold text-emerald-700">Annual Return Filed (Q3 2026)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
