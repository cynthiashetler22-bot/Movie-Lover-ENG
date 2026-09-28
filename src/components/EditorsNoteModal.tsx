import React, { useEffect } from 'react';
import { X, Sparkles, AlertCircle, BookOpen } from 'lucide-react';
import curatorImg from '../assets/images/curator_dark_sea_1790611816220.jpg';

interface EditorsNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditorsNoteModal: React.FC<EditorsNoteModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="editors-note-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#192331] border border-[#34404C] rounded-xl p-6 sm:p-10 shadow-2xl text-[#F6F0E4] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#B6B2A9] hover:text-[#F6F0E4] hover:bg-[#202C3A] rounded-full transition-colors cursor-pointer"
          aria-label="Close editor's note"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#D9A45B]" aria-hidden="true" />
          <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#D9A45B]">
            CURATOR’S SPOTLIGHT • EDITOR’S ESSAY
          </span>
        </div>

        {/* Title */}
        <h2 id="editors-note-title" className="font-serif text-3xl sm:text-4xl text-[#F6F0E4] font-medium mb-4">
          On “The King of the Dark Sea” & The Maritime Sublime
        </h2>

        {/* Byline */}
        <div className="flex items-center gap-3 text-xs text-[#B6B2A9] font-mono pb-4 mb-6 border-b border-[#34404C]">
          <span>By Curatorial Director Henrik Lind</span>
          <span>·</span>
          <span>Issue No. 42</span>
          <span>·</span>
          <span>12 min reading archive</span>
        </div>

        {/* Archival Banner */}
        <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-[#101722] border border-[#34404C]">
          <img
            src={curatorImg}
            alt="The King of the Dark Sea archival still"
            className="w-full h-full object-cover filter brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-3 left-3 bg-[#101722]/80 backdrop-blur-sm px-3 py-1 rounded text-[11px] font-mono text-[#D9A45B]">
            Fig. 1 — Solitary vessel navigating the North Atlantic swells
          </div>
        </div>

        {/* Essay Body */}
        <div className="prose prose-invert max-w-none text-sm sm:text-base text-[#B6B2A9] space-y-4 font-sans leading-relaxed">
          <p className="font-serif text-lg sm:text-xl text-[#F6F0E4] italic border-l-2 border-[#D9A45B] pl-4">
            “An epic maritime story of love, ambition, and destiny.”
          </p>
          <p>
            Few environments in cinema evoke existential contemplation quite like the boundless ocean at dusk. In <em>The King of the Dark Sea</em>, director Henrik Dahl rejects the frantic editing of contemporary action features in favour of sustained, breathing master shots captured in 65mm on authentic Atlantic waters.
          </p>
          <p>
            The narrative centers upon Captain Einar Voss, whose ancestral schooner becomes the theater for an intense psychological duel between unwavering loyalty and the siren song of undiscovered territories. Dahl’s mastery lies in his tactile attention to physical elements: the creaking of wet timber, the rhythmic heave of swells against ironwood, and the fragile amber glow of oil lanterns cutting through nocturnal squalls.
          </p>
          <p>
            Rather than relying on CGI spectacle, the production embraced practical maritime seamanship, using vintage rigging and genuine natural storms. The result is a monumental meditation on human vulnerability against the indifference of nature.
          </p>
        </div>

        {/* Verification Note */}
        <div className="mt-8 p-4 bg-[#101722] border border-[#34404C] rounded text-xs text-[#B6B2A9] flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#D9A45B] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Sample Editorial Copy:</strong> This note is an illustrative curatorial essay crafted for the Streamora Cinema Journal. Verify publication rights, credits, and historical details before deploying to public channels.
          </p>
        </div>

        {/* Dismiss Button */}
        <div className="mt-6 pt-4 border-t border-[#34404C] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#202C3A] hover:bg-[#D9A45B] hover:text-[#101722] text-[#F6F0E4] rounded transition-colors cursor-pointer"
          >
            Close Essay
          </button>
        </div>

      </div>
    </div>
  );
};
