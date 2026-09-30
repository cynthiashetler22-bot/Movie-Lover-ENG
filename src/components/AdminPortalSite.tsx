import React, { useState } from 'react';
import { useAdmin, AdUnitConfig } from '../context/AdminContext';
import { FilmItem } from '../data/films';
import {
  Film,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Settings,
  Sparkles,
  Search,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Sliders,
  DollarSign,
  Tv,
  ArrowLeft,
  Eye,
  EyeOff,
  Github,
  Zap,
  Download,
  Upload,
  AlertTriangle,
  Code,
  HardDrive,
  Copy,
  Layers
} from 'lucide-react';

// Preset sample poster choices for quick selection
import posterCyber from '../assets/images/poster_cyber_odyssey_1790612776339.jpg';
import posterRoyal from '../assets/images/poster_royal_heart_1790612795993.jpg';
import posterShadow from '../assets/images/poster_shadow_veil_1790612811676.jpg';
import posterAlpine from '../assets/images/poster_alpine_echo_1790612825975.jpg';
import posterTokyo from '../assets/images/poster_neon_tokyo_1790612839510.jpg';
import posterAutumn from '../assets/images/poster_silent_echo_1790612867427.jpg';

const SAMPLE_POSTERS = [
  { name: 'Sci-Fi Cyber', url: posterCyber },
  { name: 'Royal Period', url: posterRoyal },
  { name: 'Shadow Noir', url: posterShadow },
  { name: 'Alpine Echo', url: posterAlpine },
  { name: 'Neon City', url: posterTokyo },
  { name: 'Golden Autumn', url: posterAutumn },
];

