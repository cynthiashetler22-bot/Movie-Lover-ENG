import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { Shield } from 'lucide-react';

interface FooterProps {
  onOpenPolicy: (type: 'privacy' | 'terms' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy }) => {
  const { settings, setIsAdminOpen, adminPasswordCorrect } = useAdmin();

  return (
    <footer className="bg-[#0b1018] border-t border-[#34404C] py-14 px-4 sm:px-6 text-[#B6B2A9]">
      <div className="max-w-[1180px] mx-auto">
        
        {/* Top Tier: Wordmark & Descriptor */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#34404C]/60">
          <div>
            <a href="#top" className="inline-block group focus-visible:outline-none">
              <span className="font-serif text-2xl font-bold tracking-wider text-[#F6F0E4] group-hover:text-[#D9A45B] transition-colors">
                {settings.siteTitle || 'STREAMORA'}
              </span>
            </a>
            <p className="font-sans text-xs sm:text-sm text-[#B6B2A9]/80 mt-1">
              {settings.brandDescriptor || 'An independent film-discovery journal.'}
            </p>
          </div>

          {/* Quick internal jump navigation & Admin Trigger */}
          <nav className="flex flex-wrap items-center gap-6 text-xs text-[#B6B2A9] font-sans" aria-label="Footer Navigation">
            <a href="#programme" className="hover:text-[#F6F0E4] transition-colors">The Programme</a>
            <a href="#collections" className="hover:text-[#F6F0E4] transition-colors">Collections</a>
            <a href="#genres" className="hover:text-[#F6F0E4] transition-colors">Genres</a>
            <a href="#about" className="hover:text-[#F6F0E4] transition-colors">About</a>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-[#D9A45B] transition-colors inline-flex items-center gap-1 cursor-pointer font-mono"
            >
              <Shield className="w-3 h-3 text-[#D9A45B]" />
              <span>Admin Portal {adminPasswordCorrect ? '(Unlocked)' : ''}</span>
            </button>
          </nav>
        </div>

        {/* Middle Tier: Mandatory Third-Party Sponsored Disclosure Note */}
        <div className="py-6 border-b border-[#34404C]/40 text-xs text-[#B6B2A9]/75 font-sans leading-relaxed">
          <p>
            <strong className="text-[#F6F0E4]/90">Notice Regarding External Links:</strong> Some clearly labeled placements may link to third-party sponsored offers. External destinations are not controlled by Streamora. Streamora is an entertainment discovery and editorial-recommendation page, not a streaming or media host.
          </p>
        </div>

        {/* Bottom Tier: Policies & Publisher Replaceable Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#B6B2A9]/60">
          <div>
            © {new Date().getFullYear()} {settings.siteTitle || 'Streamora'} Cinema Journal. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-[#D9A45B] transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Privacy Notice
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-[#D9A45B] transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Terms of Use
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenPolicy('contact')}
              className="hover:text-[#D9A45B] transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Editorial Contact ({settings.editorialContactEmail || 'Contact'})
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
