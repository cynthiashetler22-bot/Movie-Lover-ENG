import React from 'react';
import { BookOpen, Sparkles, Compass } from 'lucide-react';
import curatorImg from '../assets/images/curator_dark_sea_1790611816220.jpg';

interface CuratorSpotlightProps {
  onOpenEditorsNote: () => void;
}

export const CuratorSpotlight: React.FC<CuratorSpotlightProps> = ({ onOpenEditorsNote }) => {
  return (
    <section id="spotlight" className="py-20 lg:py-28 border-b border-[#34404C] bg-[#101722]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        
        {/* Curated Editorial Frame */}
        <div className="bg-[#192331] border border-[#34404C] rounded-xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Visual Column (5 cols on lg) */}
            <div className="lg:col-span-6 relative min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] overflow-hidden bg-[#101722]">
              <img
                src={curatorImg}
                alt="Cinematic frame of The King of the Dark Sea sailing through twilight waters"
                className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05] hover:scale-105 transition-transform duration-700"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#192331] via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-[#101722]/85 backdrop-blur-sm border border-[#34404C] rounded text-[11px] font-mono tracking-widest text-[#D9A45B] uppercase">
                35mm Archival Still
              </div>
            </div>

            {/* Editorial Content Column (6 cols on lg) */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
              <div>
                {/* Eyebrow */}
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9A45B]" aria-hidden="true" />
                  <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#D9A45B]">
                    CURATOR’S SPOTLIGHT
                  </span>
                </div>

                {/* Film Title */}
                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#F6F0E4] leading-tight mb-4">
                  The King of the Dark Sea
                </h3>

                {/* Subtitle & Metadata */}
                <div className="flex items-center gap-3 text-xs text-[#B6B2A9] font-sans mb-6">
                  <span>Maritime Epic</span>
                  <span className="text-[#34404C]">·</span>
                  <span>142 min</span>
                  <span className="text-[#34404C]">·</span>
                  <span>Baltic Sea Expedition</span>
                </div>

                {/* Summary Quote */}
                <blockquote className="font-serif italic text-lg sm:text-xl text-[#F6F0E4]/90 border-l-2 border-[#D9A45B] pl-4 mb-6 leading-relaxed">
                  “An epic maritime story of love, ambition, and destiny.”
                </blockquote>

                {/* Curatorial Essay Excerpt */}
                <p className="font-sans text-sm text-[#B6B2A9] leading-relaxed mb-6">
                  Directed with painterly restraint, the film chronicles the solitary struggle of captain and crew confronting relentless North Atlantic storms. Illuminated by lantern light and sea fog, it is an unforgettable meditation on mortality and human resolve against untamed nature.
                </p>

                {/* Sample Notice */}
                <div className="p-3 bg-[#101722]/60 rounded border border-[#34404C]/60 text-xs text-[#B6B2A9]/70 font-mono mb-8">
                  * Sample editorial copy — verify screening rights & availability before publishing.
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-[#34404C]/60 flex items-center justify-between gap-4">
                <button
                  onClick={onOpenEditorsNote}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#101722] bg-[#D9A45B] hover:bg-[#e4b574] rounded transition-all duration-200 cursor-pointer"
                  aria-label="Read the editor's note for The King of the Dark Sea"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>READ THE EDITOR’S NOTE</span>
                </button>

                <span className="text-[11px] text-[#B6B2A9]/60 uppercase font-sans tracking-widest hidden sm:inline-block">
                  Issue No. 42
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