export const AdminPortalSite: React.FC = () => {
  const {
    closeAdmin,
    adminPasswordCorrect,
    verifyAdminPassword,
    adminLogout,
    movies,
    addMovie,
    updateMovie,
    deleteMovie,
    bulkApplyAdsterraLink,
    ads,
    addAdUnit,
    updateAdUnit,
    deleteAdUnit,
    settings,
    updateSettings,
    activeAdsterraLink,
    setActiveAdsterraLink,
    triggerSaveToast,
    // GitHub 1-click sync
    isSyncingToGitHub,
    syncStatusMessage,
    lastSyncCommit,
    syncErrorMessage,
    oneClickPushToGitHub,
    oneClickPullFromGitHub,
    downloadBackupJSON,
    importBackupJSON,
    hasUnsavedCloudChanges,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'ads' | 'github_sync' | 'settings'>('overview');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Movie Form State
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [movieFilterGenre, setMovieFilterGenre] = useState<string>('all');
  const [movieSearchTerm, setMovieSearchTerm] = useState('');

  const [movieFormData, setMovieFormData] = useState<Partial<FilmItem>>({
    title: '',
    genre: 'Action',
    secondaryGenre: '',
    year: new Date().getFullYear(),
    duration: '115 min',
    director: '',
    shortDesc: '',
    synopsis: '',
    editorialNote: 'Selected for remarkable pacing, cinematography, and immersive audio presentation.',
    mood: 'Thrilling & Dynamic',
    accentHue: '#D9A45B',
    posterUrl: posterCyber,
    ratingScore: '8.8',
    quality: '1080p FHD',
    fileSize: '1.8 GB',
    audioTracks: 'Dual Audio [Hindi + Eng]',
    downloadLink720p: '',
    downloadLink1080p: '',
    downloadLink4k: '',
  });

  // Settings & GitHub token inputs
  const [patInput, setPatInput] = useState(settings.githubPatToken || '');
  const [repoInput, setRepoInput] = useState(settings.githubRepo || 'cynthiashetler22/movie-lover-eng');
  const [branchInput, setBranchInput] = useState(settings.githubBranch || 'main');
  const [filePathInput, setFilePathInput] = useState(settings.githubFilePath || 'public/movies-catalog.json');
  const [showPatToken, setShowPatToken] = useState(false);

  // New Ad Slot Form
  const [showNewAdModal, setShowNewAdModal] = useState(false);
  const [selectedNetworkTab, setSelectedNetworkTab] = useState<'all' | 'adsterra' | 'adcash' | 'hilltopads' | 'custom'>('all');
  const [newAdData, setNewAdData] = useState<Omit<AdUnitConfig, 'id'>>({
    name: '',
    network: 'adsterra',
    format: 'banner_728x90',
    slot: 'middle_placement',
    enabled: true,
    type: 'html_code',
    directLinkUrl: '',
    buttonText: 'VISIT SPONSORED OFFER',
    htmlScriptCode: '',
    zoneId: '',
    sponsorName: 'Verified Partner Offer',
    disclosureText: 'Promotional sponsored partner. External destination terms apply.',
  });

  const handleAddNewAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdData.name.trim()) {
      triggerSaveToast('Please provide a name for this Ad Unit.');
      return;
    }
    addAdUnit({
      name: newAdData.name.trim(),
      network: newAdData.network || 'adsterra',
      format: newAdData.format || 'banner_728x90',
      slot: newAdData.slot || 'middle_placement',
      enabled: newAdData.enabled,
      type: newAdData.type || (newAdData.htmlScriptCode?.trim() ? 'html_code' : 'direct_link'),
      directLinkUrl: newAdData.directLinkUrl || activeAdsterraLink,
      buttonText: newAdData.buttonText || 'VISIT SPONSORED OFFER',
      htmlScriptCode: newAdData.htmlScriptCode || '',
      zoneId: newAdData.zoneId || '',
      sponsorName: newAdData.sponsorName || 'Verified Partner Offer',
      disclosureText: newAdData.disclosureText || 'Promotional sponsored partner.',
    });
    setShowNewAdModal(false);
    setNewAdData({
      name: '',
      network: 'adsterra',
      format: 'banner_728x90',
      slot: 'middle_placement',
      enabled: true,
      type: 'html_code',
      directLinkUrl: '',
      buttonText: 'VISIT SPONSORED OFFER',
      htmlScriptCode: '',
      zoneId: '',
      sponsorName: 'Verified Partner Offer',
      disclosureText: 'Promotional sponsored partner.',
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyAdminPassword(passwordInput);
    if (!success) {
      setAuthError(true);
    } else {
      setAuthError(false);
      setPasswordInput('');
    }
  };

  const handleResetMovieForm = () => {
    setEditingMovieId(null);
    setMovieFormData({
      title: '',
      genre: 'Action',
      secondaryGenre: '',
      year: new Date().getFullYear(),
      duration: '115 min',
      director: '',
      shortDesc: '',
      synopsis: '',
      editorialNote: 'Selected for remarkable pacing, cinematography, and immersive audio presentation.',
      mood: 'Thrilling & Dynamic',
      accentHue: '#D9A45B',
      posterUrl: posterCyber,
      ratingScore: '8.8',
      quality: '1080p FHD',
      fileSize: '1.8 GB',
      audioTracks: 'Dual Audio [Hindi + Eng]',
      downloadLink720p: '',
      downloadLink1080p: '',
      downloadLink4k: '',
    });
    setShowMovieForm(false);
  };

  const handleEditMovieClick = (movie: FilmItem) => {
    setEditingMovieId(movie.id);
    setMovieFormData({
      title: movie.title,
      genre: movie.genre,
      secondaryGenre: movie.secondaryGenre || '',
      year: movie.year,
      duration: movie.duration,
      director: movie.director,
      shortDesc: movie.shortDesc,
      synopsis: movie.synopsis,
      editorialNote: movie.editorialNote,
      mood: movie.mood,
      accentHue: movie.accentHue,
      posterUrl: movie.posterUrl || posterCyber,
      ratingScore: movie.ratingScore || '8.8',
      quality: movie.quality || '1080p FHD',
      fileSize: movie.fileSize || '1.8 GB',
      audioTracks: movie.audioTracks || 'Dual Audio [Hindi + Eng]',
      downloadLink720p: movie.downloadLink720p || '',
      downloadLink1080p: movie.downloadLink1080p || '',
      downloadLink4k: movie.downloadLink4k || '',
    });
    setShowMovieForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieFormData.title?.trim()) {
      triggerSaveToast('Movie title cannot be empty.');
      return;
    }

    const payload = {
      title: movieFormData.title.trim(),
      genre: (movieFormData.genre as FilmItem['genre']) || 'Action',
      secondaryGenre: movieFormData.secondaryGenre?.trim() || undefined,
      year: Number(movieFormData.year) || 2024,
      duration: movieFormData.duration?.trim() || '115 min',
      director: movieFormData.director?.trim() || 'Curated Selection',
      shortDesc: movieFormData.shortDesc?.trim() || 'High quality cinematic presentation in dual audio format.',
      synopsis: movieFormData.synopsis?.trim() || 'Presented in crystal clear sound and high-definition video.',
      editorialNote: movieFormData.editorialNote?.trim() || 'Selected for outstanding cinema presentation.',
      mood: movieFormData.mood?.trim() || 'Atmospheric & Engaging',
      accentHue: movieFormData.accentHue?.trim() || '#D9A45B',
      posterUrl: movieFormData.posterUrl?.trim() || posterCyber,
      ratingScore: movieFormData.ratingScore?.trim() || '8.8',
      editorialPick: true,
      quality: movieFormData.quality?.trim() || '1080p FHD',
      fileSize: movieFormData.fileSize?.trim() || '1.8 GB',
      audioTracks: movieFormData.audioTracks?.trim() || 'Dual Audio [Hindi + Eng]',
      downloadLink720p: movieFormData.downloadLink720p?.trim() || activeAdsterraLink,
      downloadLink1080p: movieFormData.downloadLink1080p?.trim() || activeAdsterraLink,
      downloadLink4k: movieFormData.downloadLink4k?.trim() || activeAdsterraLink,
    };

    if (editingMovieId) {
      updateMovie(editingMovieId, payload);
    } else {
      addMovie(payload);
    }

    handleResetMovieForm();
  };

  const handle1ClickGitHubPush = async () => {
    // Save token & repo if changed
    updateSettings({
      githubPatToken: patInput,
      githubRepo: repoInput,
      githubBranch: branchInput,
      githubFilePath: filePathInput,
    });
    await oneClickPushToGitHub(patInput, repoInput);
  };

  const handleSaveGitHubConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      githubPatToken: patInput,
      githubRepo: repoInput,
      githubBranch: branchInput,
      githubFilePath: filePathInput,
    });
    triggerSaveToast('GitHub configuration saved! Ready for 1-Click Sync.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        importBackupJSON(text);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtered movies
  const filteredMovies = movies.filter(m => {
    const matchesGenre = movieFilterGenre === 'all' || m.genre.toLowerCase() === movieFilterGenre.toLowerCase();
    const matchesSearch = movieSearchTerm === '' ||
      m.title.toLowerCase().includes(movieSearchTerm.toLowerCase()) ||
      (m.audioTracks && m.audioTracks.toLowerCase().includes(movieSearchTerm.toLowerCase())) ||
      (m.quality && m.quality.toLowerCase().includes(movieSearchTerm.toLowerCase()));
    return matchesGenre && matchesSearch;
  });

  // -------------------------------------------------------------
  // VIEW 1: NOT AUTHENTICATED -> Sleek Dedicated Admin Login Site
  // -------------------------------------------------------------
  if (!adminPasswordCorrect) {
    return (
      <div className="min-h-screen bg-[#0B1017] text-[#F6F0E4] font-sans flex flex-col justify-between items-center p-4 sm:p-8 selection:bg-[#D9A45B]/30">
        {/* Top bar with back to site */}
        <header className="w-full max-w-4xl flex items-center justify-between py-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D9A45B] to-[#B87D3B] flex items-center justify-center text-black font-serif font-black shadow-lg">
              S
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-widest text-[#F6F0E4]">STREAMORA</span>
              <span className="ml-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#D9A45B] border border-[#334155]">
                Admin Console
              </span>
            </div>
          </div>
          <button
            onClick={closeAdmin}
            className="flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#F6F0E4] bg-[#141C28] hover:bg-[#1E293B] border border-[#334155] px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Public Website
          </button>
        </header>

        {/* Central Auth Terminal Card */}
        <div className="w-full max-w-md my-auto py-10">
          <div className="bg-[#141C28] border border-[#2A374A] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
            {/* Ambient gold glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D9A45B]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center mx-auto mb-5 text-[#D9A45B] shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-bold text-center tracking-wide text-[#F6F0E4] mb-2">
              Executive Admin Portal
            </h1>
            <p className="text-xs text-[#94A3B8] text-center mb-6 leading-relaxed">
              Enter authorized administrator credentials to manage movie catalogues, Adsterra links, and 1-Click GitHub sync.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  Security Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setAuthError(false);
                    }}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 pr-11 bg-[#0D141F] border border-[#2A374A] focus:border-[#D9A45B] rounded-xl text-sm text-[#F6F0E4] text-center tracking-wider focus:outline-none transition-colors"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#CBD5E1] p-1 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {authError && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 flex items-center gap-2 text-xs text-rose-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>Access Denied. Passcode incorrect.</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#D9A45B] to-[#C28B45] hover:from-[#E5B573] hover:to-[#D9A45B] text-black font-semibold text-sm rounded-xl transition-all shadow-lg hover:shadow-[#D9A45B]/20 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <ShieldCheck className="w-4 h-4" />
                Access Control Terminal
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#1E293B] text-center">
              <span className="text-[11px] font-mono text-[#64748B]">
                Protected Endpoint: /admin • Direct Node Session
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-4xl text-center py-4 border-t border-[#1E293B] text-xs text-[#64748B] font-mono">
          Streamora Cinema Discovery Engine • Authorized Personnel Only
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED -> Complete Standalone Admin Portal Site
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#F6F0E4] font-sans flex flex-col selection:bg-[#D9A45B]/30">
      {/* 1. TOP EXECUTIVE NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#101724]/95 border-b border-[#223044] backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D9A45B] to-[#B87D3B] flex items-center justify-center text-black font-serif font-black shadow-lg">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base tracking-wider text-[#F6F0E4]">STREAMORA</span>
              <span className="text-[10px] font-mono uppercase bg-[#1C2636] text-[#D9A45B] border border-[#2E3E55] px-2 py-0.5 rounded font-bold">
                ADMIN CONSOLE
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Live • 1-Click Cloud Sync Ready</span>
            </div>
          </div>
        </div>

        {/* Center: The Core 1-Click Push to GitHub Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handle1ClickGitHubPush}
            disabled={isSyncingToGitHub}
            title="1-Click push all added, edited, or deleted movies to GitHub and live site"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-[#D9A45B] to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSyncingToGitHub ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Syncing to GitHub...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black text-black" />
                <span className="hidden sm:inline">⚡ 1-Click Push to GitHub & Save Live</span>
                <span className="sm:hidden">⚡ 1-Click Sync</span>
              </>
            )}
          </button>

          {lastSyncCommit && (
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1.5 bg-[#172130] border border-[#2B3B50] rounded-lg text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SHA: {lastSyncCommit.sha} ({lastSyncCommit.time})</span>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={closeAdmin}
            className="flex items-center gap-1.5 text-xs font-mono text-[#CBD5E1] hover:text-white bg-[#172232] hover:bg-[#223249] border border-[#2C3E55] px-3 py-2 rounded-xl transition-all cursor-pointer"
            title="Switch back to public viewer layout"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D9A45B]" />
            <span className="hidden md:inline">View Public Website</span>
            <span className="md:hidden">Site</span>
          </button>

          <button
            onClick={adminLogout}
            className="flex items-center gap-1.5 text-xs font-mono text-rose-300 hover:text-rose-100 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/40 px-3 py-2 rounded-xl transition-all cursor-pointer"
            title="Log out of admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Sync Status Banner if in progress or error */}
      {syncStatusMessage && (
        <div className="bg-amber-950/70 border-b border-amber-600/50 px-4 py-2 flex items-center justify-center gap-2 text-xs font-mono text-amber-200 animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>{syncStatusMessage}</span>
        </div>
      )}

      {syncErrorMessage && (
        <div className="bg-rose-950/90 border-b border-rose-700 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-rose-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{syncErrorMessage}</span>
          </div>
          <button
            onClick={() => setActiveTab('github_sync')}
            className="underline hover:text-white ml-3 font-semibold"
          >
            Configure GitHub PAT & Repo
          </button>
        </div>
      )}

      {/* 2. BODY LAYOUT (SIDEBAR + MAIN CONTENT) */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 bg-[#0E1522] border-r border-[#1F2C3F] p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] px-3 py-2">
              Management Modules
            </div>

            <button
              onClick={() => { setActiveTab('overview'); setShowMovieForm(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#1C2636] text-[#D9A45B] border border-[#2F4058] shadow-md'
                  : 'text-[#94A3B8] hover:text-[#F6F0E4] hover:bg-[#141C2A]'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab('movies'); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'movies'
                  ? 'bg-[#1C2636] text-[#D9A45B] border border-[#2F4058] shadow-md'
                  : 'text-[#94A3B8] hover:text-[#F6F0E4] hover:bg-[#141C2A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Film className="w-4 h-4" />
                <span>Manage Movies</span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-[#253347] text-[#CBD5E1]">
                {movies.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('ads'); setShowMovieForm(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'ads'
                  ? 'bg-[#1C2636] text-[#D9A45B] border border-[#2F4058] shadow-md'
                  : 'text-[#94A3B8] hover:text-[#F6F0E4] hover:bg-[#141C2A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4" />
                <span>Adsterra & Ads</span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                {ads.filter(a => a.enabled).length} Active
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('github_sync'); setShowMovieForm(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'github_sync'
                  ? 'bg-[#1C2636] text-[#D9A45B] border border-[#2F4058] shadow-md'
                  : 'text-[#94A3B8] hover:text-[#F6F0E4] hover:bg-[#141C2A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Github className="w-4 h-4 text-[#D9A45B]" />
                <span>1-Click GitHub Sync</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                PAT
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setShowMovieForm(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#1C2636] text-[#D9A45B] border border-[#2F4058] shadow-md'
                  : 'text-[#94A3B8] hover:text-[#F6F0E4] hover:bg-[#141C2A]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Website Settings</span>
            </button>
          </div>

          {/* Quick Adsterra Smartlink Status Box */}
          <div className="mt-6 p-3 bg-[#131B27] border border-[#233145] rounded-xl text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] text-[#94A3B8] uppercase">Active Monetization</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-[#CBD5E1] truncate font-mono">
              {activeAdsterraLink || 'YOUR_ADSTERRA_LINK'}
            </p>
            <button
              onClick={() => setActiveTab('ads')}
              className="mt-2 text-[10px] text-[#D9A45B] hover:underline font-mono flex items-center gap-1"
            >
              Configure Master Link &rarr;
            </button>
          </div>
        </aside>

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Top Unsynced Alert Banner */}
          {hasUnsavedCloudChanges && (
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-950/90 via-amber-900/70 to-slate-900 border border-amber-500/60 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xl animate-fadeIn">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
                <div>
                  <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                    <span>Unsaved Cloud Changes! (লোকাল পরিবর্তন গিটহাবে পুশ করার জন্য প্রস্তুত)</span>
                  </div>
                  <div className="text-[11px] text-amber-200/90 mt-0.5">
                    Click 1-Click Push to permanently commit changes to GitHub & Cloudflare Workers so all users on any browser see them.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handle1ClickGitHubPush}
                disabled={isSyncingToGitHub}
                className="px-4 py-2 bg-[#D9A45B] hover:bg-[#E5B573] text-black font-black text-xs rounded-xl shadow-lg shadow-amber-500/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>{isSyncingToGitHub ? 'Pushing Live...' : '⚡ 1-Click Push to GitHub'}</span>
              </button>
            </div>
          )}
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F6F0E4]">Control Center Overview</h2>
                <p className="text-xs text-[#94A3B8]">
                  Manage your Moviebaaz-style movie discovery journal, video downloads, Adsterra links, and 1-Click GitHub repository synchronization.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#121926] border border-[#202C3F] p-4 rounded-2xl relative overflow-hidden">
                  <div className="text-[11px] font-mono uppercase text-[#94A3B8]">Catalogue Titles</div>
                  <div className="text-2xl font-bold font-serif text-[#F6F0E4] mt-1">{movies.length} Movies</div>
                  <div className="text-[11px] text-[#63A9A0] font-mono mt-1">Dual Audio + 4K / 1080p</div>
                  <Film className="w-8 h-8 text-[#202C3F] absolute right-3 bottom-3" />
                </div>

                <div className="bg-[#121926] border border-[#202C3F] p-4 rounded-2xl relative overflow-hidden">
                  <div className="text-[11px] font-mono uppercase text-[#94A3B8]">Ad Placements</div>
                  <div className="text-2xl font-bold font-serif text-[#D9A45B] mt-1">
                    {ads.filter(a => a.enabled).length} Active Slots
                  </div>
                  <div className="text-[11px] text-[#94A3B8] font-mono mt-1">Direct Link + Banner</div>
                  <DollarSign className="w-8 h-8 text-[#202C3F] absolute right-3 bottom-3" />
                </div>

                <div className="bg-[#121926] border border-[#202C3F] p-4 rounded-2xl relative overflow-hidden">
                  <div className="text-[11px] font-mono uppercase text-[#94A3B8]">GitHub Repository</div>
                  <div className="text-sm font-bold font-mono text-[#F6F0E4] mt-2 truncate">
                    {settings.githubRepo || 'Not configured'}
                  </div>
                  <div className="text-[11px] text-[#64748B] font-mono mt-0.5">Branch: {settings.githubBranch || 'main'}</div>
                  <Github className="w-8 h-8 text-[#202C3F] absolute right-3 bottom-3" />
                </div>

                <div className="bg-[#121926] border border-[#202C3F] p-4 rounded-2xl relative overflow-hidden">
                  <div className="text-[11px] font-mono uppercase text-[#94A3B8]">Last 1-Click Sync</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-2 truncate">
                    {lastSyncCommit ? `Commit ${lastSyncCommit.sha}` : 'Ready for Sync'}
                  </div>
                  <div className="text-[11px] text-[#64748B] font-mono mt-0.5">
                    {lastSyncCommit ? lastSyncCommit.time : 'Instant Push Button Available'}
                  </div>
                  <Zap className="w-8 h-8 text-[#202C3F] absolute right-3 bottom-3" />
                </div>
              </div>

              {/* Quick Actions Action Bar */}
              <div className="bg-gradient-to-r from-[#141C28] to-[#1A2433] border border-[#253448] p-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[#F6F0E4] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D9A45B]" />
                    Fast Action Center
                  </h3>
                  <p className="text-xs text-[#94A3B8]">Add a new movie, apply Adsterra monetization links, or push straight to GitHub.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => {
                      handleResetMovieForm();
                      setShowMovieForm(true);
                      setActiveTab('movies');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#D9A45B] hover:bg-[#E5B573] text-black font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add New Movie
                  </button>

                  <button
                    onClick={handle1ClickGitHubPush}
                    disabled={isSyncingToGitHub}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1C2636] hover:bg-[#253347] border border-[#34455E] text-[#D9A45B] font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-[#D9A45B]" />
                    1-Click Push to GitHub
                  </button>

                  <button
                    onClick={downloadBackupJSON}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1C2636] hover:bg-[#253347] border border-[#34455E] text-[#CBD5E1] text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Backup JSON
                  </button>
                </div>
              </div>

              {/* Quick Recent Movies List */}
              <div className="bg-[#121926] border border-[#202C3F] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#F6F0E4]">Recent Catalogue Items</h3>
                  <button
                    onClick={() => setActiveTab('movies')}
                    className="text-xs text-[#D9A45B] hover:underline font-mono"
                  >
                    View All {movies.length} Movies &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {movies.slice(0, 6).map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center gap-3 p-3 bg-[#0D141F] border border-[#1E2B3E] rounded-xl hover:border-[#D9A45B]/40 transition-all"
                    >
                      <img
                        src={movie.posterUrl || posterCyber}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded-lg shrink-0 border border-[#26374D]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-[#F6F0E4] truncate">{movie.title}</div>
                        <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                          {movie.year} • {movie.genre} • {movie.quality || '1080p'}
                        </div>
                        <div className="text-[10px] text-[#63A9A0] font-mono truncate mt-0.5">
                          {movie.audioTracks || 'Dual Audio'}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('movies');
                          handleEditMovieClick(movie);
                        }}
                        className="p-1.5 text-[#94A3B8] hover:text-[#D9A45B] bg-[#141E2B] rounded-lg transition-colors cursor-pointer"
                        title="Edit movie"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE MOVIES */}
          {activeTab === 'movies' && (
            <div className="space-y-6">
              {/* Top Title & Add Button */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F6F0E4]">Movie Catalogue Management</h2>
                  <p className="text-xs text-[#94A3B8]">
                    Add, edit, or delete movies. Changes save immediately to the live site and can be pushed to GitHub with 1 click.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handle1ClickGitHubPush}
                    disabled={isSyncingToGitHub}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                    title="Commit all additions and deletions to GitHub repository"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>{isSyncingToGitHub ? 'Syncing...' : '⚡ 1-Click Push to GitHub'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (showMovieForm && !editingMovieId) {
                        setShowMovieForm(false);
                      } else {
                        handleResetMovieForm();
                        setShowMovieForm(true);
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#D9A45B] hover:bg-[#E5B573] text-black font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    {showMovieForm && !editingMovieId ? 'Cancel Form' : 'Add New Movie'}
                  </button>
                </div>
              </div>

              {/* Movie Form (Add / Edit) */}
              {showMovieForm && (
                <div className="bg-[#121926] border border-[#D9A45B]/60 rounded-2xl p-5 sm:p-6 shadow-2xl animate-fadeIn">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#202C3F]">
                    <div>
                      <h3 className="text-base font-bold text-[#F6F0E4] flex items-center gap-2">
                        {editingMovieId ? <Edit3 className="w-4 h-4 text-[#D9A45B]" /> : <Plus className="w-4 h-4 text-[#D9A45B]" />}
                        {editingMovieId ? 'Edit Movie Details' : 'Add New Title to Catalogue'}
                      </h3>
                      <p className="text-xs text-[#94A3B8]">
                        Fill in video quality, audio tracks, and download offer links (e.g. Adsterra Smartlink).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetMovieForm}
                      className="text-xs text-[#94A3B8] hover:text-white px-3 py-1 bg-[#1A2535] rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveMovie} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      {/* Movie Title */}
                      <div className="sm:col-span-2">
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Title *</label>
                        <input
                          type="text"
                          required
                          value={movieFormData.title || ''}
                          onChange={(e) => setMovieFormData({ ...movieFormData, title: e.target.value })}
                          placeholder="e.g. Cyber Odyssey 2099"
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none"
                        />
                      </div>

                      {/* Genre */}
                      <div>
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Genre</label>
                        <select
                          value={movieFormData.genre || 'Action'}
                          onChange={(e) => setMovieFormData({ ...movieFormData, genre: e.target.value as FilmItem['genre'] })}
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none"
                        >
                          <option value="Action">Action</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Sci-Fi">Sci-Fi</option>
                          <option value="Drama">Drama</option>
                          <option value="Romance">Romance</option>
                          <option value="Mystery">Mystery</option>
                          <option value="Comedy">Comedy</option>
                          <option value="Documentary">Documentary</option>
                        </select>
                      </div>

                      {/* Secondary Genre */}
                      <div>
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Secondary Sub-Genre</label>
                        <input
                          type="text"
                          value={movieFormData.secondaryGenre || ''}
                          onChange={(e) => setMovieFormData({ ...movieFormData, secondaryGenre: e.target.value })}
                          placeholder="e.g. Cyberpunk Noir"
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none"
                        />
                      </div>

                      {/* Release Year */}
                      <div>
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Year</label>
                        <input
                          type="number"
                          value={movieFormData.year || 2024}
                          onChange={(e) => setMovieFormData({ ...movieFormData, year: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none"
                        />
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Duration</label>
                        <input
                          type="text"
                          value={movieFormData.duration || '118 min'}
                          onChange={(e) => setMovieFormData({ ...movieFormData, duration: e.target.value })}
                          placeholder="e.g. 118 min"
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none"
                        />
                      </div>

                      {/* Quality */}
                      <div>
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Video Resolution / Quality</label>
                        <input
                          type="text"
                          value={movieFormData.quality || '1080p FHD'}
                          onChange={(e) => setMovieFormData({ ...movieFormData, quality: e.target.value })}
                          placeholder="e.g. 4K Ultra HD or 1080p FHD"
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none font-mono"
                        />
                      </div>

                      {/* Audio Tracks */}
                      <div>
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Audio Tracks</label>
                        <input
                          type="text"
                          value={movieFormData.audioTracks || 'Dual Audio [Hindi + Eng]'}
                          onChange={(e) => setMovieFormData({ ...movieFormData, audioTracks: e.target.value })}
                          placeholder="e.g. Dual Audio [Hindi + Eng]"
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none font-mono"
                        />
                      </div>

                      {/* File Size */}
                      <div>
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">File Size</label>
                        <input
                          type="text"
                          value={movieFormData.fileSize || '1.8 GB'}
                          onChange={(e) => setMovieFormData({ ...movieFormData, fileSize: e.target.value })}
                          placeholder="e.g. 1.8 GB"
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none font-mono"
                        />
                      </div>

                      {/* IMDB Rating */}
                      <div>
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">IMDB Rating</label>
                        <input
                          type="text"
                          value={movieFormData.ratingScore || '8.8'}
                          onChange={(e) => setMovieFormData({ ...movieFormData, ratingScore: e.target.value })}
                          placeholder="e.g. 8.8"
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none font-mono"
                        />
                      </div>

                      {/* Director */}
                      <div className="sm:col-span-2">
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Director</label>
                        <input
                          type="text"
                          value={movieFormData.director || ''}
                          onChange={(e) => setMovieFormData({ ...movieFormData, director: e.target.value })}
                          placeholder="Director Name"
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none"
                        />
                      </div>

                      {/* Poster Image URL */}
                      <div className="sm:col-span-3">
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Poster Image URL or Preset</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={movieFormData.posterUrl || ''}
                            onChange={(e) => setMovieFormData({ ...movieFormData, posterUrl: e.target.value })}
                            placeholder="https://... image url"
                            className="flex-1 px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none font-mono text-[11px]"
                          />
                        </div>
                        {/* Quick Preset Selector */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono text-[#94A3B8]">Quick Posters:</span>
                          {SAMPLE_POSTERS.map((sample) => (
                            <button
                              key={sample.name}
                              type="button"
                              onClick={() => setMovieFormData({ ...movieFormData, posterUrl: sample.url })}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#172232] border border-[#283A4F] hover:border-[#D9A45B] text-[#CBD5E1]"
                            >
                              {sample.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* DOWNLOAD LINKS & ADSTERRA INTEGRATION */}
                      <div className="sm:col-span-3 p-4 bg-[#0B1019] border border-[#223145] rounded-xl space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-xs text-[#D9A45B] flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5" />
                            Direct Video Download Links & Auto-Quality Generator
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const master = movieFormData.masterVideoLink || activeAdsterraLink;
                                if (!master) {
                                  triggerSaveToast('Please enter a Master Video / Cloud Link or configure Adsterra first.');
                                  return;
                                }
                                setMovieFormData({
                                  ...movieFormData,
                                  downloadLink480p: master.includes('#') ? master : `${master}#480p`,
                                  downloadLink720p: master.includes('#') ? master : `${master}#720p`,
                                  downloadLink1080p: master.includes('#') ? master : `${master}#1080p`,
                                  downloadLink4k: master.includes('#') ? master : `${master}#4k`,
                                });
                                triggerSaveToast('⚡ Auto-generated 480p, 720p, 1080p, and 4K links from Master link!');
                              }}
                              className="px-2.5 py-1 bg-[#1A2535] hover:bg-[#D9A45B] hover:text-black text-[#D9A45B] rounded-lg text-[11px] font-mono font-bold transition-all border border-[#283B52]"
                            >
                              ⚡ Auto-Generate All 4 Qualities
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMovieFormData({
                                  ...movieFormData,
                                  downloadLink480p: activeAdsterraLink,
                                  downloadLink720p: activeAdsterraLink,
                                  downloadLink1080p: activeAdsterraLink,
                                  downloadLink4k: activeAdsterraLink,
                                });
                                triggerSaveToast('Filled all download buttons with Master Adsterra link!');
                              }}
                              className="text-[11px] font-mono text-[#63A9A0] hover:underline"
                            >
                              Fill with Adsterra
                            </button>
                          </div>
                        </div>

                        {/* Master Video / Cloud File Link */}
                        <div>
                          <label className="block text-slate-300 mb-1 font-semibold text-xs">
                            Master Full Movie Cloud Link (Google Drive, Mega, TeraBox, StreamTape, Direct Server)
                          </label>
                          <input
                            type="text"
                            value={movieFormData.masterVideoLink || ''}
                            onChange={(e) => setMovieFormData({ ...movieFormData, masterVideoLink: e.target.value })}
                            placeholder="https://drive.google.com/... or https://mega.nz/... or Direct Server URL"
                            className="w-full px-3 py-2 bg-[#0D141F] border border-[#223145] rounded-xl text-white font-mono text-xs focus:border-[#D9A45B] focus:outline-none"
                          />
                          <p className="text-[11px] text-slate-400 mt-1">
                            💡 You can provide a single high quality master link above, or give separate links for each quality below.
                          </p>
                        </div>

                        {/* Quality link grid (480p, 720p, 1080p, 4k) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                          <div>
                            <label className="block text-teal-400 mb-1 font-mono text-[11px]">480p SD (Mobile)</label>
                            <input
                              type="text"
                              value={movieFormData.downloadLink480p || ''}
                              onChange={(e) => setMovieFormData({ ...movieFormData, downloadLink480p: e.target.value })}
                              placeholder="https://... 480p link"
                              className="w-full px-2.5 py-1.5 bg-[#0D141F] border border-[#223145] rounded-lg text-[#F6F0E4] font-mono text-[11px]"
                            />
                          </div>

                          <div>
                            <label className="block text-[#63A9A0] mb-1 font-mono text-[11px]">720p HD Link</label>
                            <input
                              type="text"
                              value={movieFormData.downloadLink720p || ''}
                              onChange={(e) => setMovieFormData({ ...movieFormData, downloadLink720p: e.target.value })}
                              placeholder="https://... 720p link"
                              className="w-full px-2.5 py-1.5 bg-[#0D141F] border border-[#223145] rounded-lg text-[#F6F0E4] font-mono text-[11px]"
                            />
                          </div>

                          <div>
                            <label className="block text-[#D9A45B] mb-1 font-mono text-[11px]">1080p FHD Link</label>
                            <input
                              type="text"
                              value={movieFormData.downloadLink1080p || ''}
                              onChange={(e) => setMovieFormData({ ...movieFormData, downloadLink1080p: e.target.value })}
                              placeholder="https://... 1080p link"
                              className="w-full px-2.5 py-1.5 bg-[#0D141F] border border-[#223145] rounded-lg text-[#F6F0E4] font-mono text-[11px]"
                            />
                          </div>

                          <div>
                            <label className="block text-amber-400 mb-1 font-mono text-[11px]">4K Ultra HD Link</label>
                            <input
                              type="text"
                              value={movieFormData.downloadLink4k || ''}
                              onChange={(e) => setMovieFormData({ ...movieFormData, downloadLink4k: e.target.value })}
                              placeholder="https://... 4k link"
                              className="w-full px-2.5 py-1.5 bg-[#0D141F] border border-[#223145] rounded-lg text-[#F6F0E4] font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        {/* Bengali & English Guide Explanation Box */}
                        <div className="p-3 bg-[#070B12] rounded-xl border border-[#1E2B3E] text-[11px] text-slate-300 space-y-1">
                          <div className="font-bold text-[#D9A45B]">
                            ❓ ফাইল আপলোড ও কোয়ালিটি কনভার্ট সংক্রান্ত নির্দেশিকা (File Upload & Quality FAQ):
                          </div>
                          <div>
                            • <strong>High Quality ফাইল দিলে কি automatic convert হবে?</strong> হ্যাঁ, উপরে মাস্টার লিঙ্ক দিয়ে <strong>'⚡ Auto-Generate All 4 Qualities'</strong> বাটনে ক্লিক করলেই স্বয়ংক্রিয়ভাবে 480p, 720p, 1080p ও 4K বাটন তৈরি হয়ে যাবে! অথবা আলাদা আলাদা লিঙ্কও দিতে পারেন।
                          </div>
                          <div>
                            • <strong>সরাসরি গিটহাবে ভিডিও ফাইল আপলোড:</strong> ফুল মুভি সাধারণত ১-৫ গিগাবাইট হয়ে থাকে, কিন্তু GitHub-এর ফাইল সাইজ লিমিট সর্বোচ্চ ১০০ মেগাবাইট (100MB)। তাই রিয়েল মুভি সাইটগুলোতে ভিডিও ফাইল ক্লাউড স্টোরেজে (Google Drive, Mega, TeraBox, StreamTape, FastServer) রেখে লিংক দেওয়া হয়।
                          </div>
                        </div>
                      </div>

                      {/* Hook & Synopsis */}
                      <div className="sm:col-span-3">
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Short Hook Description</label>
                        <input
                          type="text"
                          value={movieFormData.shortDesc || ''}
                          onChange={(e) => setMovieFormData({ ...movieFormData, shortDesc: e.target.value })}
                          placeholder="A quick 1-sentence hook"
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Full Story Synopsis</label>
                        <textarea
                          rows={3}
                          value={movieFormData.synopsis || ''}
                          onChange={(e) => setMovieFormData({ ...movieFormData, synopsis: e.target.value })}
                          placeholder="Full storyline synopsis"
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#202C3F]">
                      <button
                        type="button"
                        onClick={handleResetMovieForm}
                        className="px-4 py-2.5 bg-[#172232] hover:bg-[#202C3F] text-[#CBD5E1] rounded-xl text-xs font-semibold"
                      >
                        Cancel
                      </button>

                      {/* Regular Save */}
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-[#1E293B] hover:bg-[#28384E] text-[#F6F0E4] font-bold text-xs rounded-xl border border-[#334155] shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{editingMovieId ? 'Save & Update (Local)' : 'Save to Catalogue'}</span>
                      </button>

                      {/* 1-Click Save & Push directly to GitHub */}
                      <button
                        type="button"
                        onClick={async (e) => {
                          handleSaveMovie(e);
                          await handle1ClickGitHubPush();
                        }}
                        disabled={isSyncingToGitHub}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Zap className="w-4 h-4" />
                        <span>{isSyncingToGitHub ? 'Pushing Live...' : '⚡ Save & Push Live to GitHub'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Movie Search & Filter Controls */}
              <div className="bg-[#121926] border border-[#202C3F] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-[#64748B]" />
                  <input
                    type="text"
                    value={movieSearchTerm}
                    onChange={(e) => setMovieSearchTerm(e.target.value)}
                    placeholder="Search by title, quality, audio track..."
                    className="w-full bg-transparent text-xs text-[#F6F0E4] placeholder-[#64748B] focus:outline-none"
                  />
                  {movieSearchTerm && (
                    <button
                      onClick={() => setMovieSearchTerm('')}
                      className="text-xs text-[#94A3B8] hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#94A3B8]">Genre:</span>
                  <select
                    value={movieFilterGenre}
                    onChange={(e) => setMovieFilterGenre(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#0D141F] border border-[#223145] rounded-lg text-xs text-[#F6F0E4] focus:outline-none"
                  >
                    <option value="all">All Genres ({movies.length})</option>
                    <option value="action">Action</option>
                    <option value="adventure">Adventure</option>
                    <option value="sci-fi">Sci-Fi</option>
                    <option value="drama">Drama</option>
                    <option value="mystery">Mystery</option>
                    <option value="romance">Romance</option>
                    <option value="comedy">Comedy</option>
                  </select>
                </div>
              </div>

              {/* Movies Table / Cards */}
              <div className="bg-[#121926] border border-[#202C3F] rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-[#202C3F] flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#94A3B8]">
                    Catalogue List ({filteredMovies.length} of {movies.length})
                  </span>
                  <span className="text-xs font-mono text-[#63A9A0]">
                    ⚡ Realtime Live Sync Enabled
                  </span>
                </div>

                <div className="divide-y divide-[#1B2636]">
                  {filteredMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#141C2B] transition-colors"
                    >
                      {/* Movie Info */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={movie.posterUrl || posterCyber}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded-lg shrink-0 border border-[#25354A]"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-[#F6F0E4] truncate">{movie.title}</h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B2638] text-[#D9A45B] border border-[#293B52]">
                              {movie.year}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
                              {movie.quality || '1080p'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-[#94A3B8] mt-1 flex-wrap">
                            <span>{movie.genre}</span>
                            <span>•</span>
                            <span>{movie.duration}</span>
                            <span>•</span>
                            <span className="text-[#63A9A0] font-mono">{movie.audioTracks || 'Dual Audio'}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-mono">★ {movie.ratingScore || '8.8'}</span>
                          </div>

                          <div className="text-[11px] font-mono text-[#64748B] mt-1 truncate max-w-md">
                            1080p: {movie.downloadLink1080p || 'Uses Adsterra'} • 4K: {movie.downloadLink4k || 'Uses Adsterra'}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Edit & Delete */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleEditMovieClick(movie)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#172232] hover:bg-[#202E42] text-[#CBD5E1] hover:text-[#D9A45B] border border-[#283B50] rounded-xl text-xs transition-colors cursor-pointer"
                          title="Edit movie info"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${movie.title}" from the catalogue?`)) {
                              deleteMovie(movie.id);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-xl text-xs transition-colors cursor-pointer"
                          title="Delete movie"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredMovies.length === 0 && (
                    <div className="p-8 text-center text-xs text-[#64748B]">
                      No movies matched your filter. Click "Add New Movie" above to add one.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADSTERRA, ADCASH & HILLTOPADS MONETIZATION MANAGER */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F6F0E4] flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-[#D9A45B]" />
                    <span>Adsterra, Adcash & HilltopAds Monetization Hub</span>
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Manage Popunders, AutoTags, Banners (728x90, 300x250), Social Bars, and Smartlinks for all major ad networks.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handle1ClickGitHubPush}
                    disabled={isSyncingToGitHub}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>{isSyncingToGitHub ? 'Syncing...' : '⚡ 1-Click Push Ads to GitHub'}</span>
                  </button>

                  <button
                    onClick={() => setShowNewAdModal(!showNewAdModal)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#D9A45B] hover:bg-[#E5B573] text-black font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showNewAdModal ? 'Close Form' : 'Add New Ad Format Code'}</span>
                  </button>
                </div>
              </div>

              {/* Master Adsterra Smartlink Banner */}
              <div className="bg-gradient-to-r from-[#172232] via-[#1A2535] to-[#121926] border border-[#D9A45B]/50 p-5 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#D9A45B]" />
                    <h3 className="text-sm font-bold text-[#F6F0E4]">Master Direct Link / Smartlink (Global Fallback)</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                    Direct Link • Adsterra / HilltopAds / Adcash
                  </span>
                </div>

                <p className="text-xs text-[#94A3B8] mb-3">
                  This master link acts as the default fallback for all movie download buttons and direct sponsor clicks.
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={activeAdsterraLink}
                    onChange={(e) => setActiveAdsterraLink(e.target.value)}
                    placeholder="https://... your Adsterra Direct Link or HilltopAds Smartlink"
                    className="flex-1 px-4 py-2.5 bg-[#0A0E17] border border-[#27384D] focus:border-[#D9A45B] rounded-xl text-xs font-mono text-[#F6F0E4] focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      bulkApplyAdsterraLink(activeAdsterraLink);
                      triggerSaveToast('Master Smartlink saved & applied to all movie download buttons!');
                    }}
                    className="px-4 py-2.5 bg-[#D9A45B] hover:bg-[#E5B573] text-black font-bold text-xs rounded-xl cursor-pointer shadow-md whitespace-nowrap"
                  >
                    Apply to All Movie Buttons
                  </button>
                </div>
              </div>

              {/* INTERACTIVE AD SIZE & PLACEMENT CHEAT SHEET */}
              <div className="bg-[#0D1420] border border-[#23354C] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D9A45B]" />
                    <h3 className="text-xs sm:text-sm font-bold text-[#F6F0E4] uppercase tracking-wide">
                      💡 Ad Placement & Size Strategy Guide (কোন অ্যাড কোথায়, কোন সাইজে ও কোন নেটওয়ার্ক বসালে সর্বোচ্চ ইনকাম হবে)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    High CPM Movie Portal Setup
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 text-xs">
                  {/* Slot 1: Top Header */}
                  <div className="p-3.5 bg-[#121A26] border border-[#1E2B3E] rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#D9A45B]">1. Top Header Banner</span>
                      <span className="font-mono text-[10px] text-slate-400">728x90 / 320x50</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      <strong>স্লট:</strong> <code className="text-teal-300">top_banner</code> (হেডারের নিচে ও স্লাইডারের উপরে)।
                    </p>
                    <p className="text-[11px] text-slate-400">
                      <strong>সেরা ফরম্যাট:</strong> Adsterra 728x90 Leaderboard অথবা Adcash 728x90। মোবাইলের জন্য 320x50।
                    </p>
                    <div className="text-[10px] text-amber-300/90 font-mono">
                      রেটিং: ⭐⭐⭐⭐ (হাই ভিউ ও ব্র্যান্ডিং)
                    </div>
                  </div>

                  {/* Slot 2: Middle Placement */}
                  <div className="p-3.5 bg-[#121A26] border border-[#1E2B3E] rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#D9A45B]">2. Middle Content Banner</span>
                      <span className="font-mono text-[10px] text-slate-400">728x90 / 300x250</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      <strong>স্লট:</strong> <code className="text-teal-300">middle_placement</code> (স্লাইডার ও মুভি গ্রিডের মাঝে)।
                    </p>
                    <p className="text-[11px] text-slate-400">
                      <strong>সেরা ফরম্যাট:</strong> 300x250 Medium Rectangle বা Native Banner Widget।
                    </p>
                    <div className="text-[10px] text-amber-300/90 font-mono">
                      রেটিং: ⭐⭐⭐⭐⭐ (ইউজার স্ক্রল করার সময় সর্বোচ্চ ক্লিক)
                    </div>
                  </div>

                  {/* Slot 3: Movie Download Modal */}
                  <div className="p-3.5 bg-[#121A26] border border-amber-500/40 rounded-xl space-y-1.5 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300">3. Movie Download Modal</span>
                      <span className="font-mono text-[10px] text-amber-400">300x250 / Smartlink</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      <strong>স্লট:</strong> <code className="text-teal-300">detail_modal_ad</code> (মুভি ডাউনলোড পপআপের ভেতরে)।
                    </p>
                    <p className="text-[11px] text-slate-400">
                      <strong>সেরা ফরম্যাট:</strong> Adsterra 300x250 বা Direct Smartlink বাটন।
                    </p>
                    <div className="text-[10px] text-emerald-400 font-mono font-bold">
                      রেটিং: ⭐⭐⭐⭐⭐ (মুভি সাইটের সর্বোচ্চ কনভার্সন স্পট!)
                    </div>
                  </div>

                  {/* Slot 4: Popunder / OnClick */}
                  <div className="p-3.5 bg-[#121A26] border border-[#1E2B3E] rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#D9A45B]">4. Popunder / OnClick</span>
                      <span className="font-mono text-[10px] text-slate-400">Full Tab Pop</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      <strong>স্লট:</strong> <code className="text-teal-300">floating_corner</code> (গ্লোবাল ব্যাকগ্রাউন্ড)।
                    </p>
                    <p className="text-[11px] text-slate-400">
                      <strong>সেরা ফরম্যাট:</strong> Adsterra Popunder বা HilltopAds OnClick Popunder কোড।
                    </p>
                    <div className="text-[10px] text-emerald-400 font-mono font-bold">
                      রেটিং: ⭐⭐⭐⭐⭐ (সর্বোচ্চ ইনকাম: $3 - $10+ CPM)
                    </div>
                  </div>

                  {/* Slot 5: Social Bar / In-Page Push */}
                  <div className="p-3.5 bg-[#121A26] border border-[#1E2B3E] rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#D9A45B]">5. Social Bar / Push</span>
                      <span className="font-mono text-[10px] text-slate-400">Floating Alert</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      <strong>স্লট:</strong> <code className="text-teal-300">floating_corner</code> (গ্লোবাল স্ক্রিপ্ট)।
                    </p>
                    <p className="text-[11px] text-slate-400">
                      <strong>সেরা ফরম্যাট:</strong> Adsterra Social Bar কোড (ইউজারের ডিভাইসে সুন্দর নোটিফিকেশন ভাসে)।
                    </p>
                    <div className="text-[10px] text-amber-300/90 font-mono">
                      রেটিং: ⭐⭐⭐⭐⭐ (সাধারণ ব্যানারের চেয়ে ৩০-৪০% বেশি CTR)
                    </div>
                  </div>

                  {/* Slot 6: Bottom Placement */}
                  <div className="p-3.5 bg-[#121A26] border border-[#1E2B3E] rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#D9A45B]">6. Bottom Page Banner</span>
                      <span className="font-mono text-[10px] text-slate-400">728x90 / 300x250</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      <strong>স্লট:</strong> <code className="text-teal-300">bottom_placement</code> (মুভি লিস্টের নিচে)।
                    </p>
                    <p className="text-[11px] text-slate-400">
                      <strong>সেরা ফরম্যাট:</strong> HilltopAds বা Adcash 728x90 ব্যানার কোড।
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      রেটিং: ⭐⭐⭐ (ফুটার ভিউয়ার্সদের জন্য)
                    </div>
                  </div>
                </div>
              </div>

              {/* Add New Ad Format Form */}
              {showNewAdModal && (
                <div className="bg-[#121926] border-2 border-[#D9A45B]/70 rounded-2xl p-5 sm:p-6 shadow-2xl animate-fadeIn space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#202C3F]">
                    <div>
                      <h3 className="text-base font-bold text-[#F6F0E4] flex items-center gap-2">
                        <Code className="w-4 h-4 text-[#D9A45B]" />
                        <span>Install Ad Format Code (Adsterra, Adcash, HilltopAds)</span>
                      </h3>
                      <p className="text-xs text-[#94A3B8]">
                        Paste your ad network script tag, iframe, or direct link code below.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNewAdModal(false)}
                      className="text-xs text-[#94A3B8] hover:text-white px-3 py-1 bg-[#1A2535] rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleAddNewAd} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Ad Slot Name */}
                      <div>
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Ad Unit Name *</label>
                        <input
                          type="text"
                          required
                          value={newAdData.name}
                          onChange={(e) => setNewAdData({ ...newAdData, name: e.target.value })}
                          placeholder="e.g. Adsterra 728x90 Top Header"
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none"
                        />
                      </div>

                      {/* Ad Network Selector */}
                      <div>
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Ad Network *</label>
                        <select
                          value={newAdData.network || 'adsterra'}
                          onChange={(e) => setNewAdData({ ...newAdData, network: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none font-medium"
                        >
                          <option value="adsterra">Adsterra</option>
                          <option value="adcash">Adcash</option>
                          <option value="hilltopads">HilltopAds</option>
                          <option value="monetag">Monetag</option>
                          <option value="propellerads">PropellerAds</option>
                          <option value="custom">Custom Network</option>
                        </select>
                      </div>

                      {/* Ad Format Selector */}
                      <div>
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Ad Format *</label>
                        <select
                          value={newAdData.format || 'banner_728x90'}
                          onChange={(e) => {
                            const fmt = e.target.value as any;
                            const isScript = fmt !== 'direct_link';
                            setNewAdData({ 
                              ...newAdData, 
                              format: fmt,
                              type: isScript ? 'html_code' : 'direct_link',
                              slot: fmt === 'popunder' || fmt === 'social_bar' ? 'floating_corner' : newAdData.slot
                            });
                          }}
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none font-medium"
                        >
                          <option value="banner_728x90">📊 Banner (728x90 Leaderboard)</option>
                          <option value="banner_300x250">📊 Banner (300x250 Rectangle)</option>
                          <option value="banner_320x50">📱 Banner (320x50 / 468x60 Mobile)</option>
                          <option value="popunder">⚡ Popunder / OnClick Script</option>
                          <option value="social_bar">🔔 Social Bar / In-Page Push</option>
                          <option value="native_banner">📰 Native Banner Widget</option>
                          <option value="direct_link">🌐 Direct Link / Smartlink</option>
                          <option value="html_code">💻 Custom HTML / JS Script</option>
                        </select>
                      </div>

                      {/* Placement Slot */}
                      <div>
                        <label className="block text-[#CBD5E1] mb-1 font-semibold">Display Placement / Slot</label>
                        <select
                          value={newAdData.slot}
                          onChange={(e) => setNewAdData({ ...newAdData, slot: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-[#F6F0E4] focus:outline-none font-medium"
                        >
                          <option value="top_banner">Top Header (Under Navbar / Above Slider)</option>
                          <option value="middle_placement">Middle Placement (Between Slider & Movies)</option>
                          <option value="bottom_placement">Bottom Placement (Above Footer)</option>
                          <option value="detail_modal_ad">Inside Movie Download Dossier Modal</option>
                          <option value="floating_corner">Global Background (Popunders, Social Bar, AutoTag)</option>
                        </select>
                      </div>

                      {/* Direct Link input if chosen */}
                      {newAdData.format === 'direct_link' ? (
                        <div className="sm:col-span-2">
                          <label className="block text-[#CBD5E1] mb-1 font-semibold">Direct Link URL *</label>
                          <input
                            type="text"
                            value={newAdData.directLinkUrl}
                            onChange={(e) => setNewAdData({ ...newAdData, directLinkUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] rounded-xl text-[#F6F0E4] font-mono text-xs focus:border-[#D9A45B] focus:outline-none"
                          />
                        </div>
                      ) : (
                        /* HTML / Script Code Textarea */
                        <div className="sm:col-span-2">
                          <label className="block text-[#CBD5E1] mb-1 font-semibold">
                            Ad Script / HTML Code Snippet (Paste exactly as provided by ad network) *
                          </label>
                          <textarea
                            rows={4}
                            required
                            value={newAdData.htmlScriptCode}
                            onChange={(e) => setNewAdData({ ...newAdData, htmlScriptCode: e.target.value, type: 'html_code' })}
                            placeholder={'<script type="text/javascript" src="//acscdn.com/..."></script>\n<script>\n  // or Adsterra / HilltopAds snippet\n</script>'}
                            className="w-full px-3 py-2 bg-[#0A0E17] border border-[#253448] rounded-xl text-[#F6F0E4] font-mono text-xs focus:border-[#D9A45B] focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#202C3F]">
                      <button
                        type="button"
                        onClick={() => setShowNewAdModal(false)}
                        className="px-4 py-2 bg-[#172232] hover:bg-[#202C3F] text-[#CBD5E1] rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#D9A45B] hover:bg-[#E5B573] text-black font-bold text-xs rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Install Ad Unit</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Network Filter Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-mono text-[#94A3B8] mr-2">Filter Network:</span>
                {(['all', 'adsterra', 'adcash', 'hilltopads', 'custom'] as const).map((net) => (
                  <button
                    key={net}
                    onClick={() => setSelectedNetworkTab(net)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      selectedNetworkTab === net
                        ? 'bg-[#D9A45B] text-black shadow'
                        : 'bg-[#141C2B] text-slate-300 hover:text-white border border-[#233145]'
                    }`}
                  >
                    {net === 'all' ? 'All Networks' : net}
                  </button>
                ))}
              </div>

              {/* Active Configured Ad Units Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#F6F0E4]">
                    Active Ad Slots ({ads.filter(a => selectedNetworkTab === 'all' || a.network === selectedNetworkTab).length})
                  </h3>
                  <span className="text-[11px] font-mono text-[#63A9A0]">
                    Real-time Dynamic Script Engine Active
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {ads
                    .filter(a => selectedNetworkTab === 'all' || a.network === selectedNetworkTab)
                    .map((ad) => (
                      <div
                        key={ad.id}
                        className="bg-[#121926] border border-[#202C3F] hover:border-[#D9A45B]/50 rounded-2xl p-5 space-y-3 relative shadow-lg"
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-white">{ad.name}</span>
                            <span className="px-2 py-0.5 rounded-md bg-[#1B2638] text-[#D9A45B] text-[10px] font-mono font-bold uppercase border border-[#293B52]">
                              {ad.network || 'Adsterra'}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-300 text-[10px] font-mono border border-blue-800/40">
                              {ad.format || ad.slot}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              updateAdUnit(ad.id, { enabled: !ad.enabled });
                              triggerSaveToast(`Ad "${ad.name}" ${!ad.enabled ? 'activated' : 'disabled'}!`);
                            }}
                            className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${
                              ad.enabled
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            }`}
                          >
                            {ad.enabled ? 'ACTIVE' : 'DISABLED'}
                          </button>
                        </div>

                        {/* Slot target position selector */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div>
                            <span className="text-[#94A3B8] block mb-1">Placement Slot:</span>
                            <select
                              value={ad.slot}
                              onChange={(e) => updateAdUnit(ad.id, { slot: e.target.value as any })}
                              className="w-full px-2 py-1 bg-[#0A0E17] border border-[#253448] rounded-lg text-white"
                            >
                              <option value="top_banner">Top Header Banner</option>
                              <option value="middle_placement">Middle Placement</option>
                              <option value="bottom_placement">Bottom Placement</option>
                              <option value="detail_modal_ad">Movie Download Modal</option>
                              <option value="floating_corner">Global / Background (Popunder)</option>
                            </select>
                          </div>

                          <div>
                            <span className="text-[#94A3B8] block mb-1">Ad Format:</span>
                            <span className="px-2 py-1 bg-[#0A0E17] border border-[#253448] rounded-lg text-slate-300 block truncate">
                              {ad.format || 'Standard Banner / Script'}
                            </span>
                          </div>
                        </div>

                        {/* Script code or Direct Link input */}
                        {ad.type === 'html_code' || ad.htmlScriptCode ? (
                          <div>
                            <label className="block text-[11px] font-mono text-[#94A3B8] mb-1">
                              Script / HTML Code Snippet
                            </label>
                            <textarea
                              rows={3}
                              value={ad.htmlScriptCode || ''}
                              onChange={(e) => updateAdUnit(ad.id, { htmlScriptCode: e.target.value, type: 'html_code' })}
                              placeholder="<script ...></script>"
                              className="w-full px-3 py-2 bg-[#0A0E17] border border-[#223145] rounded-xl text-xs font-mono text-emerald-300 focus:outline-none"
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-[11px] font-mono text-[#94A3B8] mb-1">
                              Direct Smartlink URL
                            </label>
                            <input
                              type="text"
                              value={ad.directLinkUrl || ''}
                              onChange={(e) => updateAdUnit(ad.id, { directLinkUrl: e.target.value })}
                              placeholder="https://..."
                              className="w-full px-3 py-1.5 bg-[#0A0E17] border border-[#223145] rounded-xl text-xs font-mono text-[#F6F0E4]"
                            />
                          </div>
                        )}

                        {/* Bottom Actions */}
                        <div className="pt-2 flex items-center justify-between text-xs border-t border-[#202C3F]">
                          <button
                            onClick={() => triggerSaveToast(`Ad unit "${ad.name}" changes saved!`)}
                            className="px-3 py-1 bg-[#1A2535] hover:bg-[#D9A45B] hover:text-black text-[#D9A45B] font-bold rounded-lg text-[11px] transition-colors"
                          >
                            Save Code
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ad slot "${ad.name}"?`)) {
                                deleteAdUnit(ad.id);
                              }
                            }}
                            className="text-rose-400 hover:text-rose-200 text-[11px]"
                          >
                            Remove Slot
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 1-CLICK GITHUB SYNC */}
          {activeTab === 'github_sync' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F6F0E4]">1-Click GitHub Cloud Synchronization</h2>
                <p className="text-xs text-[#94A3B8]">
                  Commit and push every addition, edit, and deletion directly to your GitHub repository with one single click.
                </p>
              </div>

              {/* Big 1-Click Push Hero Card */}
              <div className="bg-gradient-to-br from-[#1A2332] via-[#141C28] to-[#0E1522] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-xs font-mono mb-4">
                    <Zap className="w-3.5 h-3.5 fill-amber-300" />
                    Instant Full-Repository Push Engine
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F6F0E4] leading-tight mb-2">
                    Push All Catalogue Changes Everywhere in 1-Click
                  </h3>

                  <p className="text-xs sm:text-sm text-[#94A3B8] mb-6 leading-relaxed">
                    Whenever you add a movie, update links, or delete content, click this button to commit your live JSON catalogue into your GitHub repository ({repoInput || 'repo'}). If you have continuous deployment (e.g. Cloudflare Workers, Pages, or Vercel), it instantly goes live worldwide.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handle1ClickGitHubPush}
                      disabled={isSyncingToGitHub}
                      className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-sm rounded-xl shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 disabled:opacity-50"
                    >
                      {isSyncingToGitHub ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Pushing to GitHub...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 fill-black" />
                          <span>⚡ Push to GitHub & Live Save (1-Click)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => oneClickPullFromGitHub()}
                      disabled={isSyncingToGitHub}
                      className="px-4 py-3.5 bg-[#172232] hover:bg-[#202E42] border border-[#2D3E54] text-[#CBD5E1] font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
                      title="Pull latest file from GitHub into current admin"
                    >
                      <RefreshCw className="w-4 h-4 text-[#D9A45B]" />
                      <span>Pull Latest from GitHub</span>
                    </button>
                  </div>

                  {lastSyncCommit && (
                    <div className="mt-5 p-3.5 rounded-xl bg-[#0F1722] border border-emerald-800/50 flex items-center gap-3 text-xs font-mono text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span>Last Successful Commit: </span>
                        <strong className="text-white">{lastSyncCommit.sha}</strong>
                        <span className="text-[#94A3B8] ml-2">({lastSyncCommit.time})</span>
                        {lastSyncCommit.url && (
                          <a
                            href={lastSyncCommit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 text-[#D9A45B] underline"
                          >
                            View on GitHub &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* GitHub Credentials & Target Settings */}
              <div className="bg-[#121926] border border-[#202C3F] rounded-2xl p-6">
                <h3 className="text-base font-bold text-[#F6F0E4] mb-1 flex items-center gap-2">
                  <Github className="w-5 h-5 text-[#D9A45B]" />
                  GitHub Repository & Access Token Credentials
                </h3>
                <p className="text-xs text-[#94A3B8] mb-5">
                  Your token is stored locally in your browser session for security. It is never exposed publicly.
                </p>

                <form onSubmit={handleSaveGitHubConfig} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* PAT Token */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[#CBD5E1] font-semibold">GitHub Personal Access Token (PAT) *</label>
                        <a
                          href="https://github.com/settings/tokens/new?scopes=repo&description=Streamora+Admin+Sync"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#D9A45B] hover:underline flex items-center gap-1"
                        >
                          Generate Token with 'repo' scope &rarr;
                        </a>
                      </div>
                      <div className="relative">
                        <input
                          type={showPatToken ? 'text' : 'password'}
                          value={patInput}
                          onChange={(e) => setPatInput(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-3.5 py-2.5 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-xs font-mono text-[#F6F0E4] pr-10 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPatToken(!showPatToken)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#CBD5E1]"
                        >
                          {showPatToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-[#64748B] mt-1 font-mono">
                        Requires read & write permission to repository contents.
                      </p>
                    </div>

                    {/* Repository Name */}
                    <div>
                      <label className="block text-[#CBD5E1] mb-1 font-semibold">Repository Name (owner/repo) *</label>
                      <input
                        type="text"
                        value={repoInput}
                        onChange={(e) => setRepoInput(e.target.value)}
                        placeholder="cynthiashetler22/movie-lover-eng"
                        className="w-full px-3.5 py-2.5 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-xs font-mono text-[#F6F0E4] focus:outline-none"
                      />
                    </div>

                    {/* Branch */}
                    <div>
                      <label className="block text-[#CBD5E1] mb-1 font-semibold">Git Branch</label>
                      <input
                        type="text"
                        value={branchInput}
                        onChange={(e) => setBranchInput(e.target.value)}
                        placeholder="main"
                        className="w-full px-3.5 py-2.5 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-xs font-mono text-[#F6F0E4] focus:outline-none"
                      />
                    </div>

                    {/* Target File Path */}
                    <div className="sm:col-span-2">
                      <label className="block text-[#CBD5E1] mb-1 font-semibold">Destination File Path in Repo</label>
                      <input
                        type="text"
                        value={filePathInput}
                        onChange={(e) => setFilePathInput(e.target.value)}
                        placeholder="public/movies-catalog.json"
                        className="w-full px-3.5 py-2.5 bg-[#0A0E17] border border-[#253448] focus:border-[#D9A45B] rounded-xl text-xs font-mono text-[#F6F0E4] focus:outline-none"
                      />
                      <p className="text-[10px] text-[#64748B] mt-1 font-mono">
                        Default: public/movies-catalog.json (accessible directly by your site build or workers)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#202C3F]">
                    <span className="text-[11px] text-[#94A3B8]">Changes saved automatically.</span>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#D9A45B] hover:bg-[#E5B573] text-black font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              </div>

              {/* Local File Backup & Restore (Offline Protection) */}
              <div className="bg-[#121926] border border-[#202C3F] rounded-2xl p-6">
                <h3 className="text-base font-bold text-[#F6F0E4] mb-1 flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-[#63A9A0]" />
                  Local JSON File Export & Import (100% Data Safety)
                </h3>
                <p className="text-xs text-[#94A3B8] mb-4">
                  Download an instant JSON backup to your computer anytime or restore a previous catalogue file.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={downloadBackupJSON}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#172232] hover:bg-[#202E42] border border-[#2B3C50] text-[#CBD5E1] rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#D9A45B]" />
                    <span>Download movies-catalogue.json Backup</span>
                  </button>

                  <label className="flex items-center gap-2 px-4 py-2.5 bg-[#172232] hover:bg-[#202E42] border border-[#2B3C50] text-[#CBD5E1] rounded-xl text-xs font-semibold cursor-pointer">
                    <Upload className="w-4 h-4 text-[#63A9A0]" />
                    <span>Import JSON File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WEBSITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F6F0E4]">Global Website Configuration</h2>
                <p className="text-xs text-[#94A3B8]">
                  Brand name, meta tags, and header/footer custom scripts for ad networks.
                </p>
              </div>

              <div className="bg-[#121926] border border-[#202C3F] rounded-2xl p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#CBD5E1] mb-1 font-semibold">Site Brand Title</label>
                    <input
                      type="text"
                      value={settings.siteTitle}
                      onChange={(e) => updateSettings({ siteTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#0A0E17] border border-[#253448] rounded-xl text-xs text-[#F6F0E4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#CBD5E1] mb-1 font-semibold">Brand Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => updateSettings({ tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#0A0E17] border border-[#253448] rounded-xl text-xs text-[#F6F0E4]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#CBD5E1] mb-1 font-semibold">SEO Meta Description</label>
                    <textarea
                      rows={2}
                      value={settings.seoDescription}
                      onChange={(e) => updateSettings({ seoDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#0A0E17] border border-[#253448] rounded-xl text-xs text-[#F6F0E4]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#CBD5E1] mb-1 font-semibold">
                      Custom Header Code / Verification Scripts (Adsterra / Analytics)
                    </label>
                    <textarea
                      rows={3}
                      value={settings.customHeaderScript}
                      onChange={(e) => updateSettings({ customHeaderScript: e.target.value })}
                      placeholder="<!-- Paste your Adsterra or third party script tag here -->"
                      className="w-full px-3.5 py-2.5 bg-[#0A0E17] border border-[#253448] rounded-xl text-xs font-mono text-[#F6F0E4]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#202C3F] flex justify-end">
                  <button
                    onClick={() => triggerSaveToast('Website settings saved!')}
                    className="px-4 py-2 bg-[#D9A45B] hover:bg-[#E5B573] text-black font-bold text-xs rounded-xl"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
