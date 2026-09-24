import React, { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/kabadiwala_hero_art_1790221969609.jpg';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 450);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[radial-gradient(circle_at_top,_#ecfeff,_#dff6fb_25%,_#d8eff7_55%,_#d4e9f2_100%)] flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* Top subtle badge */}
      <div className="w-full flex items-center justify-between pt-4 max-w-sm">
        <span className="text-xs font-bold text-cyan-800 bg-cyan-100/90 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Smart India Hackathon 2026
        </span>
        <button
          onClick={onComplete}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors p-2"
        >
          Skip
        </button>
      </div>

      {/* Center Hero Artwork & Branding */}
      <div className="flex flex-col items-center text-center max-w-sm my-auto">
        <div className="relative mb-6">
          {/* Circular frame with warm glow */}
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl bg-cyan-50 ring-4 ring-cyan-400/30 flex items-center justify-center">
            <img
              src={heroImg}
              alt="Navonmesh Illustration"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#0D3B66] text-cyan-200 p-2.5 rounded-full shadow-lg border-2 border-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0D3B66] tracking-tight">
          Navonmesh
        </h1>

        <p className="mt-3 text-base sm:text-lg text-slate-700 font-semibold leading-snug px-4">
          “See the rate. Book a pickup. Get a verified record.”
        </p>

        <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xs">
          A lightweight digital trust layer connecting Indian households, informal scrap collectors, and authorized recyclers.
        </p>
      </div>

      {/* Bottom Action & Progress */}
      <div className="w-full max-w-sm pb-6 flex flex-col items-center gap-4">
        {/* Progress bar */}
        <div className="w-full bg-[#EADFD0] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#3B1458] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={onComplete}
          className="w-full h-13 rounded-2xl bg-[#0D3B66] hover:bg-[#0F5E8A] text-cyan-100 font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#0D3B66]/20 active:scale-[0.98] transition-all min-h-[50px]"
        >
          <span>Continue to App</span>
          <ArrowRight className="w-5 h-5 text-amber-400" />
        </button>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Transparent · Calibrated Scales · Traceable</span>
        </div>
      </div>
    </div>
  );
};
