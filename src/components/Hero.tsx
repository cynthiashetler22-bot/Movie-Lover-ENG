import React from 'react';
import { ArrowDown, Film, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/hero_cinema_journal_1790611801883.jpg';

export const Hero: React.FC = () => {
  return (
    <section 
      id="top" 
      className="relative min-h-[82vh] flex items-center justify-center text-center overflow-hidden border-b border-[#34404C]"
    >
      {/* Cinematic Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Atmospheric vintage cinema hall with golden projector glow"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.08] scale-105 transform animate-pulse duration-[12000ms]"
          referrerPolicy="no-referrer"
          loading="eager"
        />
        {/* Multilayered subtle dark overlay to ensure WCAG AA contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101722] via-[#101722]/80 to-[#101722]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#101722]/60 to-[#101722]" />
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-[920px] mx-auto px-4 sm:px-6 py-20 lg:py-28 flex flex-col items-center">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <Film className="w-3.5 h-3.5 text-[#D9A45B]" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[0.25em] text-[#D9A45B]">
            THE STREAMORA FILM JOURNAL
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[#F6F0E4] leading-[1.12] mb-6 max-w-4xl text-balance">
          A world of stories, <span className="italic text-[#D9A45B] font-normal">selected for you.</span>
        </h1>

        {/* Short Introduction */}
        <p className="font-sans text-base sm:text-lg md:text-xl text-[#B6B2A9] max-w-2xl font-light leading-relaxed mb-8">
          Discover film-inspired collections, genre guides, and thoughtful editorial picks for your next movie night.
        </p>

        {/* Compact Visual Stamp */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#34404C] bg-[#192331]/80 backdrop-blur-sm text-[11px] font-sans tracking-[0.18em] uppercase text-[#F6F0E4]/90 mb-10">
          <Sparkles className="w-3 h-3 text-[#D9A45B]" aria-hidden="true" />
          <span>Curated Discovery</span>
          <span className="text-[#34404C]" aria-hidden="true">•</span>
          <span>Independent Editorial</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="#programme"
            className="w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#101722] bg-[#D9A45B] hover:bg-[#e8b672] rounded transition-all duration-200 shadow-lg shadow-[#D9A45B]/10 whitespace-nowrap flex items-center justify-center gap-2"
          >
            <span>Explore the Programme</span>
            <ArrowDown className="w-4 h-4" />
          </a>
          <a
            href="#genres"
            className="w-full sm:w-auto px-7 py-3.5 text-xs sm:text-sm font-medium tracking-wider uppercase text-[#F6F0E4] bg-[#192331]/90 hover:bg-[#202C3A] border border-[#34404C] hover:border-[#D9A45B]/50 rounded transition-all duration-200 whitespace-nowrap"
          >
            Browse by Genre
          </a>
        </div>

        {/* Subtle Non-Streaming Editorial Badge */}
        <div className="mt-12 text-xs text-[#B6B2A9]/70 tracking-wide font-sans max-w-md">
          <span>Cinema reflections & recommendations · No file hosting or direct playback</span>
        </div>
      </div>
    </section>
  );
};
