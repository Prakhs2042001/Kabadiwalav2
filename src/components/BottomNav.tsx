import React from 'react';
import { Home, IndianRupee, PlusCircle, Clock, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingCount = 0
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'rates', label: 'Rates', icon: IndianRupee },
    { id: 'pickup', label: 'Pickup', icon: PlusCircle, isPrimary: true },
    { id: 'transactions', label: 'Transactions', icon: Clock, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-[#EADFD0] pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center justify-center -mt-5 group focus:outline-none min-h-[48px]"
                aria-label="Book a Pickup"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-active:scale-90 ${
                    isActive
                      ? 'bg-amber-500 text-[#270A3C] ring-4 ring-[#FAF8F5]'
                      : 'bg-[#3B1458] text-amber-400 hover:bg-[#4C1D95] ring-4 ring-[#FAF8F5]'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[11px] font-bold mt-1 tracking-tight ${
                    isActive ? 'text-[#3B1458]' : 'text-slate-700'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors relative focus:outline-none ${
                isActive ? 'text-[#3B1458]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-[#270A3C] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#3B1458] mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
