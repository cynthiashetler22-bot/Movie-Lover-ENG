import React, { useEffect, useState } from 'react';
import { FilmItem } from '../data/films';
import { 
  X, Calendar, Clock, Download, ExternalLink, Star, 
  Sparkles, ShieldCheck, Film, HardDrive, Play, ArrowDownToLine 
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface FilmDetailModalProps {
  film: FilmItem | null;
  onClose: () => void;
}

export const FilmDetailModal: React.FC<FilmDetailModalProps> = ({ film, onClose }) => {
  const { ads, activeAdsterraLink } = useAdmin();
  const [downloadStep, setDownloadStep] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [selectedQuality, setSelectedQuality] = useState<'1080p' | '720p' | '4k'>('1080p');

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

  // Resolve download link (either custom per film or global Adsterra smartlink)
  const getDownloadUrl = (quality: '1080p' | '720p' | '4k') => {
    if (quality === '720p' && film.downloadLink720p && film.downloadLink720p !== 'YOUR_ADSTERRA_LINK') return film.downloadLink720p;
    if (quality === '4k' && film.downloadLink4k && film.downloadLink4k !== 'YOUR_ADSTERRA_LINK') return film.downloadLink4k;
    if (film.downloadLink1080p && film.downloadLink1080p !== 'YOUR_ADSTERRA_LINK') return film.downloadLink1080p;
    return activeAdsterraLink;
  };

  const handleStartDownload = (quality: '1080p' | '720p' | '4k') => {
    setSelectedQuality(quality);
    setDownloadStep('generating');
    setTimeout(() => {
      setDownloadStep('ready');
      const targetUrl = getDownloadUrl(quality);
      if (targetUrl && targetUrl !== 'YOUR_ADSTERRA_LINK') {
        window.open(targetUrl, '_blank', 'noopener,noreferrer,sponsored');
      }
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="film-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#141C28] border border-[#34404C] rounded-2xl shadow-2xl text-[#F6F0E4] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#B6B2A9] hover:text-[#F6F0E4] bg-[#101722]/80 backdrop-blur-sm hover:bg-[#202C3A] rounded-full transition-colors cursor-pointer border border-[#34404C]"
          aria-label="Close movie details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Poster Column */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="rounded-xl overflow-hidden border border-[#34404C] shadow-2xl aspect-[2/3] bg-[#101722] relative group">
              {film.posterUrl ? (
                <img
                  src={film.posterUrl}
                  alt={`${film.title} movie poster`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#192331] to-[#101722]">
                  <Film className="w-12 h-12 text-[#D9A45B] mb-2" />
                  <span className="font-serif text-lg text-[#F6F0E4]">{film.title}</span>
                </div>
              )}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#101722]/90 backdrop-blur-sm border border-[#34404C] text-[11px] font-mono text-[#D9A45B]">
                {film.quality || '1080p FHD'}
              </div>
            </div>

            {/* Quick Spec Box */}
            <div className="p-3 bg-[#101722] rounded-xl border border-[#34404C] text-xs space-y-1.5 font-mono text-[#B6B2A9]">
              <div className="flex justify-between">
                <span>File Size:</span>
                <span className="text-[#F6F0E4]">{film.fileSize || '1.8 GB'}</span>
              </div>
              <div className="flex justify-between">
                <span>Audio:</span>
                <span className="text-[#F6F0E4] truncate ml-2 text-right">{film.audioTracks || 'Dual Audio [Hindi + Eng]'}</span>
              </div>
              <div className="flex justify-between">
                <span>Language:</span>
                <span className="text-[#F6F0E4]">Original + Subtitles</span>
              </div>
            </div>
          </div>

          {/* Details & Download Options Column */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-5">
            <div>
              {/* Header Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D9A45B] px-2 py-0.5 rounded bg-[#D9A45B]/10 border border-[#D9A45B]/30">
                  {film.genre}
                </span>
                {film.secondaryGenre && (
                  <span className="text-xs text-[#B6B2A9]">{film.secondaryGenre}</span>
                )}
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#101722] border border-[#34404C] text-xs text-[#D9A45B] font-mono">
                  <Star className="w-3.5 h-3.5 fill-[#D9A45B]" />
                  <span>{film.ratingScore || '8.8'} / 10</span>
                </div>
              </div>

              {/* Title */}
              <h2 id="film-modal-title" className="font-serif text-3xl sm:text-4xl text-[#F6F0E4] font-medium leading-tight mb-2">
                {film.title}
              </h2>

              {/* Specs line */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#B6B2A9] pb-3 mb-4 border-b border-[#34404C]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D9A45B]" />
                  {film.year}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D9A45B]" />
                  {film.duration}
                </span>
                {film.director && (
                  <>
                    <span>·</span>
                    <span>Dir. <strong className="text-[#F6F0E4]">{film.director}</strong></span>
                  </>
                )}
              </div>

              {/* Synopsis */}
              <p className="font-sans text-xs sm:text-sm text-[#B6B2A9] leading-relaxed mb-6">
                {film.synopsis || film.shortDesc}
              </p>

              {/* DOWNLOAD & WATCH SELECTION SECTION (Like Moviebaaz / Premium movie discovery) */}
              <div className="p-5 bg-[#192331] border border-[#34404C] rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowDownToLine className="w-4 h-4 text-[#D9A45B]" />
                    <span className="font-serif text-lg text-[#F6F0E4]">Fast Download Links</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">High Speed Mirrors Available</span>
                </div>

                {downloadStep === 'generating' && (
                  <div className="p-3 bg-[#101722] border border-[#D9A45B]/50 rounded-lg text-center text-xs text-[#D9A45B] animate-pulse">
                    Connecting to high-speed secure mirror server ({selectedQuality})...
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 1080p Option */}
                  <button
                    onClick={() => handleStartDownload('1080p')}
                    className="p-3 bg-[#101722] hover:bg-[#202C3A] border border-[#34404C] hover:border-[#D9A45B] rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#F6F0E4] group-hover:text-[#D9A45B]">1080p FHD</span>
                      <Download className="w-3.5 h-3.5 text-[#D9A45B]" />
                    </div>
                    <span className="text-[11px] font-mono text-[#B6B2A9] block">Size: {film.fileSize || '1.8 GB'}</span>
                    <span className="text-[10px] text-emerald-400 font-mono block mt-1">Direct Mirror 1</span>
                  </button>

                  {/* 720p Option */}
                  <button
                    onClick={() => handleStartDownload('720p')}
                    className="p-3 bg-[#101722] hover:bg-[#202C3A] border border-[#34404C] hover:border-[#D9A45B] rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#F6F0E4] group-hover:text-[#D9A45B]">720p HD</span>
                      <Download className="w-3.5 h-3.5 text-[#D9A45B]" />
                    </div>
                    <span className="text-[11px] font-mono text-[#B6B2A9] block">Size: 950 MB</span>
                    <span className="text-[10px] text-teal-400 font-mono block mt-1">Direct Mirror 2</span>
                  </button>

                  {/* 4K Ultra HD Option */}
                  <button
                    onClick={() => handleStartDownload('4k')}
                    className="p-3 bg-[#101722] hover:bg-[#202C3A] border border-[#34404C] hover:border-[#D9A45B] rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#F6F0E4] group-hover:text-[#D9A45B]">4K Ultra HD</span>
                      <Download className="w-3.5 h-3.5 text-[#D9A45B]" />
                    </div>
                    <span className="text-[11px] font-mono text-[#B6B2A9] block">Size: 4.6 GB</span>
                    <span className="text-[10px] text-[#D9A45B] font-mono block mt-1">High Bitrate</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-[#B6B2A9]/70 font-mono">
                  <span>Fast CDN Server · No Captcha</span>
                  <span>Click quality to launch link</span>
                </div>
              </div>
            </div>

            {/* Optional Modal Ad Banner (Safely labeled) */}
            {modalAd && targetModalAdUrl && targetModalAdUrl !== 'YOUR_ADSTERRA_LINK' && (
              <div className="p-3.5 bg-[#101722] border border-dashed border-[#D9A45B]/50 rounded-xl flex items-center justify-between gap-3">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-mono text-[#D9A45B] tracking-wider block">
                    SPONSORED PARTNER
                  </span>
                  <span className="text-xs text-[#F6F0E4] font-medium">{modalAd.sponsorName}</span>
                </div>
                <a
                  href={targetModalAdUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#101722] bg-[#D9A45B] hover:bg-[#e4b574] rounded-lg transition-colors cursor-pointer"
                >
                  <span>{modalAd.buttonText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#101722] border-t border-[#34404C] flex items-center justify-between">
          <span className="text-xs text-[#B6B2A9]/60 font-mono">{film.title} ({film.year})</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#202C3A] hover:bg-[#D9A45B] hover:text-[#101722] text-[#F6F0E4] rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
