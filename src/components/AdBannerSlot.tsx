import React, { useEffect, useRef } from 'react';
import { AdUnitConfig, useAdmin } from '../context/AdminContext';
import { ExternalLink, Info, Sparkles } from 'lucide-react';

interface AdBannerSlotProps {
  slot: 'top_banner' | 'middle_placement' | 'bottom_placement' | 'detail_modal_ad';
  className?: string;
}

export const AdBannerSlot: React.FC<AdBannerSlotProps> = ({ slot, className = '' }) => {
  const { ads, activeAdsterraLink } = useAdmin();
  const containerRef = useRef<HTMLDivElement>(null);

  // Find enabled ad for this slot
  const activeAd = ads.find((a) => a.slot === slot && a.enabled);

  useEffect(() => {
    if (!containerRef.current || !activeAd) return;

    if (activeAd.type === 'html_code' && activeAd.htmlScriptCode?.trim()) {
      containerRef.current.innerHTML = '';

      const tempDiv = document.createElement('div');
      tempDiv.className = 'ad-script-container flex justify-center items-center w-full overflow-hidden';
      tempDiv.innerHTML = activeAd.htmlScriptCode;

      // React innerHTML does not execute <script> tags; recreate them so they execute!
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
    }
  }, [activeAd]);

  if (!activeAd) return null;

  // Direct link resolution
  const targetUrl = activeAd.directLinkUrl === 'YOUR_ADSTERRA_LINK' && activeAdsterraLink !== 'YOUR_ADSTERRA_LINK'
    ? activeAdsterraLink
    : activeAd.directLinkUrl || activeAdsterraLink;

  const isConfigured = targetUrl && targetUrl !== 'YOUR_ADSTERRA_LINK';

  return (
    <div 
      aria-label="Advertisement Banner"
      className={`w-full py-4 px-2 sm:px-4 my-4 flex flex-col items-center justify-center transition-all ${className}`}
    >
      <div className="w-full max-w-[1240px] mx-auto">
        {/* Subtle disclosure bar */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest pb-1.5 px-2">
          <span className="flex items-center gap-1 text-[#D9A45B]">
            <Sparkles className="w-3 h-3" />
            <span>Sponsored {activeAd.network ? `• ${activeAd.network.toUpperCase()}` : ''}</span>
          </span>
          <span>Advertisement</span>
        </div>

        {/* Dynamic HTML/Script Banner container */}
        {activeAd.type === 'html_code' && activeAd.htmlScriptCode?.trim() ? (
          <div 
            ref={containerRef}
            className="w-full min-h-[90px] bg-[#0A0E17]/60 border border-slate-800/80 rounded-2xl p-2 flex items-center justify-center overflow-hidden shadow-inner"
          />
        ) : (
          /* Direct Link Banner format */
          <div className="bg-gradient-to-r from-[#121A26] via-[#162234] to-[#121A26] border border-dashed border-[#283C52] hover:border-[#D9A45B]/60 rounded-2xl p-5 sm:p-6 text-center shadow-xl transition-all">
            <div className="max-w-2xl mx-auto space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
                {activeAd.sponsorName || 'Exclusive Entertainment & Streaming Offer'}
              </h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {activeAd.disclosureText || 'Click to explore third-party partner offers and high-speed downloads.'}
              </p>

              <div className="pt-2">
                <a
                  href={isConfigured ? targetUrl : '#'}
                  target={isConfigured ? '_blank' : '_self'}
                  rel="sponsored nofollow noopener"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#D9A45B] hover:bg-[#E5B573] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>{activeAd.buttonText || 'Visit Sponsored Offer'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
