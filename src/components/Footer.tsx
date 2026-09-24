import React from 'react';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Scale,
  Recycle,
  Truck,
  Heart,
  ExternalLink
} from 'lucide-react';
import navonmeshLogo from '../../Logo.png';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenLoginModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLoginModal }) => {
  return (
    <footer className="bg-[#062d52] text-[#eaf6ff] pt-14 pb-12 border-t border-[#0e4d7c] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">
          {/* Col 1 & 2: Platform Identity & Core Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md border border-white/30 bg-white/10">
                <img src={navonmeshLogo} alt="Navonmesh logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-black text-2xl text-white tracking-tight">
                Navonmesh
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-md">
              A modern digital marketplace connecting households with verified nearby Kabadiwalas. We make the local scrap buyer network searchable, comparable, and bookable.
            </p>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-cyan-100 space-y-1">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Partner Warehouse Data Model</span>
              </div>
              <p className="leading-normal">
                The platform does not create arbitrary scrap collectors. Profiles and baseline buying rates are supplied by established local Partner Warehouses.
              </p>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('discovery')}
                  className="hover:text-white transition-colors text-left"
                >
                  Find Kabadiwala Near Me
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rates')}
                  className="hover:text-white transition-colors text-left"
                >
                  Compare Scrap Rates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('household_dashboard')}
                  className="hover:text-white transition-colors text-left"
                >
                  Household Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('kabadiwala_dashboard')}
                  className="hover:text-white transition-colors text-left"
                >
                  Kabadiwala Partner Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Segregated Entities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
              Ecosystem Roles
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('recycler_dashboard')}
                  className="hover:text-white transition-colors text-left"
                >
                  Industrial Recycler Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin_dashboard')}
                  className="hover:text-white transition-colors text-left"
                >
                  Platform Administration
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLoginModal}
                  className="hover:text-white transition-colors text-left font-bold text-cyan-300"
                >
                  Switch Role / Login
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: SIH 2026 Trust Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
              Trust & Transparency
            </h4>
            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="flex items-start gap-2">
                <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Doorstep weighing with digital scales & itemized receipts</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Indicative, timestamped rates updated regularly</span>
              </div>
              <div className="flex items-start gap-2">
                <Recycle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Direct supply link from warehouse hubs to CPCB recyclers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            Smart India Hackathon 2026 · Problem Statement: Informal Scrap Digitization & Trust Layer
          </div>
          <div>
            © 2026 Navonmesh. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
