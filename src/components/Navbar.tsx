import React, { useState } from 'react';
import {
  Building2,
  Menu,
  X,
  ShieldCheck,
  MapPin,
  Truck,
  User,
  Recycle,
  ChevronDown,
  ArrowRight,
  PhoneCall,
  LogOut
} from 'lucide-react';
import navonmeshLogo from '../../Logo.png';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentRole: UserRole | null;
  onOpenLoginModal: () => void;
  onNavigate: (view: string) => void;
  activeView: string;
  userLocationName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onOpenLoginModal,
  onNavigate,
  activeView,
  userLocationName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
  };

  const getRoleBadge = () => {
    if (user) {
      if (user.role === 'ADMIN') {
        return {
          label: 'Platform Admin',
          icon: '⚙️',
          name: user.name,
          color: 'bg-blue-100 text-blue-900 border-blue-300'
        };
      }
      if (user.role === 'KABADIWALA') {
        return {
          label: 'Kabadiwala',
          icon: '🚚',
          name: user.name,
          color: 'bg-purple-100 text-purple-900 border-purple-300'
        };
      }
      return {
        label: 'Household',
        icon: '🏠',
        name: user.name,
        color: 'bg-amber-100 text-amber-900 border-amber-300'
      };
    }

    switch (currentRole) {
      case 'household':
        return {
          label: 'Household',
          icon: '🏠',
          name: 'Resident',
          color: 'bg-amber-100 text-amber-900 border-amber-300'
        };
      case 'kabadiwala':
        return {
          label: 'Kabadiwala',
          icon: '🚚',
          name: 'Collector',
          color: 'bg-purple-100 text-purple-900 border-purple-300'
        };
      case 'recycler':
        return {
          label: 'Recycler',
          icon: '♻️',
          name: 'Recycler Hub',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300'
        };
      case 'admin':
        return {
          label: 'Platform Admin',
          icon: '⚙️',
          name: 'Admin Console',
          color: 'bg-blue-100 text-blue-900 border-blue-300'
        };
      default:
        return null;
    }
  };

  const roleInfo = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 bg-[#eafafd]/95 backdrop-blur-md border-b border-[#a4e6f4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Network Subtitle */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform border border-white/70 bg-white/80">
              <img src={navonmeshLogo} alt="Navonmesh logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl text-[#0a3f68] tracking-tight group-hover:text-[#0a5b95]">
                  Navonmesh
                </span>
              </div>
              <div className="text-[10px] text-slate-600 font-medium hidden sm:block">
                Connected Local Partner Warehouse Network
              </div>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-[#240A39] transition-colors py-1 ${
                activeView === 'home' ? 'text-[#240A39] border-b-2 border-[#240A39]' : ''
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('discovery')}
              className={`hover:text-[#240A39] transition-colors py-1 flex items-center gap-1 ${
                activeView === 'discovery' ? 'text-[#240A39] border-b-2 border-[#240A39]' : ''
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Find Kabadiwala</span>
            </button>

            <button
              onClick={() => onNavigate('rates')}
              className={`hover:text-[#240A39] transition-colors py-1 ${
                activeView === 'rates' ? 'text-[#240A39] border-b-2 border-[#240A39]' : ''
              }`}
            >
              Scrap Rates
            </button>

            {currentRole === 'household' && (
              <button
                onClick={() => onNavigate('household_dashboard')}
                className={`hover:text-[#240A39] transition-colors py-1 ${
                  activeView === 'household_dashboard' ? 'text-[#240A39] border-b-2 border-[#240A39]' : ''
                }`}
              >
                My Dashboard
              </button>
            )}

            {currentRole === 'kabadiwala' && (
              <button
                onClick={() => onNavigate('kabadiwala_dashboard')}
                className={`hover:text-[#240A39] transition-colors py-1 ${
                  activeView === 'kabadiwala_dashboard' ? 'text-[#240A39] border-b-2 border-[#240A39]' : ''
                }`}
              >
                Collector Dashboard
              </button>
            )}

            {currentRole === 'recycler' && (
              <button
                onClick={() => onNavigate('recycler_dashboard')}
                className={`hover:text-[#240A39] transition-colors py-1 ${
                  activeView === 'recycler_dashboard' ? 'text-[#240A39] border-b-2 border-[#240A39]' : ''
                }`}
              >
                Recycler Portal
              </button>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => onNavigate('admin_dashboard')}
                className={`hover:text-[#240A39] transition-colors py-1 ${
                  activeView === 'admin_dashboard' ? 'text-[#240A39] border-b-2 border-[#240A39]' : ''
                }`}
              >
                Admin Console
              </button>
            )}
          </nav>

          {/* Desktop Right Role Control */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (user.role === 'ADMIN') onNavigate('admin_dashboard');
                    else if (user.role === 'KABADIWALA') onNavigate('kabadiwala_dashboard');
                    else onNavigate('household_dashboard');
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 shadow-2xs hover:opacity-95 transition-all ${roleInfo?.color}`}
                  title="Go to Dashboard"
                >
                  <span>{roleInfo?.icon}</span>
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-mono opacity-80 leading-none">
                      {roleInfo?.label}
                    </div>
                    <div className="leading-tight truncate max-w-[110px]">{user.name}</div>
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  className="h-9 px-3 rounded-xl bg-white border border-slate-200 hover:bg-red-50 hover:text-red-700 text-slate-600 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="h-10 px-4 rounded-xl bg-white border border-[#E0D5C3] hover:bg-stone-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>Log In / Sign Up</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('discovery')}
              className="h-10 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-black text-xs flex items-center gap-1.5 shadow-xs transition-colors active:scale-95"
            >
              <span>Book Pickup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenLoginModal}
              className="p-2 rounded-xl bg-white border border-[#E0D5C3] text-xs font-bold"
            >
              {roleInfo ? roleInfo.icon : '👤'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAF8F5] border-b border-[#E0D5C3] px-4 py-4 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-stone-100"
            >
              Home
            </button>

            <button
              onClick={() => {
                onNavigate('discovery');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-stone-100 flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Find Kabadiwala</span>
            </button>

            <button
              onClick={() => {
                onNavigate('rates');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-stone-100"
            >
              Scrap Rates
            </button>

            <button
              onClick={() => {
                onNavigate('household_dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-stone-100"
            >
              Household Dashboard
            </button>

            <button
              onClick={() => {
                onNavigate('kabadiwala_dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-stone-100"
            >
              Kabadiwala Portal
            </button>

            <button
              onClick={() => {
                onNavigate('recycler_dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-stone-100"
            >
              Recycler Portal (Bulk Secondary)
            </button>

            <button
              onClick={() => {
                onNavigate('admin_dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-stone-100"
            >
              Platform Admin Console
            </button>
          </div>

          <div className="pt-3 border-t border-[#E0D5C3] space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLoginModal();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-bold text-slate-800 flex items-center justify-center gap-2"
            >
              <span>Switch User Role ({roleInfo?.label || 'Guest'})</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('discovery');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 text-[#240A39] font-black text-xs flex items-center justify-center gap-2"
            >
              <span>Find Nearby Kabadiwalas</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
