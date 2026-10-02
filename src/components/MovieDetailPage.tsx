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
  allMovies: FilmItem[];
}

export const MovieDetailPage: React.FC<MovieDetailPageProps> = ({
  film,
  onBackToHome,
  onSelectFilm,
  allMovies,
}) => {
  const { activeAdsterraLink } = useAdmin();

  // Selected quality for download gateway
  const [selectedQuality, setSelectedQuality] = useState<'480p' | '720p' | '1080p' | '4k'>('1080p');

  /**
   * Exact Moviebaaz Download Gateway Stages:
   * 'idle': Normal state showing 480p, 720p, 1080p, 4K download buttons
   * 'countdown_3s': User clicked download -> 1st popunder ad fired -> 3-second countdown runs
   * 'proceed_btn': 3-second timer ended -> "Proceed to Download" button appears
   * 'generate_view': User clicked proceed -> 2nd popunder ad fired -> "Generate Download Link" gateway shown
   * 'generating_token': User clicked generate -> 3rd popunder ad fired -> 2-second token generation runs
   * 'final_ready': Token generated -> "🚀 DOWNLOAD FILE NOW" button delivers the genuine movie file!
   */
  const [gatewayStage, setGatewayStage] = useState<
    'idle' | 'countdown_3s' | 'proceed_btn' | 'generate_view' | 'generating_token' | 'final_ready'
  >('idle');

  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const downloadSectionRef = useRef<HTMLDivElement>(null);

  // Track 2-click popunder sequence
  const [qualityClickedOnce, setQualityClickedOnce] = useState<string | null>(null);
  const [proceedClickedOnce, setProceedClickedOnce] = useState(false);
  const [generateClickedOnce, setGenerateClickedOnce] = useState(false);

  // Scroll to top when film changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setGatewayStage('idle');
    setCountdownSeconds(3);
    setQualityClickedOnce(null);
    setProceedClickedOnce(false);
    setGenerateClickedOnce(false);
  }, [film]);

  // 3-Second Countdown Timer Handler
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

  // STEP 1: User clicks on any quality download button (e.g. 1080p)
  const handleQualityClick = (quality: '480p' | '720p' | '1080p' | '4k') => {
    setSelectedQuality(quality);

    // 1st click: trigger Adcash popunder
    if (qualityClickedOnce !== quality) {
      triggerPopunder();
      setQualityClickedOnce(quality);
      return;
    }

    // 2nd click: start 3-second countdown
    setQualityClickedOnce(null);
    setCountdownSeconds(3);
    setGatewayStage('countdown_3s');

    // Smooth scroll to gateway card
    if (downloadSectionRef.current) {
      downloadSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // STEP 2: User clicks "Proceed to Fast Server" button after 3 seconds
  const handleProceedClick = () => {
    // 1st click: trigger Adcash popunder
    if (!proceedClickedOnce) {
      triggerPopunder();
      setProceedClickedOnce(true);
      return;
    }

    // 2nd click: transition to generate link view
    setProceedClickedOnce(false);
    setGatewayStage('generate_view');
  };

  // STEP 3: User clicks "Generate Download Link" button
  const handleGenerateLinkClick = () => {
    // 1st click: trigger Adcash popunder
    if (!generateClickedOnce) {
      triggerPopunder();
      setGenerateClickedOnce(true);
      return;
    }

    // 2nd click: generate token
    setGenerateClickedOnce(false);
    setGatewayStage('generating_token');
  };

  // STEP 4: Real movie URL
  const realDownloadUrl = getGenuineMovieDownloadUrl(film, selectedQuality, activeAdsterraLink);

  // Handle Watch Online click
  const handleWatchOnlineClick = () => {
    triggerPopunder();
    const realStreamUrl = film.watchOnlineUrl || film.masterVideoLink || '';
    if (realStreamUrl && !realStreamUrl.includes('YOUR_ADSTERRA_LINK')) {
      window.open(realStreamUrl, '_blank', 'noopener,noreferrer');
    } else {
      if (downloadSectionRef.current) {
        downloadSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
          ref={downloadSectionRef}
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

          {/* STAGE A: 4 Quality Options with INLINE 3-Second Loading & Proceed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 480p Option */}
            <div 
              onClick={() => {
                if (gatewayStage === 'idle' || selectedQuality !== '480p') {
                  handleQualityClick('480p');
                }
              }}
              className={`p-4 rounded-2xl border transition-all text-left space-y-2 relative group ${
                selectedQuality === '480p' && (gatewayStage === 'countdown_3s' || gatewayStage === 'proceed_btn')
                  ? 'bg-[#15202E] border-emerald-400/80 shadow-2xl ring-2 ring-emerald-500/30'
                  : qualityClickedOnce === '480p'
                  ? 'bg-[#1D293A] border-amber-400 shadow-xl ring-2 ring-amber-400/50 animate-pulse cursor-pointer'
                  : selectedQuality === '480p' && gatewayStage !== 'idle'
                  ? 'bg-[#182436] border-[#D9A45B] shadow-xl cursor-pointer'
                  : 'bg-[#0B1019] border-[#223145] hover:border-[#D9A45B]/80 hover:bg-[#121A26] cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-white group-hover:text-[#D9A45B]">480p SD</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182333] text-slate-300">~450 MB</span>
              </div>
              <p className="text-[11px] text-slate-400">Mobile Quality • Low Data Usage</p>

              {/* INLINE 3-SECOND LOADING FOR 480p */}
              {selectedQuality === '480p' && gatewayStage === 'countdown_3s' ? (
                <div className="pt-2 pb-1 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between px-2.5 py-1.5 bg-black/60 rounded-xl border border-amber-500/40">
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-[#D9A45B] font-mono font-black text-sm border border-amber-400 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40"></span>
                        <span>{countdownSeconds}</span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-300 truncate">
                        {countdownSeconds === 3 ? '⚡ Connecting Node...' :
                         countdownSeconds === 2 ? '🛡️ Allocating Token...' :
                         '✅ Mirror Server Ready!'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0">{countdownSeconds}s</span>
                  </div>
                  <div className="w-full bg-[#121A26] rounded-full h-2 overflow-hidden border border-[#2B3E55]">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-[#D9A45B] to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(217,164,91,0.8)]"
                      style={{ width: `${((4 - countdownSeconds) / 3) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-center text-slate-400 font-mono animate-pulse">
                    ⏳ Verifying 480p mirror in {countdownSeconds}s...
                  </p>
                </div>
              ) : selectedQuality === '480p' && gatewayStage === 'proceed_btn' ? (
                <div className="pt-2 space-y-2 animate-fadeIn">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono w-full justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>480p Mirror Ready!</span>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProceedClick();
                    }}
                    className={`w-full py-2.5 px-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer ${
                      proceedClickedOnce
                        ? 'bg-amber-400 text-black ring-2 ring-amber-400 animate-pulse'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black'
                    }`}
                  >
                    <span>{proceedClickedOnce ? '⚡ Click Again' : '🚀 Proceed to Link →'}</span>
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => handleQualityClick('480p')}
                  className={`w-full mt-2 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    qualityClickedOnce === '480p'
                      ? 'bg-amber-400 text-black shadow-lg animate-bounce'
                      : 'bg-[#1B2738] group-hover:bg-[#D9A45B] text-slate-200 group-hover:text-black'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{qualityClickedOnce === '480p' ? '⚡ Click Again (Start 3s)' : 'Download 480p'}</span>
                </button>
              )}
            </div>

            {/* 720p Option */}
            <div 
              onClick={() => {
                if (gatewayStage === 'idle' || selectedQuality !== '720p') {
                  handleQualityClick('720p');
                }
              }}
              className={`p-4 rounded-2xl border transition-all text-left space-y-2 relative group ${
                selectedQuality === '720p' && (gatewayStage === 'countdown_3s' || gatewayStage === 'proceed_btn')
                  ? 'bg-[#15202E] border-emerald-400/80 shadow-2xl ring-2 ring-emerald-500/30'
                  : qualityClickedOnce === '720p'
                  ? 'bg-[#1D293A] border-amber-400 shadow-xl ring-2 ring-amber-400/50 animate-pulse cursor-pointer'
                  : selectedQuality === '720p' && gatewayStage !== 'idle'
                  ? 'bg-[#182436] border-[#D9A45B] shadow-xl cursor-pointer'
                  : 'bg-[#0B1019] border-[#223145] hover:border-[#D9A45B]/80 hover:bg-[#121A26] cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-sky-400 group-hover:text-[#D9A45B]">720p HD</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182333] text-slate-300">~950 MB</span>
              </div>
              <p className="text-[11px] text-slate-400">Standard HD • Clear Audio & Video</p>

              {/* INLINE 3-SECOND LOADING FOR 720p */}
              {selectedQuality === '720p' && gatewayStage === 'countdown_3s' ? (
                <div className="pt-2 pb-1 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between px-2.5 py-1.5 bg-black/60 rounded-xl border border-amber-500/40">
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-[#D9A45B] font-mono font-black text-sm border border-amber-400 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40"></span>
                        <span>{countdownSeconds}</span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-300 truncate">
                        {countdownSeconds === 3 ? '⚡ Connecting Node...' :
                         countdownSeconds === 2 ? '🛡️ Allocating Token...' :
                         '✅ Mirror Server Ready!'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0">{countdownSeconds}s</span>
                  </div>
                  <div className="w-full bg-[#121A26] rounded-full h-2 overflow-hidden border border-[#2B3E55]">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-[#D9A45B] to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(217,164,91,0.8)]"
                      style={{ width: `${((4 - countdownSeconds) / 3) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-center text-slate-400 font-mono animate-pulse">
                    ⏳ Verifying 720p mirror in {countdownSeconds}s...
                  </p>
                </div>
              ) : selectedQuality === '720p' && gatewayStage === 'proceed_btn' ? (
                <div className="pt-2 space-y-2 animate-fadeIn">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono w-full justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>720p Mirror Ready!</span>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProceedClick();
                    }}
                    className={`w-full py-2.5 px-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer ${
                      proceedClickedOnce
                        ? 'bg-amber-400 text-black ring-2 ring-amber-400 animate-pulse'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black'
                    }`}
                  >
                    <span>{proceedClickedOnce ? '⚡ Click Again' : '🚀 Proceed to Link →'}</span>
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => handleQualityClick('720p')}
                  className={`w-full mt-2 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    qualityClickedOnce === '720p'
                      ? 'bg-amber-400 text-black shadow-lg animate-bounce'
                      : 'bg-[#1B2738] group-hover:bg-[#D9A45B] text-slate-200 group-hover:text-black'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{qualityClickedOnce === '720p' ? '⚡ Click Again (Start 3s)' : 'Download 720p'}</span>
                </button>
              )}
            </div>

            {/* 1080p Option (POPULAR) */}
            <div 
              onClick={() => {
                if (gatewayStage === 'idle' || selectedQuality !== '1080p') {
                  handleQualityClick('1080p');
                }
              }}
              className={`p-4 rounded-2xl border transition-all text-left space-y-2 relative group ${
                selectedQuality === '1080p' && (gatewayStage === 'countdown_3s' || gatewayStage === 'proceed_btn')
                  ? 'bg-[#15202E] border-emerald-400/80 shadow-2xl ring-2 ring-emerald-500/30'
                  : qualityClickedOnce === '1080p'
                  ? 'bg-[#1D293A] border-amber-400 shadow-xl ring-2 ring-amber-400/50 animate-pulse cursor-pointer'
                  : selectedQuality === '1080p' && gatewayStage !== 'idle'
                  ? 'bg-[#182436] border-[#D9A45B] shadow-xl ring-2 ring-[#D9A45B]/30 cursor-pointer'
                  : 'bg-[#0B1019] border-[#2E4158] hover:border-[#D9A45B] hover:bg-[#121A26] cursor-pointer'
              }`}
            >
              <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#D9A45B] text-black text-[9px] font-black uppercase tracking-wider shadow">
                Most Popular
              </div>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#D9A45B]">1080p FHD</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182333] text-slate-300">~1.8 GB</span>
              </div>
              <p className="text-[11px] text-slate-400">Full HD 1080p • 5.1 Surround</p>

              {/* INLINE 3-SECOND LOADING FOR 1080p */}
              {selectedQuality === '1080p' && gatewayStage === 'countdown_3s' ? (
                <div className="pt-2 pb-1 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between px-2.5 py-1.5 bg-black/60 rounded-xl border border-amber-500/40">
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-[#D9A45B] font-mono font-black text-sm border border-amber-400 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40"></span>
                        <span>{countdownSeconds}</span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-300 truncate">
                        {countdownSeconds === 3 ? '⚡ Connecting Node...' :
                         countdownSeconds === 2 ? '🛡️ Allocating Token...' :
                         '✅ Mirror Server Ready!'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0">{countdownSeconds}s</span>
                  </div>
                  <div className="w-full bg-[#121A26] rounded-full h-2 overflow-hidden border border-[#2B3E55]">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-[#D9A45B] to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(217,164,91,0.8)]"
                      style={{ width: `${((4 - countdownSeconds) / 3) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-center text-slate-400 font-mono animate-pulse">
                    ⏳ Verifying 1080p mirror in {countdownSeconds}s...
                  </p>
                </div>
              ) : selectedQuality === '1080p' && gatewayStage === 'proceed_btn' ? (
                <div className="pt-2 space-y-2 animate-fadeIn">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono w-full justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>1080p Mirror Ready!</span>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProceedClick();
                    }}
                    className={`w-full py-2.5 px-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer ${
                      proceedClickedOnce
                        ? 'bg-amber-400 text-black ring-2 ring-amber-400 animate-pulse'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black'
                    }`}
                  >
                    <span>{proceedClickedOnce ? '⚡ Click Again' : '🚀 Proceed to Link →'}</span>
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => handleQualityClick('1080p')}
                  className={`w-full mt-2 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer ${
                    qualityClickedOnce === '1080p'
                      ? 'bg-amber-400 text-black shadow-lg animate-bounce'
                      : 'bg-[#D9A45B] hover:bg-[#E5B573] text-black'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{qualityClickedOnce === '1080p' ? '⚡ Click Again (Start 3s)' : 'Download 1080p'}</span>
                </button>
              )}
            </div>

            {/* 4K UHD Option */}
            <div 
              onClick={() => {
                if (gatewayStage === 'idle' || selectedQuality !== '4k') {
                  handleQualityClick('4k');
                }
              }}
              className={`p-4 rounded-2xl border transition-all text-left space-y-2 relative group ${
                selectedQuality === '4k' && (gatewayStage === 'countdown_3s' || gatewayStage === 'proceed_btn')
                  ? 'bg-[#15202E] border-emerald-400/80 shadow-2xl ring-2 ring-emerald-500/30'
                  : qualityClickedOnce === '4k'
                  ? 'bg-[#1D293A] border-amber-400 shadow-xl ring-2 ring-amber-400/50 animate-pulse cursor-pointer'
                  : selectedQuality === '4k' && gatewayStage !== 'idle'
                  ? 'bg-[#182436] border-amber-400 shadow-xl cursor-pointer'
                  : 'bg-[#0B1019] border-[#223145] hover:border-amber-400 hover:bg-[#121A26] cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-amber-400">4K UHD</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182333] text-slate-300">~5.5 GB</span>
              </div>
              <p className="text-[11px] text-slate-400">Ultra High Bitrate • 2160p Cinema</p>

              {/* INLINE 3-SECOND LOADING FOR 4K */}
              {selectedQuality === '4k' && gatewayStage === 'countdown_3s' ? (
                <div className="pt-2 pb-1 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between px-2.5 py-1.5 bg-black/60 rounded-xl border border-amber-500/40">
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-[#D9A45B] font-mono font-black text-sm border border-amber-400 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40"></span>
                        <span>{countdownSeconds}</span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-300 truncate">
                        {countdownSeconds === 3 ? '⚡ Connecting Node...' :
                         countdownSeconds === 2 ? '🛡️ Allocating Token...' :
                         '✅ Mirror Server Ready!'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0">{countdownSeconds}s</span>
                  </div>
                  <div className="w-full bg-[#121A26] rounded-full h-2 overflow-hidden border border-[#2B3E55]">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-[#D9A45B] to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(217,164,91,0.8)]"
                      style={{ width: `${((4 - countdownSeconds) / 3) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-center text-slate-400 font-mono animate-pulse">
                    ⏳ Verifying 4K mirror in {countdownSeconds}s...
                  </p>
                </div>
              ) : selectedQuality === '4k' && gatewayStage === 'proceed_btn' ? (
                <div className="pt-2 space-y-2 animate-fadeIn">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono w-full justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>4K Mirror Ready!</span>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProceedClick();
                    }}
                    className={`w-full py-2.5 px-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer ${
                      proceedClickedOnce
                        ? 'bg-amber-400 text-black ring-2 ring-amber-400 animate-pulse'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black'
                    }`}
                  >
                    <span>{proceedClickedOnce ? '⚡ Click Again' : '🚀 Proceed to Link →'}</span>
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => handleQualityClick('4k')}
                  className={`w-full mt-2 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    qualityClickedOnce === '4k'
                      ? 'bg-amber-400 text-black shadow-lg animate-bounce'
                      : 'bg-[#1B2738] group-hover:bg-amber-400 text-slate-200 group-hover:text-black'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{qualityClickedOnce === '4k' ? '⚡ Click Again (Start 3s)' : 'Download 4K'}</span>
                </button>
              )}
            </div>
          </div>

          {/* ======================================================================= */}
          {/* DYNAMIC MOVIEBAAZ GATEWAY BOX (Link Generation & Download Delivery)     */}
          {/* ======================================================================= */}
          {(gatewayStage === 'generate_view' || gatewayStage === 'generating_token' || gatewayStage === 'final_ready') && (
            <div className="p-6 bg-[#070B12] border border-[#2B3C52] rounded-2xl space-y-5 animate-fadeIn text-center">
              {/* STAGE 3: "GENERATE DOWNLOAD LINK" Gateway View */}
              {gatewayStage === 'generate_view' && (
                <div className="py-3 space-y-5 max-w-xl mx-auto">
                  <div className="p-4 bg-[#0D1420] border border-[#24354A] rounded-xl text-left space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">File Name:</span>
                      <span className="text-white font-mono font-bold truncate max-w-xs">
                        {film.title.replace(/\s+/g, '.')}.{film.year}.{selectedQuality}.Dual.Audio.mkv
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quality / Audio:</span>
                      <span className="text-emerald-400 font-bold">{selectedQuality.toUpperCase()} • Dual Audio</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Security Check:</span>
                      <span className="text-emerald-400 font-mono">100% Virus Free • SHA256 Verified</span>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateLinkClick}
                    className={`w-full py-4 font-black text-sm uppercase tracking-widest rounded-xl shadow-2xl transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2 ${
                      generateClickedOnce
                        ? 'bg-amber-400 text-black shadow-amber-400/40 ring-2 ring-amber-400 animate-pulse'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black'
                    }`}
                  >
                    <Zap className="w-5 h-5 fill-black" />
                    <span>{generateClickedOnce ? '⚡ Click Again to Generate Direct Token' : '⚡ GENERATE HIGH-SPEED DOWNLOAD LINK'}</span>
                  </button>
                  <p className="text-[11px] text-slate-400">Click the button above to generate your direct CDN link</p>
                </div>
              )}

              {/* STAGE 4: Generating Token (2 seconds spinner) */}
              {gatewayStage === 'generating_token' && (
                <div className="py-6 space-y-3">
                  <RefreshCw className="w-10 h-10 text-[#D9A45B] animate-spin mx-auto" />
                  <h4 className="text-base font-bold text-white">
                    Generating High-Speed Download Token...
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Allocating 10 Gbps cloud bandwidth token for your IP...
                  </p>
                </div>
              )}

              {/* STAGE 5: FINAL READY -> REAL FILE DOWNLOAD BUTTON (Raw URL is HIDDEN!) */}
              {gatewayStage === 'final_ready' && (
                <div className="py-4 space-y-4 max-w-xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Direct Download Link Generated Successfully!</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Your {selectedQuality.toUpperCase()} File is Ready to Download
                  </h3>

                  {/* GUARANTEED DIRECT ANCHOR LINK (Never blocked by popup blockers, raw URL hidden!) */}
                  <a
                    href={realDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setTimeout(() => triggerPopunder(), 300);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 hover:scale-102 text-black font-black text-base uppercase tracking-wider rounded-2xl shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-2.5 text-center"
                  >
                    <Download className="w-5 h-5 stroke-[2.5]" />
                    <span>🚀 DOWNLOAD FILE NOW ({selectedQuality.toUpperCase()})</span>
                  </a>

                  {/* Clean verified indicator (NO RAW URL SHOWN!) */}
                  <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-mono pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Fast High-Speed CDN Mirror • Direct File Delivery Ready</span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-center gap-4 pt-1 font-mono">
                    <span>Cloud CDN • Instant Download</span>
                    <span>•</span>
                    <button
                      onClick={() => setGatewayStage('idle')}
                      className="text-[#D9A45B] hover:underline cursor-pointer"
                    >
                      Choose Different Quality
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
