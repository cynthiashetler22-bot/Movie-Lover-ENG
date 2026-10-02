import React, { useState, useEffect } from 'react';
import { FilmItem } from '../data/films';
import { 
  ArrowLeft, Download, ShieldCheck, CheckCircle2, 
  Sparkles, RefreshCw, Zap, Check, ChevronRight, HardDrive, Film, Volume2, Calendar
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { AdBannerSlot } from './AdBannerSlot';
import { triggerPopunder, getGenuineMovieDownloadUrl } from '../utils/popunder';

interface MovieDownloadPageProps {
  film: FilmItem;
  quality: '480p' | '720p' | '1080p' | '4k';
  onBackToMovie: () => void;
  onChangeQuality: (newQuality: '480p' | '720p' | '1080p' | '4k') => void;
}

export const MovieDownloadPage: React.FC<MovieDownloadPageProps> = ({
  film,
  quality,
  onBackToMovie,
  onChangeQuality,
}) => {
  const { activeAdsterraLink } = useAdmin();

  /**
   * Classic Moviebaaz Download Stages:
   * 'countdown_3s': 3-second animated countdown starts automatically on page open
   * 'proceed_btn': 3 seconds ended -> "Proceed to Download Link" button appears
   * 'generate_view': User clicks proceed -> "⚡ GENERATE HIGH-SPEED DOWNLOAD LINK"
   * 'generating_token': User clicks generate -> 2-second token spinner
   * 'final_ready': "🚀 DOWNLOAD FILE NOW" delivers genuine file link!
   */
  const [gatewayStage, setGatewayStage] = useState<
    'countdown_3s' | 'proceed_btn' | 'generate_view' | 'generating_token' | 'final_ready'
  >('countdown_3s');

  const [countdownSeconds, setCountdownSeconds] = useState(3);

  // Scroll to top and start 3-second countdown when quality/film changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setGatewayStage('countdown_3s');
    setCountdownSeconds(3);
    // Trigger popunder on page entry
    triggerPopunder();
  }, [film.id, quality]);

  // 3-Second Countdown Timer Handler (Original classic style)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gatewayStage === 'countdown_3s') {
      if (countdownSeconds > 0) {
        timer = setTimeout(() => {
          setCountdownSeconds((prev) => prev - 1);
        }, 1000);
      } else {
        setGatewayStage('proceed_btn');
      }
    }
    return () => clearTimeout(timer);
  }, [gatewayStage, countdownSeconds]);

  // Token Generation Timer Handler (2 seconds)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gatewayStage === 'generating_token') {
      timer = setTimeout(() => {
        setGatewayStage('final_ready');
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [gatewayStage]);

  const handleProceedClick = () => {
    triggerPopunder();
    setGatewayStage('generate_view');
  };

  const handleGenerateLinkClick = () => {
    triggerPopunder();
    setGatewayStage('generating_token');
  };

  const realDownloadUrl = getGenuineMovieDownloadUrl(film, quality, activeAdsterraLink);

  const qualityInfo = {
    '480p': { label: '480p SD', size: '~450 MB', desc: 'Mobile Quality • Low Data Usage', color: 'text-white' },
    '720p': { label: '720p HD', size: '~950 MB', desc: 'Standard HD • Clear Audio & Video', color: 'text-sky-400' },
    '1080p': { label: '1080p FHD', size: '~1.8 GB', desc: 'Full HD 1080p • 5.1 Surround', color: 'text-[#D9A45B]' },
    '4k': { label: '4K UHD', size: '~5.5 GB', desc: 'Ultra High Bitrate • 2160p Cinema', color: 'text-amber-400' },
  }[quality];

  return (
    <div className="min-h-screen bg-[#070B12] text-white">
      {/* Top Banner Ad */}
      <AdBannerSlot slot="top_banner" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToMovie}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121A26] hover:bg-[#1E2B3E] text-slate-200 hover:text-white border border-[#23354C] transition-all text-xs sm:text-sm font-semibold cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Movie Details</span>
          </button>

          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Secure Mirror</span>
          </span>
        </div>

        {/* Selected Movie & Quality Header Card */}
        <div className="bg-gradient-to-r from-[#0C121D] via-[#141E2D] to-[#0C121D] border border-[#22354A] rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={film.posterUrl}
            alt={film.title}
            className="w-24 sm:w-28 h-36 sm:h-40 rounded-xl object-cover shadow-2xl border border-slate-700 shrink-0"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D9A45B] text-black text-[10px] font-black uppercase tracking-wider">
                {qualityInfo.label}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                {film.year}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800">
                {film.audioTracks || 'Dual Audio [Hindi + Eng]'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {film.title}
            </h1>

            <p className="text-xs text-slate-400 font-sans">
              Preparing direct download server for <span className="text-[#D9A45B] font-bold">{qualityInfo.label}</span> ({qualityInfo.size})
            </p>

            {/* Quality switcher buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[11px] text-slate-400 font-mono">Change Quality:</span>
              {(['480p', '720p', '1080p', '4k'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => onChangeQuality(q)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    quality === q
                      ? 'bg-[#D9A45B] text-black shadow'
                      : 'bg-[#182333] hover:bg-[#233347] text-slate-300'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* DEDICATED FULL-SCREEN DOWNLOAD GATEWAY CARD                             */}
        {/* ======================================================================= */}
        <div className="bg-[#0A0F18] border-2 border-[#25394F] rounded-2xl p-6 sm:p-8 space-y-6 text-center shadow-2xl relative overflow-hidden">
          {/* Background decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#D9A45B]/10 blur-3xl pointer-events-none" />

          {/* STAGE 1: 3-Second Classic Circular Loading Countdown */}
          {gatewayStage === 'countdown_3s' && (
            <div className="py-8 space-y-5 animate-fadeIn">
              {/* Original Large Circular Pulsing Timer */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/20 border-2 border-amber-400/60 text-[#D9A45B] text-3xl font-black font-mono shadow-[0_0_25px_rgba(217,164,91,0.3)]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-20"></span>
                <span>{countdownSeconds}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Please wait {countdownSeconds} seconds... Checking Secure Cloud Mirror
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Allocating dedicated 10 Gbps cloud mirror server for <span className="text-[#D9A45B] font-bold">{qualityInfo.label}</span>...
                </p>
              </div>

              {/* Glowing progress bar */}
              <div className="max-w-md mx-auto bg-[#141E2B] rounded-full h-2.5 overflow-hidden border border-[#2B3E55]">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-[#D9A45B] to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(217,164,91,0.8)]"
                  style={{ width: `${((4 - countdownSeconds) / 3) * 100}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 font-mono animate-pulse">
                ⚡ Verifying cloud node availability • High-speed mirror response
              </p>
            </div>
          )}

          {/* STAGE 2: 3-Second Finished -> "Proceed to Download Page" Button */}
          {gatewayStage === 'proceed_btn' && (
            <div className="py-6 space-y-5 animate-fadeIn max-w-lg mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cloud Mirror Verified & Ready</span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white">
                Step 1 Complete: Server Ready for {film.title} ({qualityInfo.label})
              </h3>

              <p className="text-xs text-slate-400">
                The high-speed download server has been allocated. Click the button below to proceed to link generator.
              </p>

              <button
                onClick={handleProceedClick}
                className="w-full py-4 bg-gradient-to-r from-[#D9A45B] via-[#E5B573] to-[#D9A45B] hover:from-[#E5B573] hover:to-[#D9A45B] text-black font-black text-sm uppercase tracking-wider rounded-xl shadow-2xl transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Click Here to Proceed to Download Page</span>
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              <p className="text-[11px] text-slate-400 font-mono">
                Fast Cloud Mirror CDN • No registration required • Direct download
              </p>
            </div>
          )}

          {/* STAGE 3: "GENERATE DOWNLOAD LINK" Gateway View */}
          {gatewayStage === 'generate_view' && (
            <div className="py-4 space-y-6 max-w-lg mx-auto animate-fadeIn">
              <div className="p-4 bg-[#0D1420] border border-[#24354A] rounded-xl text-left space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">File Name:</span>
                  <span className="text-white font-mono font-bold truncate max-w-xs">
                    {film.title.replace(/\s+/g, '.')}.{film.year}.{quality}.Dual.Audio.mkv
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Quality / Audio:</span>
                  <span className="text-emerald-400 font-bold">{qualityInfo.label} • Dual Audio</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">File Size:</span>
                  <span className="text-slate-200 font-mono">{qualityInfo.size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Security Check:</span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Virus Free
                  </span>
                </div>
              </div>

              <button
                onClick={handleGenerateLinkClick}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm uppercase tracking-widest rounded-xl shadow-2xl transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 fill-black" />
                <span>⚡ GENERATE HIGH-SPEED DOWNLOAD LINK</span>
              </button>

              <p className="text-[11px] text-slate-400 font-mono">
                Click above to generate your direct token link
              </p>
            </div>
          )}

          {/* STAGE 4: Generating Token (2 seconds spinner) */}
          {gatewayStage === 'generating_token' && (
            <div className="py-8 space-y-4 animate-fadeIn">
              <RefreshCw className="w-12 h-12 text-[#D9A45B] animate-spin mx-auto" />
              <h3 className="text-lg sm:text-xl font-black text-white">
                Generating High-Speed Download Token...
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Allocating 10 Gbps cloud bandwidth token for your IP...
              </p>
            </div>
          )}

          {/* STAGE 5: FINAL READY -> REAL FILE DOWNLOAD BUTTON (Raw URL is HIDDEN!) */}
          {gatewayStage === 'final_ready' && (
            <div className="py-6 space-y-5 max-w-lg mx-auto animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Direct Download Link Generated Successfully!</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">
                Your {qualityInfo.label} File is Ready to Download
              </h2>

              {/* GUARANTEED DIRECT ANCHOR LINK */}
              <a
                href={realDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setTimeout(() => triggerPopunder(), 300);
                }}
                className="w-full py-4.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-base uppercase tracking-wider rounded-2xl shadow-2xl transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2.5 text-center"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>🚀 DOWNLOAD FILE NOW ({qualityInfo.label})</span>
              </a>

              {/* Clean verified indicator (NO RAW URL SHOWN!) */}
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-mono pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Fast High-Speed CDN Mirror • Direct File Delivery Ready</span>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-4 text-xs font-mono text-slate-400">
                <button
                  onClick={() => {
                    setGatewayStage('countdown_3s');
                    setCountdownSeconds(3);
                  }}
                  className="text-[#D9A45B] hover:underline cursor-pointer"
                >
                  ↻ Regenerate Link
                </button>
                <span>•</span>
                <button
                  onClick={onBackToMovie}
                  className="text-slate-300 hover:underline cursor-pointer"
                >
                  Return to Movie
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Banner Ad */}
        <AdBannerSlot slot="bottom_placement" />
      </div>
    </div>
  );
};
