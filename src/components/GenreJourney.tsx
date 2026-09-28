import React from 'react';
import { GENRE_ITEMS } from '../data/films';
import { Compass, RotateCcw, Check } from 'lucide-react';

interface GenreJourneyProps {
  selectedGenre: string | null;
  onSelectGenre: (genre: string | null) => void;
}

export const GenreJourney: React.FC<GenreJourneyProps> = ({ selectedGenre, onSelectGenre }) => {
  return (
    <section id="genres" className="py-20 lg:py-24 border-b border-[#34404C] bg-[#101722]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        
        {/* Header & Reset Control */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 pb-6 border-b border-[#34404C]">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#D9A45B] mb-2">
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Curation by Atmosphere</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#F6F0E4]">
              Choose a mood
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#B6B2A9] mt-2 max-w-xl">
              Navigate films by emotional tone, visual rhythm, and thematic territory.
            </p>
          </div>

          {/* Reset Filter Button */}
          <div>
            <button
              onClick={() => onSelectGenre(null)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                selectedGenre === null
                  ? 'bg-[#D9A45B] text-[#101722]'
                  : 'bg-[#192331] text-[#B6B2A9] hover:text-[#F6F0E4] border border-[#34404C]'
              }`}
              aria-pressed={selectedGenre === null}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ALL TITLES</span>
            </button>
          </div>
        </div>

        {/* Large Clean Genre Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {GENRE_ITEMS.map((item) => {
            const isSelected = selectedGenre === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (isSelected) {
                    onSelectGenre(null);
                  } else {
                    onSelectGenre(item.name);
                    const colEl = document.getElementById('collection');
                    if (colEl) {
                      colEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className={`text-left p-6 rounded-lg border transition-all duration-200 group flex flex-col justify-between min-h-[170px] cursor-pointer ${
                  isSelected
                    ? 'bg-[#202C3A] border-[#D9A45B] shadow-lg shadow-[#D9A45B]/10 ring-1 ring-[#D9A45B]'
                    : 'bg-[#192331] border-[#34404C] hover:border-[#D9A45B]/60 hover:bg-[#1d2938]'
                }`}
                aria-pressed={isSelected}
                aria-label={`Filter by ${item.name} mood: ${item.subtitle}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif text-2xl text-[#F6F0E4] group-hover:text-[#D9A45B] transition-colors">
                      {item.name}
                    </span>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-[#D9A45B] text-[#101722]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-xs text-[#B6B2A9] leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-[#34404C]/50 flex items-center justify-between text-[11px] text-[#B6B2A9]/60 font-mono">
                  <span>{item.highlight}</span>
                  <span className="group-hover:text-[#D9A45B] transition-colors">
                    {isSelected ? 'Active Filter' : 'Explore →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Feedback Bar */}
        {selectedGenre && (
          <div className="mt-8 p-4 bg-[#192331] border border-[#D9A45B]/40 rounded-lg flex items-center justify-between text-xs text-[#F6F0E4]">
            <div className="flex items-center gap-2">
              <span className="text-[#D9A45B] font-semibold uppercase tracking-wider">Filtered View:</span>
              <span>Showing curated selections under <strong>{selectedGenre}</strong>.</span>
            </div>
            <button
              onClick={() => onSelectGenre(null)}
              className="text-[#D9A45B] hover:underline font-medium uppercase tracking-wider text-[11px]"
            >
              Clear Filter
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
