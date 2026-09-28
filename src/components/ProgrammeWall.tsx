import React from 'react';
import { FilmItem, PROGRAMME_FEATURED_FILMS } from '../data/films';
import { Eye, Download, Star, Film } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface ProgrammeWallProps {
  onSelectFilm: (film: FilmItem) => void;
}

export const ProgrammeWall: React.FC<ProgrammeWallProps> = ({ onSelectFilm }) => {
  const { movies } = useAdmin();

  // Pick top 8 featured movies from dynamic catalogue
  const featuredList = movies.slice(0, 8);

  return (
    <section id="programme" className="py-20 lg:py-24 border-b border-[#34404C] bg-[#101722]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pb-6 border-b border-[#34404C]">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#D9A45B] mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D9A45B]" aria-hidden="true" />
              <span>Trending & Recommended Selection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#F6F0E4]">
              Now in the Programme
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#B6B2A9] mt-2 max-w-xl">
              Curated blockbuster releases and festival discoveries available in high-speed 1080p and 4K mirrors.
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-xs uppercase tracking-widest text-[#B6B2A9]/60 font-mono">
              Top Trending · {featuredList.length} Selected
            </span>
          </div>
        </div>

        {/* Editorial Poster Grid with Asymmetrical Festival-Board Geometry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredList.map((film, index) => {
            const isWide = index === 0 || index === 5;
            return (
              <article
                key={film.id}
                className={`group relative bg-[#192331] border border-[#34404C] hover:border-[#D9A45B]/60 rounded-xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 ${
                  isWide ? 'md:col-span-2 lg:col-span-2 bg-[#192331]/95' : 'col-span-1'
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
                      <span className="text-[#D9A45B] font-bold">{film.quality || '1080p'}</span>
                      <span>·</span>
                      <span>{film.fileSize || '1.8 GB'}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#F6F0E4] group-hover:text-[#D9A45B] transition-colors leading-snug mb-3">
                    {film.title}
                  </h3>

                  {/* Short Description */}
                  <p className="font-sans text-sm text-[#B6B2A9] leading-relaxed mb-6">
                    {film.shortDesc}
                  </p>

                  {/* Editorial Note Highlight for wide cards */}
                  {isWide && film.editorialNote && (
                    <div className="p-3.5 mb-6 rounded-lg bg-[#202C3A]/70 border-l-2 border-[#D9A45B] text-xs text-[#F6F0E4]/90 italic font-serif">
                      "{film.editorialNote}"
                    </div>
                  )}
                </div>

                {/* Card Footer: Metadata & Dual Action (View & Download) */}
                <div className="pt-4 border-t border-[#34404C]/70 flex items-center justify-between gap-3 mt-auto">
                  <span className="text-xs text-[#B6B2A9]/60 font-sans tracking-wide">
                    {film.director ? `Dir. ${film.director}` : 'Curated Selection'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectFilm(film)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#101722] bg-[#D9A45B] hover:bg-[#e4b574] rounded-lg transition-all duration-200 cursor-pointer shadow-sm"
                      aria-label={`Download or view details for ${film.title}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => onSelectFilm(film)}
                      className="p-1.5 text-[#B6B2A9] hover:text-[#F6F0E4] hover:bg-[#202C3A] rounded-lg transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
