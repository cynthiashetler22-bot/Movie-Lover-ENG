import React, { useMemo } from 'react';
import { FilmItem } from '../data/films';
import { Search, Eye, Sparkles, Star, Award } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface CollectionGridProps {
  selectedGenre: string | null;
  onSelectGenre: (genre: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectFilm: (film: FilmItem) => void;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  selectedGenre,
  onSelectGenre,
  searchQuery,
  setSearchQuery,
  onSelectFilm,
}) => {
  const { movies } = useAdmin();
  const genres = ['All', 'Romance', 'Mystery', 'Action', 'Adventure', 'Drama', 'Sci-Fi', 'Documentary'];

  // Filter logic based on genre & search query
  const filteredFilms = useMemo(() => {
    return movies.filter((film) => {
      const matchesGenre = selectedGenre ? film.genre === selectedGenre : true;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        film.title.toLowerCase().includes(query) ||
        film.genre.toLowerCase().includes(query) ||
        (film.director && film.director.toLowerCase().includes(query)) ||
        film.shortDesc.toLowerCase().includes(query);
      return matchesGenre && matchesSearch;
    });
  }, [movies, selectedGenre, searchQuery]);

  return (
    <section id="collection" className="py-20 lg:py-28 border-b border-[#34404C] bg-[#101722]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#34404C]">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#D9A45B] mb-2">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Independent Cinema Directory</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#F6F0E4]">
              The Streamora Collection
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#B6B2A9] mt-2 max-w-xl">
              Browse a curated set of film-inspired titles and editorial discoveries. Smoothly rendered for Tier-1 cinema lovers.
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs uppercase tracking-widest text-[#B6B2A9]/60 font-mono">
              {movies.length} Core Titles · {filteredFilms.length} Visible
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 p-3 bg-[#192331] border border-[#34404C] rounded-xl">
          
          {/* Segmented Genre Filter Controls */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none" role="tablist" aria-label="Genre Filters">
            {genres.map((g) => {
              const isActive = (g === 'All' && selectedGenre === null) || selectedGenre === g;
              return (
                <button
                  key={g}
                  onClick={() => onSelectGenre(g === 'All' ? null : g)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#D9A45B] text-[#101722] font-semibold shadow-sm'
                      : 'text-[#B6B2A9] hover:text-[#F6F0E4] hover:bg-[#202C3A]'
                  }`}
                  role="tab"
                  aria-selected={isActive}
                >
                  {g}
                </button>
              );
            })}
          </div>

          {/* Search Input Bar */}
          <div className="relative min-w-[260px] sm:min-w-[300px]">
            <Search className="w-4 h-4 text-[#B6B2A9] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, director, keyword..."
              className="w-full pl-9 pr-4 py-2 bg-[#101722] text-[#F6F0E4] text-xs rounded-lg border border-[#34404C] focus:border-[#D9A45B] focus:outline-none placeholder-[#B6B2A9]/50"
              aria-label="Filter collection"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#B6B2A9] hover:text-[#F6F0E4] cursor-pointer"
                aria-label="Clear search query"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Empty Search State */}
        {filteredFilms.length === 0 ? (
          <div className="py-20 text-center bg-[#192331]/50 border border-dashed border-[#34404C] rounded-xl p-8">
            <p className="font-serif text-2xl text-[#F6F0E4] mb-2">No matching titles discovered</p>
            <p className="text-sm text-[#B6B2A9] mb-6">
              No entries match "{searchQuery}" under the selected category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectGenre(null);
              }}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#D9A45B] text-[#101722] rounded-lg hover:bg-[#e4b574] transition-colors cursor-pointer"
            >
              Reset Filters & Search
            </button>
          </div>
        ) : (
          /* Responsive High-End Movie Poster Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFilms.map((film, idx) => (
              <article
                key={film.id}
                className="group bg-[#192331] border border-[#34404C] hover:border-[#D9A45B]/60 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
              >
                <div>
                  {/* Poster Thumbnail (High aesthetics) */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#101722]">
                    {film.posterUrl ? (
                      <img
                        src={film.posterUrl}
                        alt={`${film.title} movie poster`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#192331] to-[#101722]">
                        <Award className="w-10 h-10 text-[#D9A45B]/60 mb-2" />
                        <span className="font-serif text-lg text-[#F6F0E4]">{film.title}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#192331] via-transparent to-transparent opacity-80" />

                    {/* Floating score badge */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#101722]/85 backdrop-blur-sm border border-[#34404C] text-[11px] font-mono text-[#D9A45B] flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-[#D9A45B] text-[#D9A45B]" />
                      <span>{film.ratingScore || '8.7'}</span>
                    </div>

                    {/* Floating genre pill */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#101722]/90 backdrop-blur-sm border border-[#34404C] rounded text-[10px] font-sans font-medium uppercase tracking-wider text-[#D9A45B]">
                      {film.genre}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    {/* Title */}
                    <h3 className="font-serif text-xl sm:text-2xl text-[#F6F0E4] group-hover:text-[#D9A45B] transition-colors leading-snug mb-1 line-clamp-1">
                      {film.title}
                    </h3>

                    {/* Director & Year */}
                    <div className="flex items-center gap-2 text-xs text-[#B6B2A9]/75 font-sans mb-3">
                      <span>{film.year}</span>
                      <span>·</span>
                      <span>{film.duration}</span>
                      {film.director && (
                        <>
                          <span>·</span>
                          <span className="truncate">Dir. {film.director}</span>
                        </>
                      )}
                    </div>

                    {/* Short Description */}
                    <p className="font-sans text-xs text-[#B6B2A9] leading-relaxed line-clamp-2 mb-2">
                      {film.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Card Action */}
                <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-[#34404C]/40 pt-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#B6B2A9]/50 font-mono">
                    #{String(idx + 1).padStart(2, '0')}
                  </span>

                  <button
                    onClick={() => onSelectFilm(film)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#F6F0E4] group-hover:text-[#101722] group-hover:bg-[#D9A45B] border border-[#34404C] group-hover:border-[#D9A45B] rounded-lg transition-all cursor-pointer shadow-sm"
                    aria-label={`View details for ${film.title}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Verification Note */}
        <div className="mt-12 text-center border-t border-[#34404C]/50 pt-6">
          <p className="text-xs text-[#B6B2A9]/60 italic font-sans max-w-2xl mx-auto">
            These editorial discovery items are curated for film discovery. Streamora does not host video files or broadcast films. Verify catalogue availability before publishing.
          </p>
        </div>

      </div>
    </section>
  );
};
