import React from 'react';
import { FilmItem, PROGRAMME_FEATURED_FILMS } from '../data/films';
import { Eye, BookOpen, Clock, Calendar } from 'lucide-react';

interface ProgrammeWallProps {
  onSelectFilm: (film: FilmItem) => void;
}

export const ProgrammeWall: React.FC<ProgrammeWallProps> = ({ onSelectFilm }) => {
  return (
    <section id="programme" className="py-20 lg:py-24 border-b border-[#34404C] bg-[#101722]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pb-6 border-b border-[#34404C]">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#D9A45B] mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D9A45B]" aria-hidden="true" />
              <span>Current Rotation • Spring Edition</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#F6F0E4]">
              Now in the Programme
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#B6B2A9] mt-2 max-w-xl">
              A rotating selection of titles and film-inspired stories curated for thoughtful cinema lovers.
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-xs uppercase tracking-widest text-[#B6B2A9]/60 font-mono">
              Volume 08 · 8 Curated Selections
            </span>
          </div>
        </div>

        {/* Editorial Poster Grid with Asymmetrical Festival-Board Geometry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMME_FEATURED_FILMS.map((film, index) => {
            // Give cards 0 and 5 wider spans or spotlight styling for festival board variance
            const isWide = index === 0 || index === 5;
            return (
              <article
                key={film.id}
                className={`group relative bg-[#192331] border border-[#34404C] hover:border-[#D9A45B]/60 rounded-lg p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/40 ${
                  isWide ? 'md:col-span-2 lg:col-span-2 bg-[#192331]/90' : 'col-span-1'
                }`}
              >
                <div>
                  {/* Card Header & Unboxed Metadata */}
                  <div className="flex items-center justify-between gap-2 text-xs text-[#B6B2A9] mb-4 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="text-[#D9A45B] font-medium tracking-wide uppercase">{film.genre}</span>
                      {film.secondaryGenre && (
                        <>
                          <span className="text-[#34404C]">/</span>
                          <span>{film.secondaryGenre}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[#B6B2A9]/75 font-mono text-[11px]">
                      <span>{film.year}</span>
                      <span>·</span>
                      <span>{film.duration}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#F6F0E4] group-hover:text-[#D9A45B] transition-colors leading-snug mb-3">
                    {film.title}
                  </h3>

                  {/* Short Sample Description */}
                  <p className="font-sans text-sm text-[#B6B2A9] leading-relaxed mb-6">
                    {film.shortDesc}
                  </p>

                  {/* Editorial Note Highlight for wide cards */}
                  {isWide && (
                    <div className="p-3.5 mb-6 rounded bg-[#202C3A]/70 border-l-2 border-[#D9A45B] text-xs text-[#F6F0E4]/90 italic font-serif">
                      "{film.editorialNote}"
                    </div>
                  )}
                </div>

                {/* Card Footer: Metadata & Action */}
                <div className="pt-4 border-t border-[#34404C]/70 flex items-center justify-between gap-3 mt-auto">
                  <span className="text-xs text-[#B6B2A9]/60 font-sans tracking-wide">
                    Dir. {film.director}
                  </span>

                  <button
                    onClick={() => onSelectFilm(film)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#D9A45B] hover:text-[#101722] hover:bg-[#D9A45B] border border-[#D9A45B]/40 hover:border-[#D9A45B] rounded transition-all duration-200 cursor-pointer"
                    aria-label={`View details for ${film.title}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Curator Verification Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#B6B2A9]/60 italic font-sans">
            * Sample editorial content. Film descriptions, durations, and credits are illustrative discoveries.
          </p>
        </div>
      </div>
    </section>
  );
};
