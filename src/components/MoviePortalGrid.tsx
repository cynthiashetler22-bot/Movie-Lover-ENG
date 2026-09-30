import React, { useState, useMemo } from 'react';
import { FilmItem } from '../data/films';
import { 
  Search, 
  Download, 
  Star, 
  Film, 
  Tv, 
  Sparkles, 
  SlidersHorizontal, 
  Volume2, 
  ArrowUpDown,
  Filter,
  Flame,
  Check
} from 'lucide-react';

interface MoviePortalGridProps {
  movies: FilmItem[];
  onSelectFilm: (film: FilmItem) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre: string | null;
  setSelectedGenre: (genre: string | null) => void;
}

export const MoviePortalGrid: React.FC<MoviePortalGridProps> = ({
  movies,
  onSelectFilm,
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
}) => {
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'rating' | 'title'>('latest');

  const genres = [
    'All',
    'Action',
    'Sci-Fi',
    'Adventure',
    'Drama',
    'Romance',
    'Mystery',
    'Horror',
    'Comedy',
    'Documentary'
  ];

  const qualities = [
    { label: 'All Qualities', value: 'all' },
    { label: '4K Ultra HD', value: '4k' },
    { label: '1080p Full HD', value: '1080p' },
    { label: '720p HD', value: '720p' },
    { label: '480p SD (Mobile)', value: '480p' },
  ];

  // Filtering logic
  const filteredMovies = useMemo(() => {
    return movies.filter((film) => {
      // 1. Genre filter
      const matchesGenre = selectedGenre && selectedGenre !== 'All' 
        ? film.genre.toLowerCase() === selectedGenre.toLowerCase() || film.secondaryGenre?.toLowerCase() === selectedGenre.toLowerCase()
        : true;

      // 2. Quality filter
      const matchesQuality = selectedQuality === 'all'
        ? true
        : film.quality?.toLowerCase().includes(selectedQuality);

      // 3. Category / Type filter (Movie vs Series)
      const matchesType = selectedType === 'all'
        ? true
        : (film.category || 'movie') === selectedType;

      // 4. Search Query
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query ||
        film.title.toLowerCase().includes(query) ||
        film.genre.toLowerCase().includes(query) ||
        (film.director && film.director.toLowerCase().includes(query)) ||
        (film.cast && film.cast.toLowerCase().includes(query)) ||
        (film.audioTracks && film.audioTracks.toLowerCase().includes(query)) ||
        film.shortDesc.toLowerCase().includes(query);

      return matchesGenre && matchesQuality && matchesType && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return (parseFloat(b.ratingScore || '0') - parseFloat(a.ratingScore || '0'));
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // default: latest (year descending or original index)
      return b.year - a.year;
    });
  }, [movies, selectedGenre, selectedQuality, selectedType, searchQuery, sortBy]);

  return (
    <section id="movies" className="py-12 bg-[#0B0F17] text-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Category Bar */}
        <div className="mb-8 space-y-5">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#D9A45B] mb-1">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Global Entertainment Catalogue</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white">
                Explore Movies & TV Series
              </h2>
            </div>

            {/* Quick stats & Type switch */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#131B27] p-1 rounded-xl border border-[#233145]">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedType === 'all' ? 'bg-[#D9A45B] text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Titles ({movies.length})
                </button>
                <button
                  onClick={() => setSelectedType('movie')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedType === 'movie' ? 'bg-[#D9A45B] text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  Movies
                </button>
                <button
                  onClick={() => setSelectedType('series')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedType === 'series' ? 'bg-[#D9A45B] text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  TV Series
                </button>
              </div>
            </div>
          </div>

          {/* Search & Quality Filter Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[#121A26] border border-[#202C3F] p-3 sm:p-4 rounded-2xl shadow-lg">
            
            {/* Search Input Box */}
            <div className="lg:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies by title, actor, director, genre, 4K..."
                className="w-full pl-10 pr-10 py-2.5 bg-[#0A0E17] text-white text-xs sm:text-sm rounded-xl border border-[#233145] focus:border-[#D9A45B] focus:outline-none placeholder-slate-500 font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quality Selector */}
            <div className="lg:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {qualities.map((q) => (
                <button
                  key={q.value}
                  onClick={() => setSelectedQuality(q.value)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    selectedQuality === q.value
                      ? 'bg-[#1E2C3F] text-[#D9A45B] border border-[#D9A45B]/60 shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#182333]'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="lg:col-span-3 flex items-center justify-end gap-2 text-xs">
              <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">Sort:</span>
              <div className="flex bg-[#0A0E17] rounded-xl p-1 border border-[#233145]">
                <button
                  onClick={() => setSortBy('latest')}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] ${
                    sortBy === 'latest' ? 'bg-[#D9A45B] text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Latest
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] ${
                    sortBy === 'rating' ? 'bg-[#D9A45B] text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⭐ Rating
                </button>
                <button
                  onClick={() => setSortBy('title')}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] ${
                    sortBy === 'title' ? 'bg-[#D9A45B] text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  A-Z
                </button>
              </div>
            </div>

          </div>

          {/* Genre Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {genres.map((g) => {
              const isActive = (g === 'All' && !selectedGenre) || selectedGenre === g;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g === 'All' ? null : g)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#D9A45B] text-black shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-[#131B27] text-slate-300 hover:text-white hover:bg-[#1C2636] border border-[#233145]'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredMovies.length === 0 ? (
          <div className="py-24 text-center bg-[#101724] border border-dashed border-[#233145] rounded-3xl p-8">
            <Film className="w-14 h-14 text-slate-600 mx-auto mb-3" />
            <h3 className="font-serif text-2xl font-bold text-white mb-2">No matching titles found</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto font-sans">
              We couldn't find any movie matching "{searchQuery}" under the selected filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre(null);
                setSelectedQuality('all');
                setSelectedType('all');
              }}
              className="px-5 py-2.5 bg-[#D9A45B] hover:bg-[#E5B573] text-black font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Moviebaaz-Style High-Impact Poster Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredMovies.map((film) => (
              <article
                key={film.id}
                className="group flex flex-col bg-[#111824] border border-[#1E2B3E] hover:border-[#D9A45B] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Clickable Movie Poster Card (Top Half) */}
                <div 
                  onClick={() => onSelectFilm(film)}
                  className="relative aspect-[2/3] w-full overflow-hidden bg-[#0A0E17] cursor-pointer"
                >
                  <img
                    src={film.posterUrl}
                    alt={film.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 filter brightness-95"
                    loading="lazy"
                  />

                  {/* Top-Left Audio Badge (Moviebaaz feature) */}
                  <div className="absolute top-2 left-2 max-w-[70%]">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-sm border border-white/10 text-[9px] sm:text-[10px] font-mono font-semibold text-emerald-300 truncate shadow">
                      <Volume2 className="w-2.5 h-2.5 shrink-0 text-emerald-400" />
                      <span className="truncate">{film.audioTracks || 'Dual Audio'}</span>
                    </span>
                  </div>

                  {/* Top-Right Quality Badge (Moviebaaz feature) */}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#D9A45B] text-black text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow">
                      {film.quality?.includes('4K') ? '4K UHD' : film.quality || '1080p'}
                    </span>
                  </div>

                  {/* Rating Badge on bottom-right of poster */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-sm border border-slate-700 text-[10px] font-mono text-amber-400 font-bold shadow">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span>{film.ratingScore || '8.8'}</span>
                  </div>

                  {/* Genre pill on bottom-left */}
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-slate-700 text-[9px] font-sans font-medium text-slate-300">
                      {film.genre}
                    </span>
                  </div>

                  {/* Hover Overlay with Instant Download Icon */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                    <div className="w-11 h-11 rounded-full bg-[#D9A45B] text-black flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform mb-2">
                      <Download className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white font-mono uppercase tracking-wider">
                      Instant Download
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono mt-0.5">
                      480p • 720p • 1080p • 4K
                    </span>
                  </div>
                </div>

                {/* Card Info & Details (Bottom Half) */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    {/* Title: 100% Clickable to open movie! */}
                    <h3 
                      onClick={() => onSelectFilm(film)}
                      className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-[#D9A45B] transition-colors line-clamp-1 leading-snug cursor-pointer"
                      title={film.title}
                    >
                      {film.title}
                    </h3>

                    {/* Year & Duration */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
                      <span>{film.year}</span>
                      <span>•</span>
                      <span>{film.duration}</span>
                      {film.fileSize && (
                        <>
                          <span>•</span>
                          <span className="text-slate-300">{film.fileSize}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA Button: Direct Download trigger */}
                  <button
                    onClick={() => onSelectFilm(film)}
                    className="w-full py-2 bg-[#172232] hover:bg-[#D9A45B] text-slate-200 hover:text-black font-bold text-[11px] font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-[#233145] hover:border-[#D9A45B]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
