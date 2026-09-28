import React from 'react';
import { ArrowUpRight, Film, Sparkles } from 'lucide-react';

export const EditorialCTA: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-[#101722] border-b border-[#34404C] relative overflow-hidden">
      {/* Subtle atmospheric background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D9A45B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[880px] mx-auto px-4 sm:px-6 text-center relative z-10">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.25em] text-[#D9A45B] mb-4">
          <Film className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Curated For The Curious</span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#F6F0E4] leading-tight mb-5">
          Your next story is waiting.
        </h2>

        {/* Supporting text */}
        <p className="font-sans text-base sm:text-lg text-[#B6B2A9] max-w-xl mx-auto leading-relaxed mb-8">
          Explore a collection, choose a genre, and discover a new film-inspired favorite for your evening screen.
        </p>

        {/* Action Button linking strictly to internal section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#programme"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#101722] bg-[#D9A45B] hover:bg-[#e4b574] rounded transition-all duration-200 shadow-xl shadow-[#D9A45B]/10 cursor-pointer"
          >
            <span>Explore The Programme</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <a
            href="#genres"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-medium tracking-wider uppercase text-[#F6F0E4] bg-[#192331] hover:bg-[#202C3A] border border-[#34404C] rounded transition-all duration-200 cursor-pointer"
          >
            <span>Choose A Mood</span>
          </a>
        </div>

        {/* Editorial Subnote */}
        <div className="mt-8 text-xs text-[#B6B2A9]/50 font-sans tracking-wide">
          Independent curation · Film festival archives · Editorial notes
        </div>

      </div>
    </section>
  );
};
