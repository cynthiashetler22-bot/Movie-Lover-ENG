import React, { useState, useEffect } from 'react';
import { FilmItem } from '../data/films';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Star, 
  Calendar, 
  Clock, 
  Sparkles, 
  Play, 
  Eye, 
  Flame,
  Volume2
} from 'lucide-react';

interface MovieSliderProps {
  movies: FilmItem[];
  onSelectFilm: (film: FilmItem) => void;
}

export const MovieSlider: React.FC<MovieSliderProps> = ({ movies, onSelectFilm }) => {
  // Select top 6 trending/blockbuster movies for the slider
  const sliderMovies = React.useMemo(() => {
    if (!movies || movies.length === 0) return [];
    // Prioritize movies marked as editorialPick, or 4K/top rated
    const featured = movies.filter(m => m.editorialPick || m.featuredSlider || (m.ratingScore && parseFloat(m.ratingScore) >= 8.5));
    if (featured.length >= 4) return featured.slice(0, 6);
    return movies.slice(0, 6);
  }, [movies]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 5 seconds unless paused by mouse hover
  useEffect(() => {
    if (sliderMovies.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderMovies.length, isPaused]);

  if (sliderMovies.length === 0) return null;

  const currentFilm = sliderMovies[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + sliderMovies.length) % sliderMovies.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % sliderMovies.length);
  };

  return (
    <div 
      className="relative w-full bg-[#080D14] overflow-hidden select-none border-b border-[#1E293B]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Cinematic Backdrop Image with smooth crossfade */}
      <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] max-h-[85vh]">
        {sliderMovies.map((film, idx) => (
          <div
            key={film.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image / Poster Backdrop */}
            <div className="absolute inset-0 bg-[#080D14]">
              <img
                src={film.backdropUrl || film.posterUrl}
                alt={film.title}
                className="w-full h-full object-cover object-center filter brightness-40 blur-[1px] scale-105 transform transition-transform duration-10000"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              {/* Heavy gradients for high-end cinematic contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080D14] via-[#080D14]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080D14] via-[#080D14]/80 to-transparent" />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#080D14]/40 to-[#080D14]" />
            </div>
          </div>
        ))}

        {/* Foreground Content Container */}
        <div className="relative z-20 max-w-[1320px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full py-12">
            
            {/* Left Column: Movie Info & Action CTAs */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Top Badges Bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-red-900/40 animate-pulse">
                  <Flame className="w-3.5 h-3.5" />
                  Trending Featured
                </span>

                <span className="px-3 py-1 rounded-full bg-[#D9A45B] text-black text-[11px] font-black uppercase tracking-wider shadow-md">
                  {currentFilm.quality || '4K ULTRA HD'}
                </span>

                <span className="px-3 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-emerald-400 text-[11px] font-mono font-medium flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  {currentFilm.audioTracks || 'Dual Audio [Eng + Hindi]'}
                </span>

                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{currentFilm.ratingScore || '8.8'} / 10</span>
                </div>
              </div>

              {/* Movie Title */}
              <h1 
                onClick={() => onSelectFilm(currentFilm)}
                className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight cursor-pointer hover:text-[#D9A45B] transition-colors drop-shadow-md"
              >
                {currentFilm.title}
              </h1>

              {/* Meta details: Year, Duration, Genre, Director */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300 font-mono">
                <span className="flex items-center gap-1 text-slate-300">
                  <Calendar className="w-4 h-4 text-[#D9A45B]" />
                  {currentFilm.year}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-4 h-4 text-[#D9A45B]" />
                  {currentFilm.duration}
                </span>
                <span>•</span>
                <span className="px-2.5 py-0.5 rounded bg-slate-800 text-[#D9A45B] font-semibold">
                  {currentFilm.genre}
                </span>
                {currentFilm.director && (
                  <>
                    <span>•</span>
                    <span className="text-slate-400">Dir. <strong className="text-white">{currentFilm.director}</strong></span>
                  </>
                )}
              </div>

              {/* Storyline Synopsis */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl line-clamp-3 font-sans">
                {currentFilm.synopsis || currentFilm.shortDesc}
              </p>

              {/* Download & Watch Action Buttons (Moviebaaz style) */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => onSelectFilm(currentFilm)}
                  className="px-6 sm:px-8 py-3.5 bg-[#D9A45B] hover:bg-[#E5B573] text-black font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2.5"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Full Movie</span>
                </button>

                <button
                  onClick={() => onSelectFilm(currentFilm)}
                  className="px-5 sm:px-7 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:border-[#D9A45B] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Eye className="w-4 h-4 text-[#D9A45B]" />
                  <span>View Details & Links</span>
                </button>
              </div>

            </div>

            {/* Right Column: High Quality Poster Showcase */}
            <div className="hidden lg:flex lg:col-span-4 justify-end">
              <div 
                onClick={() => onSelectFilm(currentFilm)}
                className="group relative w-64 xl:w-72 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-slate-700/60 hover:border-[#D9A45B] shadow-2xl shadow-black/80 cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
              >
                <img
                  src={currentFilm.posterUrl}
                  alt={currentFilm.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-center">
                  <span className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#D9A45B] text-black font-bold text-xs">
                    <Download className="w-4 h-4" /> Download Now
                  </span>
                </div>

                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-sm border border-slate-700 text-[11px] font-mono text-[#D9A45B] font-bold">
                  {currentFilm.quality || '4K UHD'}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#D9A45B] text-white hover:text-black backdrop-blur-md border border-white/10 hover:border-[#D9A45B] transition-all cursor-pointer shadow-xl"
          aria-label="Previous Featured Movie"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#D9A45B] text-white hover:text-black backdrop-blur-md border border-white/10 hover:border-[#D9A45B] transition-all cursor-pointer shadow-xl"
          aria-label="Next Featured Movie"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicator Dots & Mini Strip */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {sliderMovies.map((film, idx) => (
            <button
              key={film.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'w-8 bg-[#D9A45B]' : 'w-2 bg-slate-600 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
