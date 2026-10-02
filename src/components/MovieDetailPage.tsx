import React, { useState, useEffect, useRef } from 'react';
import { FilmItem } from '../data/films';
import { 
  ArrowLeft, Download, Play, Star, Calendar, Clock, 
  Film, HardDrive, Volume2, ShieldCheck, CheckCircle2, 
  Sparkles, ExternalLink, RefreshCw, Zap, Eye, Check, ChevronRight
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { AdBannerSlot } from './AdBannerSlot';
import { triggerPopunder, getGenuineMovieDownloadUrl, DEFAULT_HILLTOPADS_POPUNDER_URL } from '../utils/popunder';

interface MovieDetailPageProps {
  film: FilmItem;
  onBackToHome: () => void;
  onSelectFilm: (film: FilmItem) => void;
  onNavigateToDownload?: (quality: '480p' | '720p' | '1080p' | '4k') => void;
  allMovies: FilmItem[];
}

export const MovieDetailPage: React.FC<MovieDetailPageProps> = ({
  film,
  onBackToHome,
  onSelectFilm,
  onNavigateToDownload,
  allMovies,
}) => {
  const { activeAdsterraLink } = useAdmin();

  // Scroll to top when film changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [film]);

  // Handle Quality Download Click -> Navigates to dedicated download page!
  const handleQualityClick = (quality: '480p' | '720p' | '1080p' | '4k') => {
    triggerPopunder();
    if (onNavigateToDownload) {
      onNavigateToDownload(quality);
    } else {
      window.location.hash = `#download/${film.id}/${quality}`;
    }
  };

  // Handle Watch Online click
  const handleWatchOnlineClick = () => {
    triggerPopunder();
    const realStreamUrl = film.watchOnlineUrl || film.masterVideoLink || '';
    if (realStreamUrl && !realStreamUrl.includes('YOUR_ADSTERRA_LINK')) {
      window.open(realStreamUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Default to 1080p download page
      handleQualityClick('1080p');
    }
  };

  // Related movies
  const relatedMovies = allMovies.filter((m) => m.id !== film.id).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#070B12] text-white">
      {/* Top Banner Ad */}
      <AdBannerSlot slot="top_banner" className="my-1 py-1" />

      {/* Main Container */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Breadcrumb Navigation & Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121A26] hover:bg-[#1A2535] text-[#D9A45B] hover:text-white border border-[#233145] rounded-xl transition-all cursor-pointer font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="hover:text-slate-200 cursor-pointer" onClick={onBackToHome}>Movies</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#F6F0E4] font-medium truncate max-w-xs">{film.title} ({film.year})</span>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 text-[10px] font-mono">
            Verified Cloud Server Ready
          </span>
        </div>

        {/* Moviebaaz-style Main Post Headline */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
              {film.year}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#1B2638] text-[#D9A45B] border border-[#293B52] text-xs font-mono font-bold">
              {film.quality || '1080p FHD'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-950/70 text-blue-300 border border-blue-800/40 text-xs font-mono">
              {film.audioTracks || 'Dual Audio [Hindi + Eng]'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-rose-950/70 text-rose-300 border border-rose-800/40 text-xs font-mono font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-rose-300" />
              <span>{film.ratingScore || '8.8'}/10</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#F6F0E4] leading-snug tracking-tight">
            Download {film.title} ({film.year}) {film.audioTracks || 'Dual Audio [Hindi + Eng]'} {film.quality || '1080p | 720p | 480p'} Full Movie Web-DL
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
            {film.shortDesc}
          </p>
        </div>

        {/* Moviebaaz Info & Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-[#0D1420] border border-[#1E2B3E] rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Left Column: Movie Poster */}
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#28384D] shadow-2xl aspect-[2/3] bg-[#070B12] group">
              <img
                src={film.posterUrl}
                alt={`${film.title} Poster`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-[#334155] text-xs font-mono text-[#D9A45B] font-bold">
                {film.quality || '1080p FHD'}
              </div>
            </div>

            {/* Quick Specs Pill Box */}
            <div className="p-4 bg-[#090E17] border border-[#1E2B3E] rounded-2xl space-y-2 text-xs font-mono text-slate-400">
              <div className="flex justify-between">
                <span>File Size:</span>
                <span className="text-white font-bold">{film.fileSize || '1.8 GB'}</span>
              </div>
              <div className="flex justify-between">
                <span>Audio:</span>
                <span className="text-emerald-400 font-bold">{film.audioTracks || 'Dual Audio [Hindi+Eng]'}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="text-white">{film.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtitles:</span>
                <span className="text-amber-300">{film.subtitles || 'English [Muxed]'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Moviebaaz Table & Storyline */}
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            {/* Moviebaaz Specification Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#D9A45B] flex items-center gap-2 border-b border-slate-800 pb-2">
                <Film className="w-4 h-4 text-[#D9A45B]" />
                <span>Movie Information & Details</span>
              </h3>

              <div className="bg-[#090E17] border border-[#1E2B3E] rounded-2xl divide-y divide-[#1A2535] text-xs font-sans">
                <div className="p-3 grid grid-cols-3">
                  <span className="text-slate-400 font-semibold">Movie Title:</span>
                  <span className="col-span-2 text-white font-bold">{film.title}</span>
                </div>
                <div className="p-3 grid grid-cols-3">
                  <span className="text-slate-400 font-semibold">Release Year:</span>
                  <span className="col-span-2 text-white font-bold">{film.year}</span>
                </div>
                <div className="p-3 grid grid-cols-3">
                  <span className="text-slate-400 font-semibold">Genres:</span>
                  <span className="col-span-2 text-[#D9A45B] font-semibold">{film.genre} {film.secondaryGenre ? `• ${film.secondaryGenre}` : ''}</span>
                </div>
                <div className="p-3 grid grid-cols-3">
                  <span className="text-slate-400 font-semibold">Director:</span>
                  <span className="col-span-2 text-slate-200">{film.director}</span>
                </div>
                <div className="p-3 grid grid-cols-3">
                  <span className="text-slate-400 font-semibold">Starring / Cast:</span>
                  <span className="col-span-2 text-slate-200">{film.cast || 'International Festival Ensemble'}</span>
                </div>
                <div className="p-3 grid grid-cols-3">
                  <span className="text-slate-400 font-semibold">Language / Audio:</span>
                  <span className="col-span-2 text-emerald-400 font-bold">{film.audioTracks || 'Dual Audio [Hindi 5.1 + English Clean Audio]'}</span>
                </div>
                <div className="p-3 grid grid-cols-3">
                  <span className="text-slate-400 font-semibold">Available Formats:</span>
                  <span className="col-span-2 text-amber-300 font-mono">480p, 720p, 1080p, 4K UHD</span>
                </div>
              </div>
            </div>

            {/* Synopsis / Storyline Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#D9A45B] flex items-center gap-2">
                <span>Storyline / Synopsis</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#090E17] border border-[#1E2B3E] rounded-2xl p-4">
                {film.synopsis || film.shortDesc}
              </p>
            </div>

            {/* Watch Online Stream Button (Moviebaaz feature) */}
            <div className="p-4 bg-gradient-to-r from-[#141E2C] to-[#0E1520] border border-[#24354A] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white block">Watch Online Full Movie</span>
                <span className="text-[11px] text-slate-400">Stream directly in browser with multi-audio & subtitles</span>
              </div>
              <button
                onClick={handleWatchOnlineClick}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Stream Online Player</span>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Banner Ad */}
        <AdBannerSlot slot="middle_placement" />

        {/* ========================================================================= */}
        {/* MOVIEBAAZ EXACT 4-STEP MONETIZED DOWNLOAD GATEWAY ENGINE                  */}
        {/* ========================================================================= */}
        <div 
          id="download-gateway"
          className="bg-gradient-to-b from-[#101724] to-[#0A0F18] border-2 border-[#D9A45B]/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#25354A] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-1.5">
                <Zap className="w-3.5 h-3.5 fill-amber-300" />
                <span>High-Speed Cloud Mirror Servers</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-[#F6F0E4] tracking-tight">
                Download {film.title} Links (480p, 720p, 1080p, 4K)
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Safe & Clean</span>
            </span>
          </div>

          {/* STAGE A: 4 Quality Download Buttons (Navigates to dedicated separate download page) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: '480p' as const, name: '480p SD', size: '~450 MB', desc: 'Mobile Quality • Low Data Usage', color: 'text-white' },
              { id: '720p' as const, name: '720p HD', size: '~950 MB', desc: 'Standard HD • Clear Audio & Video', color: 'text-sky-400' },
              { id: '1080p' as const, name: '1080p FHD', size: '~1.8 GB', desc: 'Full HD 1080p • 5.1 Surround', color: 'text-[#D9A45B]', popular: true },
              { id: '4k' as const, name: '4K UHD', size: '~5.5 GB', desc: 'Ultra High Bitrate • 2160p Cinema', color: 'text-amber-400' },
            ].map((q) => (
              <div
                key={q.id}
                onClick={() => handleQualityClick(q.id)}
                className="p-4 rounded-2xl border bg-[#0B1019] border-[#223145] hover:border-[#D9A45B] hover:bg-[#121A26] transition-all cursor-pointer text-left space-y-2 relative group shadow-lg"
              >
                {q.popular && (
                  <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#D9A45B] text-black text-[9px] font-black uppercase tracking-wider shadow">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className={`font-extrabold text-sm ${q.color}`}>{q.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182333] text-slate-300">{q.size}</span>
                </div>
                <p className="text-[11px] text-slate-400">{q.desc}</p>
                <button
                  type="button"
                  className={`w-full mt-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    q.popular
                      ? 'bg-[#D9A45B] hover:bg-[#E5B573] text-black shadow'
                      : 'bg-[#1B2738] group-hover:bg-[#D9A45B] text-slate-200 group-hover:text-black'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {q.name} →</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner Ad */}
        <AdBannerSlot slot="bottom_placement" />

        {/* You Might Also Like / Related Movies */}
        {relatedMovies.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <h3 className="text-lg font-bold text-[#F6F0E4] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D9A45B]" />
              <span>You Might Also Like (More Movies)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4">
              {relatedMovies.map((relFilm) => (
                <div
                  key={relFilm.id}
                  onClick={() => {
                    triggerPopunder();
                    onSelectFilm(relFilm);
                  }}
                  className="bg-[#0D1420] border border-[#1E2B3E] hover:border-[#D9A45B] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  <div className="aspect-[2/3] overflow-hidden bg-black/50 relative">
                    <img
                      src={relFilm.posterUrl}
                      alt={relFilm.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#D9A45B]">
                      {relFilm.quality || '1080p'}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-xs text-white group-hover:text-[#D9A45B] truncate">
                      {relFilm.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>{relFilm.year}</span>
                      <span>★ {relFilm.ratingScore || '8.8'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
