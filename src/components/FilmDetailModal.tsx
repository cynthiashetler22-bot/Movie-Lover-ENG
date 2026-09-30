import React, { useEffect, useState } from 'react';
import { FilmItem } from '../data/films';
import { 
  X, Calendar, Clock, Download, ExternalLink, Star, 
  Sparkles, ShieldCheck, Film, HardDrive, Play, ArrowDownToLine,
  Volume2, Check, Smartphone, Monitor, Tv
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface FilmDetailModalProps {
  film: FilmItem | null;
  onClose: () => void;
}

export const FilmDetailModal: React.FC<FilmDetailModalProps> = ({ film, onClose }) => {
  const { ads, activeAdsterraLink } = useAdmin();
  const [downloadStep, setDownloadStep] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [selectedQuality, setSelectedQuality] = useState<'480p' | '720p' | '1080p' | '4k'>('1080p');

  // Find modal ad if configured
  const modalAd = ads.find(a => a.slot === 'detail_modal_ad' && a.enabled);
  const targetModalAdUrl = modalAd?.directLinkUrl === 'YOUR_ADSTERRA_LINK' && activeAdsterraLink !== 'YOUR_ADSTERRA_LINK'
    ? activeAdsterraLink
    : modalAd?.directLinkUrl || activeAdsterraLink;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (film) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setDownloadStep('idle');
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [film, onClose]);

  if (!film) return null;

  // Resolve download link for chosen quality
  const getDownloadUrl = (quality: '480p' | '720p' | '1080p' | '4k') => {
    if (quality === '480p') {
      return film.downloadLink480p || film.downloadLink720p || film.masterVideoLink || activeAdsterraLink;
    }
    if (quality === '720p') {
      return film.downloadLink720p || film.masterVideoLink || activeAdsterraLink;
    }
    if (quality === '4k') {
      return film.downloadLink4k || film.downloadLink1080p || film.masterVideoLink || activeAdsterraLink;
    }
    return film.downloadLink1080p || film.masterVideoLink || activeAdsterraLink;
  };

  const handleStartDownload = (quality: '480p' | '720p' | '1080p' | '4k') => {
    setSelectedQuality(quality);
    setDownloadStep('generating');
    setTimeout(() => {
      setDownloadStep('ready');
      const targetUrl = getDownloadUrl(quality);
      if (targetUrl && targetUrl !== 'YOUR_ADSTERRA_LINK') {
        window.open(targetUrl, '_blank', 'noopener,noreferrer,sponsored');
      }
    }, 700);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="film-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#121A26] border border-[#233145] rounded-3xl shadow-2xl text-white max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 text-slate-400 hover:text-white bg-black/70 backdrop-blur-sm hover:bg-[#1E293B] rounded-full transition-colors cursor-pointer border border-white/10"
          aria-label="Close movie details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Poster Column */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="rounded-2xl overflow-hidden border border-[#233145] shadow-2xl aspect-[2/3] bg-[#0A0E17] relative group">
              <img
                src={film.posterUrl}
                alt={`${film.title} movie poster`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/90 backdrop-blur-sm border border-[#334155] text-[11px] font-mono text-[#D9A45B] font-bold">
                {film.quality || '4K ULTRA HD'}
              </div>
            </div>

            {/* Quick Spec Box */}
            <div className="p-3.5 bg-[#0B1019] rounded-2xl border border-[#1E2B3E] text-xs space-y-2 font-mono text-slate-400">
              <div className="flex justify-between">
                <span>File Size:</span>
                <span className="text-white font-bold">{film.fileSize || '1.8 GB'}</span>
              </div>
              <div className="flex justify-between">
                <span>Audio:</span>
                <span className="text-emerald-400 truncate ml-2 text-right">{film.audioTracks || 'Dual Audio [Hindi + Eng]'}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtitles:</span>
                <span className="text-white font-medium">{film.subtitles || 'English, Multi Subs [SRT]'}</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="text-slate-300 font-medium">MKV / MP4 (H.265 / HEVC)</span>
              </div>
            </div>
          </div>

          {/* Details & Download Options Column */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-5">
            <div>
              {/* Header Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D9A45B] px-3 py-1 rounded-full bg-[#D9A45B]/10 border border-[#D9A45B]/30">
                  {film.genre}
                </span>
                {film.secondaryGenre && (
                  <span className="text-xs text-slate-400 font-sans">{film.secondaryGenre}</span>
                )}
                <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1019] border border-[#233145] text-xs text-amber-400 font-mono font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{film.ratingScore || '8.8'} / 10 IMDB</span>
                </div>
              </div>

              {/* Title */}
              <h2 id="film-modal-title" className="font-serif text-2xl sm:text-4xl text-white font-black leading-tight mb-2">
                {film.title}
              </h2>

              {/* Specs line */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pb-3 mb-4 border-b border-[#233145]">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-[#D9A45B]" />
                  {film.year}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-[#D9A45B]" />
                  {film.duration}
                </span>
                {film.director && (
                  <>
                    <span>•</span>
                    <span className="text-slate-300">Dir. <strong className="text-white">{film.director}</strong></span>
                  </>
                )}
              </div>

              {/* Synopsis */}
              <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                {film.synopsis || film.shortDesc}
              </p>

              {/* DOWNLOAD BUTTONS (Moviebaaz 480p, 720p, 1080p, 4K style) */}
              <div className="p-5 bg-[#0E1522] border border-[#233145] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowDownToLine className="w-5 h-5 text-[#D9A45B]" />
                    <span className="font-serif text-lg font-bold text-white">Select Download Quality</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> High Speed Direct Mirrors
                  </span>
                </div>

                {downloadStep === 'generating' && (
                  <div className="p-3 bg-[#0A0E17] border border-[#D9A45B] rounded-xl text-center text-xs text-[#D9A45B] font-mono animate-pulse">
                    Connecting to high-speed secure mirror server ({selectedQuality})...
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* 480p Option (Fast Mobile) */}
                  <button
                    onClick={() => handleStartDownload('480p')}
                    className="p-3 bg-[#131B27] hover:bg-[#1A2536] border border-[#233145] hover:border-[#D9A45B] rounded-xl text-left transition-all cursor-pointer group shadow"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white group-hover:text-[#D9A45B]">480p SD</span>
                      <Smartphone className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D9A45B]" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block">Mobile ~400 MB</span>
                    <span className="text-[9px] text-teal-400 font-mono block mt-1 font-bold">Fast Mirror 1</span>
                  </button>

                  {/* 720p Option */}
                  <button
                    onClick={() => handleStartDownload('720p')}
                    className="p-3 bg-[#131B27] hover:bg-[#1A2536] border border-[#233145] hover:border-[#D9A45B] rounded-xl text-left transition-all cursor-pointer group shadow"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white group-hover:text-[#D9A45B]">720p HD</span>
                      <Monitor className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D9A45B]" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block">Standard ~950 MB</span>
                    <span className="text-[9px] text-emerald-400 font-mono block mt-1 font-bold">Fast Mirror 2</span>
                  </button>

                  {/* 1080p Option */}
                  <button
                    onClick={() => handleStartDownload('1080p')}
                    className="p-3 bg-[#131B27] hover:bg-[#1A2536] border border-[#233145] hover:border-[#D9A45B] rounded-xl text-left transition-all cursor-pointer group shadow"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white group-hover:text-[#D9A45B]">1080p FHD</span>
                      <Tv className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D9A45B]" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block">Full HD ~2.0 GB</span>
                    <span className="text-[9px] text-[#D9A45B] font-mono block mt-1 font-bold">Direct Server</span>
                  </button>

                  {/* 4K Ultra HD Option */}
                  <button
                    onClick={() => handleStartDownload('4k')}
                    className="p-3 bg-[#131B27] hover:bg-[#1A2536] border border-[#233145] hover:border-amber-400 rounded-xl text-left transition-all cursor-pointer group shadow"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-amber-400 group-hover:text-amber-300">4K UHD</span>
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block">2160p ~5.5 GB</span>
                    <span className="text-[9px] text-amber-400 font-mono block mt-1 font-bold">Ultra Bitrate</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Cloud CDN • No Waiting Time</span>
                  <span>Click any quality to start download</span>
                </div>
              </div>
            </div>

            {/* Optional Modal Ad Banner (Safely labeled) */}
            {modalAd && targetModalAdUrl && targetModalAdUrl !== 'YOUR_ADSTERRA_LINK' && (
              <div className="p-3.5 bg-[#0B1019] border border-dashed border-[#D9A45B]/50 rounded-2xl flex items-center justify-between gap-3">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-mono text-[#D9A45B] tracking-wider block">
                    SPONSORED PARTNER
                  </span>
                  <span className="text-xs text-white font-medium">{modalAd.sponsorName}</span>
                </div>
                <a
                  href={targetModalAdUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-[#D9A45B] hover:bg-[#e4b574] rounded-xl transition-colors cursor-pointer"
                >
                  <span>{modalAd.buttonText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#0B1019] border-t border-[#233145] flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">{film.title} ({film.year})</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#1E293B] hover:bg-[#D9A45B] hover:text-black text-white rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
