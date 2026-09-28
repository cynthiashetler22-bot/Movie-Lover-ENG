import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const SponsoredPlacementTwo: React.FC = () => {
  const { ads, activeAdsterraLink } = useAdmin();

  // Find ad configured for bottom placement
  const bottomAd = ads.find(a => a.slot === 'bottom_placement' && a.enabled);

  if (!bottomAd) return null;

  const targetUrl = bottomAd.directLinkUrl === 'YOUR_ADSTERRA_LINK' && activeAdsterraLink !== 'YOUR_ADSTERRA_LINK'
    ? activeAdsterraLink
    : bottomAd.directLinkUrl;

  const isConfigured = targetUrl && targetUrl !== 'YOUR_ADSTERRA_LINK';

  return (
    <aside
      aria-label="Promotional partner offer"
      className="w-full py-10 px-4 sm:px-6 bg-[#0d1420] border-y border-[#34404C] my-10 min-h-[160px] transition-all"
    >
      <div className="max-w-[1180px] mx-auto">
        <div className="min-h-[155px] bg-[#16212f] border border-[#34404C] rounded-xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          
          <div className="text-left max-w-2xl">
            {/* Labeled Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#101722] border border-[#34404C] rounded text-[10px] font-mono tracking-widest text-[#D9A45B] uppercase mb-3">
              <Tag className="w-3 h-3 text-[#D9A45B]" aria-hidden="true" />
              <span>SPONSORED PARTNER OFFER</span>
            </div>

            <h4 className="font-serif text-xl sm:text-2xl text-[#F6F0E4] font-medium mb-2">
              {bottomAd.sponsorName || 'Featured Promotional Offer'}
            </h4>

            {/* Mandatory Transparent Disclosure */}
            <p className="font-sans text-xs sm:text-sm text-[#B6B2A9] leading-relaxed">
              {bottomAd.disclosureText || 'This is an external promotional link. Availability and terms are set by the destination. Streamora does not control or operate third-party websites.'}
            </p>
          </div>

          {/* Action Destination */}
          <div className="flex-shrink-0">
            {isConfigured ? (
              <a
                href={targetUrl}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#101722] bg-[#D9A45B] hover:bg-[#e4b574] rounded-lg transition-all shadow-md whitespace-nowrap transform hover:-translate-y-0.5"
              >
                <span>{bottomAd.buttonText || 'OPEN SPONSORED OFFER'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <div className="text-center md:text-right">
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#F6F0E4] bg-[#202C3A] hover:bg-[#2b3b4e] border border-[#475768] rounded-lg transition-all whitespace-nowrap"
                  title="Publisher placeholder"
                >
                  <span>{bottomAd.buttonText || 'OPEN SPONSORED OFFER'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#D9A45B]" />
                </a>
                <div className="text-[10px] text-[#B6B2A9]/50 font-mono mt-1.5">
                  [Adsterra: configure via Admin Panel]
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </aside>
  );
};
