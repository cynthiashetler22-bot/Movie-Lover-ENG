import React, { useEffect, useRef, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { ExternalLink, Sparkles, Play, Zap, ShieldCheck } from 'lucide-react';
import { DIRECT_POPUNDER_URL, triggerPopunder } from '../utils/popunder';

interface AdBannerSlotProps {
  slot: 'top_banner' | 'middle_placement' | 'bottom_placement' | 'detail_modal_ad';
  className?: string;
}

export const AdBannerSlot: React.FC<AdBannerSlotProps> = ({ slot, className = '' }) => {
  const { ads, activeAdsterraLink } = useAdmin();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptRendered, setScriptRendered] = useState(false);

  // Find enabled ad for this slot
  const activeAd = ads.find((a) => a.slot === slot && a.enabled);

  // Resolve target sponsor URL (Prioritize user's HilltopAds/Adcash direct link)
  const targetUrl = activeAd?.directLinkUrl && activeAd.directLinkUrl !== 'YOUR_ADSTERRA_LINK'
    ? activeAd.directLinkUrl
    : activeAdsterraLink && activeAdsterraLink !== 'YOUR_ADSTERRA_LINK'
    ? activeAdsterraLink
    : DIRECT_POPUNDER_URL;

  useEffect(() => {
    if (!containerRef.current || !activeAd) return;

    if (activeAd.type === 'html_code' && activeAd.htmlScriptCode?.trim()) {
      containerRef.current.innerHTML = '';

      const tempDiv = document.createElement('div');
      tempDiv.className = 'ad-script-container flex justify-center items-center w-full overflow-hidden min-h-[90px]';
      tempDiv.innerHTML = activeAd.htmlScriptCode;

      // Recreate script tags to force browser execution
      const scripts = Array.from(tempDiv.querySelectorAll('script'));
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.text = oldScript.text;
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });

      containerRef.current.appendChild(tempDiv);

      // Check if external script generated elements within 1.5 seconds
      const checkTimer = setTimeout(() => {
        if (containerRef.current && containerRef.current.offsetHeight > 40 && containerRef.current.children.length > 0) {
          setScriptRendered(true);
        }
      }, 1500);

      return () => clearTimeout(checkTimer);
    }
  }, [activeAd]);

  const handleBannerClick = () => {
    triggerPopunder(targetUrl);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Titles based on slot
  const slotTitles = {
    top_banner: {
      tag: '🔥 Featured Sponsor',
      title: 'Stream Movies in Ultra HD 4K • Direct Cloud Mirror',
      desc: 'Instant high-speed playback with multi-audio & subtitles',
      cta: '▶️ Stream in 4K',
    },
    middle_placement: {
      tag: '⚡ 10 Gbps Cloud Mirror',
      title: 'High-Speed Unlimited Movie Downloads (x265 / HEVC 1080p)',
      desc: 'Direct server download without bandwidth limits',
      cta: '🚀 Access Cloud Mirror',
    },
    bottom_placement: {
      tag: '🛡️ Verified Cloud Server',
      title: 'Unlimited Fast Cinema Streaming & Direct MKV Files',
      desc: 'Adcash / HilltopAds high-speed premium server network',
      cta: '⬇️ Fast Download',
    },
    detail_modal_ad: {
      tag: '⭐ Premium Sponsor',
      title: 'Watch Full Movie Online Without Wait Time',
      desc: 'Exclusive cloud player access for international cinema fans',
      cta: '▶️ Watch Online',
    },
  };

  const info = slotTitles[slot] || slotTitles.top_banner;

  return (
    <div 
      aria-label="Advertisement Banner"
      className={`w-full py-2 px-2 sm:px-4 my-2 flex flex-col items-center justify-center transition-all ${className}`}
    >
      <div className="w-full max-w-[1240px] mx-auto">
        {/* Subtle disclosure bar */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest pb-1 px-2">
          <span className="flex items-center gap-1 text-[#D9A45B]">
            <Sparkles className="w-3 h-3" />
            <span>Sponsored {activeAd?.network ? `• ${activeAd.network.toUpperCase()}` : '• ADCASH / HILLTOPADS'}</span>
          </span>
          <span>Advertisement</span>
        </div>

        {/* Script Container (if configured) */}
        {activeAd?.type === 'html_code' && activeAd.htmlScriptCode?.trim() && (
          <div ref={containerRef} className="w-full flex justify-center" />
        )}

        {/* High-Converting Cinema Banner Unit (Guaranteed display if script is blocked or empty) */}
        {(!activeAd || activeAd.type !== 'html_code' || !scriptRendered) && (
          <div 
            onClick={handleBannerClick}
            className="w-full bg-gradient-to-r from-[#0F1724] via-[#162335] to-[#0F1724] border border-[#23354C] hover:border-[#D9A45B] rounded-2xl p-3 sm:p-4 text-left shadow-lg hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
          >
            {/* Background cinema glow effect */}
            <div className="absolute top-0 right-0 w-64 h-full bg-[#D9A45B]/5 blur-2xl pointer-events-none group-hover:bg-[#D9A45B]/10 transition-colors" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#D9A45B] to-amber-600 text-black flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-black translate-x-0.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold uppercase">
                      {info.tag}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Safe
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D9A45B] transition-colors leading-tight">
                    {info.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1">
                    {info.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end shrink-0">
                <button
                  type="button"
                  className="px-4 sm:px-5 py-2 bg-[#D9A45B] group-hover:bg-[#E5B573] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-transform group-hover:scale-105 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>{info.cta}</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
