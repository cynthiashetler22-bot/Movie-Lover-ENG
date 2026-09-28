import React, { useEffect } from 'react';
import { X, FileText, Mail, ShieldAlert } from 'lucide-react';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | 'contact' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (type) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#192331] border border-[#34404C] rounded-xl p-6 sm:p-8 shadow-2xl text-[#F6F0E4]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#B6B2A9] hover:text-[#F6F0E4] hover:bg-[#202C3A] rounded-full transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'privacy' && (
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#D9A45B] mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Placeholder Policy Sheet</span>
            </div>
            <h3 className="font-serif text-2xl text-[#F6F0E4] mb-4">Privacy Notice Placeholder</h3>
            <div className="p-4 bg-[#101722] border border-dashed border-[#475768] rounded-lg text-xs font-mono text-[#B6B2A9] space-y-3 mb-6">
              <p className="text-[#D9A45B]">
                [SITE OWNER NOTICE: Replace this placeholder with your certified legal privacy policy before public distribution.]
              </p>
              <p>
                Streamora does not collect user accounts or store private personal data in this demonstration mode. External links (including sponsored placements) connect to independent third-party websites with their own independent privacy practices and cookies.
              </p>
            </div>
          </div>
        )}

        {type === 'terms' && (
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#D9A45B] mb-2">
              <FileText className="w-4 h-4" />
              <span>Placeholder Terms Sheet</span>
            </div>
            <h3 className="font-serif text-2xl text-[#F6F0E4] mb-4">Terms of Use Placeholder</h3>
            <div className="p-4 bg-[#101722] border border-dashed border-[#475768] rounded-lg text-xs font-mono text-[#B6B2A9] space-y-3 mb-6">
              <p className="text-[#D9A45B]">
                [SITE OWNER NOTICE: Replace this placeholder with your verified legal terms of service.]
              </p>
              <p>
                Streamora operates strictly as an entertainment discovery and editorial-recommendation page. Content and film titles are sample editorial references. Streamora does not stream, host, or download media files.
              </p>
              <p>
                Sponsored partner links open independent third-party destinations. Users access external services at their own discretion.
              </p>
            </div>
          </div>
        )}

        {type === 'contact' && (
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#D9A45B] mb-2">
              <Mail className="w-4 h-4" />
              <span>Editorial Office</span>
            </div>
            <h3 className="font-serif text-2xl text-[#F6F0E4] mb-4">Contact Streamora Cinema Journal</h3>
            <div className="p-4 bg-[#101722] border border-[#34404C] rounded-lg text-xs text-[#B6B2A9] space-y-3 mb-6 font-sans">
              <p>
                For editorial submissions, film festival notices, or publisher inquiries, please connect with the journal team:
              </p>
              <div className="font-mono text-sm text-[#F6F0E4] p-3 bg-[#192331] rounded border border-[#34404C]">
                editorial@streamora-journal.example
              </div>
              <p className="text-[11px] text-[#B6B2A9]/70 italic">
                * Replace with your designated publisher contact mailbox.
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#34404C] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#202C3A] hover:bg-[#D9A45B] hover:text-[#101722] text-[#F6F0E4] rounded transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
