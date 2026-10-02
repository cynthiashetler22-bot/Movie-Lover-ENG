import React, { useState, useEffect } from 'react';
import { X, Play, Zap, ShieldCheck, Sparkles, Film } from 'lucide-react';
import { DIRECT_POPUNDER_URL, triggerPopunder } from '../utils/popunder';
import { useAdmin } from '../context/AdminContext';

export const FloatingCenterAd: React.FC = () => {
  const { isAdminOpen } = useAdmin();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isAdminOpen) return;
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if (p.includes('admin') || h.includes('admin')) return;
    }

    // Show after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAdminOpen]);

  if (!isVisible || isAdminOpen) return null;

  const handleAdClick = () => {
    triggerPopunder(DIRECT_POPUNDER_URL);
    window.open(DIRECT_POPUNDER_URL, '_blank', 'noopener,noreferrer');
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    // Re-show after 60 seconds
    setTimeout(() => {
      setIsVisible(true);
    }, 60000);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[480px] max-w-[500px] animate-fadeIn">
      <div 
        onClick={handleAdClick}
        className="relative bg-gradient-to-r from-[#121927] via-[#1A2638] to-[#121927] border-2 border-[#D9A45B]/80 rounded-2xl p-4 sm:p-5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] cursor-pointer group hover:border-[#D9A45B] transition-all duration-300"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#1A2433] hover:bg-rose-600 text-slate-300 hover:text-white border border-[#D9A45B]/50 flex items-center justify-center transition-all cursor-pointer shadow-lg z-20"
          aria-label="Close Advertisement"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Content Box */}
        <div className="flex items-center gap-3.5">
          {/* Glowing Play Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D9A45B] to-amber-600 flex items-center justify-center text-black shrink-0 shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-black translate-x-0.5" />
          </div>

          {/* Texts */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold uppercase tracking-wider">
                ⚡ Ultra HD 4K Server
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Adcash / HilltopAds
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D9A45B] truncate transition-colors">
              Stream & Download at 10 Gbps Cloud Speed
            </h4>
            <p className="text-[11px] text-slate-400 line-clamp-1">
              Click to access high-speed unlimited streaming mirror
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3 pt-2.5 border-t border-[#253549] flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Sponsored Partner
          </span>
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#D9A45B] hover:bg-[#E5B573] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-transform group-hover:scale-105">
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>Open Stream Sponsor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
