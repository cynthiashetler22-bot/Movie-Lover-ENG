import React from 'react';
import { ExternalLink, Info, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const SponsoredPlacementOne: React.FC = () => {
  const { ads, activeAdsterraLink } = useAdmin();

  // Find ad configured for middle placement
  const middleAd = ads.find(a => a.slot === 'middle_placement' && a.enabled);

  if (!middleAd) return null;

  const targetUrl = middleAd.directLinkUrl === 'YOUR_ADSTERRA_LINK' && activeAdsterraLink !== 'YOUR_ADSTERRA_LINK'
    ? activeAdsterraLink
    : middleAd.directLinkUrl;

  const isConfigured = targetUrl && targetUrl !== 'YOUR_ADSTERRA_LINK';

  return (
    <aside 
      aria-label="Sponsored third-party advertisement"
      className="w-full py-10 px-4 sm:px-6 bg-[#0c121b] border-y-2 border-[#34404C]/80 my-8 min-h-[175px] transition-all"
    >
      <div className="max-w-[1180px] mx-auto">
        <div className="relative bg-[#151e2b] border border-dashed border-[#475768] rounded-xl p-8 sm:p-10 text-center flex flex-col items-center justify-center min-h-[165px] shadow-inner">
          
          {/* Distinct Mandatory Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#101722] border border-[#475768] rounded text-[11px] font-mono tracking-widest text-[#B6B2A9] uppercase mb-4">
            <Info className="w-3 h-3 text-[#D9A45B]" aria-hidden="true" />
            <span>SPONSORED PLACEMENT</span>
          </div>

          {/* Heading with clear promotional identity */}
          <h3 className="font-sans text-lg sm:text-xl font-medium text-[#F6F0E4] mb-2 tracking-tight">
            {middleAd.sponsorName || 'Third-Party Promotional Partner'}
          </h3>

          {/* Mandatory Transparent Disclosure */}
          <p className="font-sans text-xs sm:text-sm text-[#B6B2A9] max-w-xl leading-relaxed mb-6">
            {middleAd.disclosureText || 'Sponsored third-party offer. The destination is external and may have its own terms and conditions. Streamora does not endorse or operate external services.'}
          </p>

          {/* External Action Button */}
          {isConfigured ? (
            <a
              href={targetUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#101722] bg-[#D9A45B] hover:bg-[#e4b574] rounded-lg transition-all duration-200 shadow-lg shadow-[#D9A45B]/15 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>{middleAd.buttonText || 'VISIT SPONSORED OFFER'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={targetUrl}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#F6F0E4] bg-[#202C3A] hover:bg-[#2b3b4e] border border-[#475768] rounded-lg transition-all"
                title="Awaiting verified partner URL from publisher"
              >
                <span>{middleAd.buttonText || 'VISIT SPONSORED OFFER'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D9A45B]" />
              </a>
              <span className="text-[11px] text-[#B6B2A9]/60 font-mono">
                [Awaiting Adsterra Link: configure via Admin Panel]
              </span>
            </div>
          )}

        </div>
      </div>
    </aside>
  );
};
