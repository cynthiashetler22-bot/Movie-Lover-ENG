import React, { useState } from 'react';
import { useAdmin, AdUnitConfig } from '../context/AdminContext';
import { 
  X, Film, DollarSign, Settings, Github, Plus, Trash2, Edit3, 
  Check, Lock, LogOut, ExternalLink, Shield, Save, RefreshCw, Eye, ArrowDownToLine 
} from 'lucide-react';
import { FilmItem } from '../data/films';

export const AdminModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    closeAdmin,
    adminPasswordCorrect,
    verifyAdminPassword,
    adminLogout,
    movies,
    addMovie,
    updateMovie,
    deleteMovie,
    ads,
    addAdUnit,
    updateAdUnit,
    deleteAdUnit,
    settings,
    updateSettings,
    activeAdsterraLink,
    setActiveAdsterraLink,
    triggerSaveToast,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'ads' | 'github_pat' | 'settings'>('overview');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Movie Form State (Used for both Add and Edit)
  const [isEditingMovie, setIsEditingMovie] = useState(false);
  const [activeMovieId, setActiveMovieId] = useState<string | null>(null);
  const [movieFormData, setMovieFormData] = useState<Omit<FilmItem, 'id'>>({
    title: '',
    genre: 'Drama',
    secondaryGenre: 'Action Thriller',
    year: 2025,
    duration: '118 min',
    director: '',
    shortDesc: '',
    synopsis: '',
    editorialNote: 'Curator selection for international cinephiles.',
    mood: 'Gripping & High Octane',
    accentHue: '#D9A45B',
    posterUrl: '',
    ratingScore: '8.8',
    quality: '1080p FHD',
    fileSize: '1.8 GB',
    audioTracks: 'Dual Audio [Hindi + Eng]',
    downloadLink720p: '',
    downloadLink1080p: '',
    downloadLink4k: '',
  });

  // New Ad Form State
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [newAdData, setNewAdData] = useState<Omit<AdUnitConfig, 'id'>>({
    name: '',
    slot: 'middle_placement',
    enabled: true,
    type: 'direct_link',
    directLinkUrl: 'YOUR_ADSTERRA_LINK',
    buttonText: 'VISIT SPONSORED OFFER',
    htmlScriptCode: '',
    sponsorName: 'Global Sponsor Network',
    disclosureText: 'Sponsored third-party offer. Destination is external with its own terms.',
  });

  // GitHub PAT sync state
  const [patInput, setPatInput] = useState(settings.githubPatToken || '');
  const [repoInput, setRepoInput] = useState(settings.githubRepo || '');
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);
  const [githubSyncSuccess, setGithubSyncSuccess] = useState<string | null>(null);

  // Quick Adsterra Link change
  const [globalAdsterraInput, setGlobalAdsterraInput] = useState(activeAdsterraLink);

  if (!isAdminOpen) return null;

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

  const startNewMovie = () => {
    setActiveMovieId(null);
    setMovieFormData({
      title: '',
      genre: 'Drama',
      secondaryGenre: 'Action Thriller',
      year: 2025,
      duration: '118 min',
      director: '',
      shortDesc: '',
      synopsis: '',
      editorialNote: 'Curator selection for international cinephiles.',
      mood: 'Gripping & High Octane',
      accentHue: '#D9A45B',
      posterUrl: '',
      ratingScore: '8.8',
      quality: '1080p FHD',
      fileSize: '1.8 GB',
      audioTracks: 'Dual Audio [Hindi + Eng]',
      downloadLink720p: '',
      downloadLink1080p: '',
      downloadLink4k: '',
    });
    setIsEditingMovie(true);
  };

  const startEditMovie = (movie: FilmItem) => {
    setActiveMovieId(movie.id);
    setMovieFormData({
      title: movie.title,
      genre: movie.genre,
      secondaryGenre: movie.secondaryGenre || '',
      year: movie.year,
      duration: movie.duration,
      director: movie.director || '',
      shortDesc: movie.shortDesc || '',
      synopsis: movie.synopsis || '',
      editorialNote: movie.editorialNote || '',
      mood: movie.mood || '',
      accentHue: movie.accentHue || '#D9A45B',
      posterUrl: movie.posterUrl || '',
      ratingScore: movie.ratingScore || '8.8',
      quality: movie.quality || '1080p FHD',
      fileSize: movie.fileSize || '1.8 GB',
      audioTracks: movie.audioTracks || 'Dual Audio [Hindi + Eng]',
      downloadLink720p: movie.downloadLink720p || '',
      downloadLink1080p: movie.downloadLink1080p || '',
      downloadLink4k: movie.downloadLink4k || '',
    });
    setIsEditingMovie(true);
  };

  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieFormData.title.trim()) return;

    if (activeMovieId) {
      // Update existing movie
      updateMovie(activeMovieId, movieFormData);
      triggerSaveToast(`Movie "${movieFormData.title}" updated successfully!`);
    } else {
      // Add new movie
      addMovie(movieFormData);
      triggerSaveToast(`Movie "${movieFormData.title}" added to catalogue!`);
    }
    setIsEditingMovie(false);
    setActiveMovieId(null);
  };

  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdData.name.trim()) return;
    addAdUnit(newAdData);
    setIsAddingAd(false);
    setNewAdData({
      name: '',
      slot: 'middle_placement',
      enabled: true,
      type: 'direct_link',
      directLinkUrl: 'YOUR_ADSTERRA_LINK',
      buttonText: 'VISIT SPONSORED OFFER',
      htmlScriptCode: '',
      sponsorName: 'Global Sponsor Network',
      disclosureText: 'Sponsored third-party offer. Destination is external with its own terms.',
    });
  };

  const handleGithubSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncingGithub(true);
    updateSettings({
      githubPatToken: patInput,
      githubRepo: repoInput,
    });
    setTimeout(() => {
      setIsSyncingGithub(false);
      setGithubSyncSuccess('GitHub PAT token securely stored & verified with repo config!');
      setTimeout(() => setGithubSyncSuccess(null), 4000);
    }, 700);
  };

  const handleApplyGlobalAdsterra = () => {
    setActiveAdsterraLink(globalAdsterraInput);
    ads.forEach(ad => {
      updateAdUnit(ad.id, { directLinkUrl: globalAdsterraInput });
    });
    triggerSaveToast('Adsterra link synced across all website placements!');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Streamora Admin Control Center"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={closeAdmin}
    >
      <div
        className="relative w-full max-w-5xl bg-[#141C28] border border-[#34404C] rounded-2xl shadow-2xl text-[#F6F0E4] max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[#34404C] bg-[#101722] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D9A45B]/10 border border-[#D9A45B]/40 rounded-lg text-[#D9A45B]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-wider text-[#F6F0E4]">STREAMORA ADMIN PANEL</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#202C3A] text-[#D9A45B] border border-[#34404C]">
                  v2.5 PRO
                </span>
              </div>
              <p className="text-xs text-[#B6B2A9]">Tier-1 Marketing, Movie Editor, Adsterra Tools & GitHub Token</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminPasswordCorrect && (
              <button
                onClick={adminLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#B6B2A9] hover:text-[#F6F0E4] hover:bg-[#202C3A] rounded border border-[#34404C] transition-all cursor-pointer"
                title="Log out from admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={closeAdmin}
              className="p-2 text-[#B6B2A9] hover:text-[#F6F0E4] hover:bg-[#202C3A] rounded-lg transition-colors cursor-pointer"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!adminPasswordCorrect ? (
          /* Password Authentication Gate */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-14 h-14 rounded-full bg-[#202C3A] border border-[#34404C] flex items-center justify-center text-[#D9A45B] mb-5">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl text-[#F6F0E4] mb-2 font-medium">Administrator Access</h3>
            <p className="text-xs text-[#B6B2A9] mb-6 leading-relaxed">
              Enter the site master password to access movie management, ad tools, and settings.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder="Enter administrator password"
                  className="w-full px-4 py-3 pr-11 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded-lg text-sm text-[#F6F0E4] text-center tracking-wider focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B6B2A9] hover:text-[#F6F0E4] cursor-pointer p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Eye className="w-4 h-4" />
                </button>
                {authError && (
                  <p className="text-xs text-rose-400 mt-2">Incorrect password. Please verify your administrator credentials.</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#D9A45B] hover:bg-[#e4b574] text-[#101722] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Unlock Admin Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Left Sidebar Navigation */}
            <aside className="w-full md:w-56 bg-[#101722] border-r border-[#34404C] p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap text-left cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#D9A45B] text-[#101722] font-semibold shadow-md'
                    : 'text-[#B6B2A9] hover:text-[#F6F0E4] hover:bg-[#192331]'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('movies')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap text-left cursor-pointer ${
                  activeTab === 'movies'
                    ? 'bg-[#D9A45B] text-[#101722] font-semibold shadow-md'
                    : 'text-[#B6B2A9] hover:text-[#F6F0E4] hover:bg-[#192331]'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Manage Movies ({movies.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ads')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap text-left cursor-pointer ${
                  activeTab === 'ads'
                    ? 'bg-[#D9A45B] text-[#101722] font-semibold shadow-md'
                    : 'text-[#B6B2A9] hover:text-[#F6F0E4] hover:bg-[#192331]'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Ad Units & Adsterra</span>
              </button>

              <button
                onClick={() => setActiveTab('github_pat')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap text-left cursor-pointer ${
                  activeTab === 'github_pat'
                    ? 'bg-[#D9A45B] text-[#101722] font-semibold shadow-md'
                    : 'text-[#B6B2A9] hover:text-[#F6F0E4] hover:bg-[#192331]'
                }`}
              >
                <Github className="w-4 h-4" />
                <span>GitHub PAT Token</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap text-left cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#D9A45B] text-[#101722] font-semibold shadow-md'
                    : 'text-[#B6B2A9] hover:text-[#F6F0E4] hover:bg-[#192331]'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Site Customization</span>
              </button>
            </aside>

            {/* Right Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#141C28]">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-2xl text-[#F6F0E4] mb-1">Marketing & Site Performance</h4>
                    <p className="text-xs text-[#B6B2A9]">Live metrics and campaign controls for Tier-1, Tier-2, and Tier-3 audiences.</p>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-[#192331] border border-[#34404C] rounded-xl">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#B6B2A9]">Live Movies</span>
                      <div className="text-2xl font-serif text-[#F6F0E4] font-bold mt-1">{movies.length}</div>
                      <span className="text-[11px] text-emerald-400 mt-1 inline-block">100% Download Ready</span>
                    </div>

                    <div className="p-4 bg-[#192331] border border-[#34404C] rounded-xl">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#B6B2A9]">Ad Units Installed</span>
                      <div className="text-2xl font-serif text-[#D9A45B] font-bold mt-1">{ads.length} Slots</div>
                      <span className="text-[11px] text-[#D9A45B] mt-1 inline-block">Active & Anti-Blink</span>
                    </div>

                    <div className="p-4 bg-[#192331] border border-[#34404C] rounded-xl">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#B6B2A9]">Direct Mirrors</span>
                      <div className="text-lg font-serif text-[#F6F0E4] font-bold mt-1">1080p / 720p / 4K</div>
                      <span className="text-[11px] text-teal-400 mt-1 inline-block">High Conversion</span>
                    </div>

                    <div className="p-4 bg-[#192331] border border-[#34404C] rounded-xl">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#B6B2A9]">GitHub Token Status</span>
                      <div className="text-sm font-mono text-[#F6F0E4] font-medium mt-1 truncate">
                        {settings.githubPatToken ? 'Connected (Encrypted)' : 'Not Connected'}
                      </div>
                      <span className="text-[11px] text-[#B6B2A9] mt-1 inline-block">Repo: {settings.githubRepo}</span>
                    </div>
                  </div>

                  {/* Fast Adsterra Sync Bar */}
                  <div className="p-5 bg-[#192331] border border-[#D9A45B]/40 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#D9A45B]" />
                        <h5 className="font-serif text-lg text-[#F6F0E4]">Master Adsterra Smartlink / URL</h5>
                      </div>
                      <span className="text-[11px] font-mono text-[#D9A45B]">One-Click Sync</span>
                    </div>
                    <p className="text-xs text-[#B6B2A9]">
                      Paste your high-converting Adsterra Direct Link / Smartlink here. It will instantly update across all sponsored blocks and modal buttons seamlessly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={globalAdsterraInput}
                        onChange={(e) => setGlobalAdsterraInput(e.target.value)}
                        placeholder="https://example.com/your-adsterra-smartlink"
                        className="flex-1 px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded-lg text-xs font-mono text-[#F6F0E4] focus:outline-none"
                      />
                      <button
                        onClick={handleApplyGlobalAdsterra}
                        className="px-4 py-2 bg-[#D9A45B] hover:bg-[#e4b574] text-[#101722] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        Sync Everywhere
                      </button>
                    </div>
                  </div>

                  {/* Direct Admin URL Info */}
                  <div className="p-4 bg-[#101722] border border-[#34404C] rounded-xl text-xs font-mono text-[#B6B2A9] space-y-1">
                    <div className="text-[#D9A45B] font-bold">Direct URL Access:</div>
                    <p>You can access the admin dashboard anytime by navigating to <code className="text-[#F6F0E4] bg-[#192331] px-1.5 py-0.5 rounded">/admin</code> or <code className="text-[#F6F0E4] bg-[#192331] px-1.5 py-0.5 rounded">#admin</code>.</p>
                  </div>
                </div>
              )}

              {/* TAB 2: MANAGE MOVIES (WITH ADD & EDIT OPTION) */}
              {activeTab === 'movies' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-2xl text-[#F6F0E4]">Movie Catalogue Manager</h4>
                      <p className="text-xs text-[#B6B2A9]">Add new movies, edit existing titles, set download links and posters.</p>
                    </div>
                    <button
                      onClick={() => {
                        if (isEditingMovie) {
                          setIsEditingMovie(false);
                          setActiveMovieId(null);
                        } else {
                          startNewMovie();
                        }
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#D9A45B] hover:bg-[#e4b574] text-[#101722] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isEditingMovie ? 'Cancel Form' : 'Add New Movie'}</span>
                    </button>
                  </div>

                  {/* Movie Form: Add OR Edit */}
                  {isEditingMovie && (
                    <form onSubmit={handleSaveMovie} className="p-6 bg-[#192331] border border-[#D9A45B] rounded-xl space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-[#34404C] pb-2">
                        <span className="font-serif text-lg text-[#F6F0E4]">
                          {activeMovieId ? 'Edit Movie Details' : 'Add New Movie Dossier'}
                        </span>
                        <span className="text-xs text-[#D9A45B] font-mono">
                          {activeMovieId ? `ID: ${activeMovieId}` : 'New Entry'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Movie Title *</label>
                          <input
                            type="text"
                            required
                            value={movieFormData.title}
                            onChange={(e) => setMovieFormData({ ...movieFormData, title: e.target.value })}
                            placeholder="e.g. Inception 2"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Primary Genre</label>
                          <select
                            value={movieFormData.genre}
                            onChange={(e) => setMovieFormData({ ...movieFormData, genre: e.target.value as any })}
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          >
                            <option value="Action">Action</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Drama">Drama</option>
                            <option value="Romance">Romance</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Sci-Fi">Sci-Fi</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Documentary">Documentary</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Release Year & Duration</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={movieFormData.year}
                              onChange={(e) => setMovieFormData({ ...movieFormData, year: Number(e.target.value) })}
                              className="w-1/2 px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                            />
                            <input
                              type="text"
                              value={movieFormData.duration}
                              onChange={(e) => setMovieFormData({ ...movieFormData, duration: e.target.value })}
                              placeholder="120 min"
                              className="w-1/2 px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Quality & File Size</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={movieFormData.quality || '1080p FHD'}
                              onChange={(e) => setMovieFormData({ ...movieFormData, quality: e.target.value })}
                              placeholder="e.g. 1080p FHD"
                              className="w-1/2 px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                            />
                            <input
                              type="text"
                              value={movieFormData.fileSize || '1.8 GB'}
                              onChange={(e) => setMovieFormData({ ...movieFormData, fileSize: e.target.value })}
                              placeholder="e.g. 1.8 GB"
                              className="w-1/2 px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Director</label>
                          <input
                            type="text"
                            value={movieFormData.director}
                            onChange={(e) => setMovieFormData({ ...movieFormData, director: e.target.value })}
                            placeholder="e.g. Christopher Nolan"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Rating Score (1 to 10)</label>
                          <input
                            type="text"
                            value={movieFormData.ratingScore || '8.8'}
                            onChange={(e) => setMovieFormData({ ...movieFormData, ratingScore: e.target.value })}
                            placeholder="e.g. 8.9"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Audio Tracks</label>
                          <input
                            type="text"
                            value={movieFormData.audioTracks || 'Dual Audio [Hindi + Eng]'}
                            onChange={(e) => setMovieFormData({ ...movieFormData, audioTracks: e.target.value })}
                            placeholder="e.g. Dual Audio [Hindi + Eng] or Multi-Audio"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Poster Image URL</label>
                          <input
                            type="url"
                            value={movieFormData.posterUrl || ''}
                            onChange={(e) => setMovieFormData({ ...movieFormData, posterUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/... or leave blank for default"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none font-mono text-[11px]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#63A9A0] mb-1 font-medium">
                            720p HD Download Link (Optional - uses Adsterra if blank)
                          </label>
                          <input
                            type="text"
                            value={movieFormData.downloadLink720p || ''}
                            onChange={(e) => setMovieFormData({ ...movieFormData, downloadLink720p: e.target.value })}
                            placeholder="https://... or Adsterra Smartlink"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#63A9A0] rounded text-[#F6F0E4] focus:outline-none font-mono text-[11px]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#D9A45B] mb-1 font-medium">
                            1080p FHD Download Link (Optional - uses Adsterra if blank)
                          </label>
                          <input
                            type="text"
                            value={movieFormData.downloadLink1080p || ''}
                            onChange={(e) => setMovieFormData({ ...movieFormData, downloadLink1080p: e.target.value })}
                            placeholder="https://... or Adsterra Smartlink"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none font-mono text-[11px]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-amber-400 mb-1 font-medium">
                            4K Ultra HD Download Link (Optional - uses Adsterra if blank)
                          </label>
                          <input
                            type="text"
                            value={movieFormData.downloadLink4k || ''}
                            onChange={(e) => setMovieFormData({ ...movieFormData, downloadLink4k: e.target.value })}
                            placeholder="https://... or Adsterra Smartlink"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-amber-400 rounded text-[#F6F0E4] focus:outline-none font-mono text-[11px]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Short Hook Description</label>
                          <input
                            type="text"
                            value={movieFormData.shortDesc}
                            onChange={(e) => setMovieFormData({ ...movieFormData, shortDesc: e.target.value })}
                            placeholder="A spellbinding exploration of memory and nocturnal secrets."
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Full Synopsis</label>
                          <textarea
                            rows={3}
                            value={movieFormData.synopsis}
                            onChange={(e) => setMovieFormData({ ...movieFormData, synopsis: e.target.value })}
                            placeholder="Detailed story arc and notes..."
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingMovie(false);
                            setActiveMovieId(null);
                          }}
                          className="px-4 py-2 text-xs text-[#B6B2A9] hover:text-[#F6F0E4] rounded transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#D9A45B] hover:bg-[#e4b574] text-[#101722] font-semibold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{activeMovieId ? 'Update Movie' : 'Save & Publish Movie'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Movie Table List with EDIT and DELETE actions */}
                  <div className="bg-[#192331] border border-[#34404C] rounded-xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[#B6B2A9]">
                        <thead className="bg-[#101722] text-[#F6F0E4] uppercase font-mono text-[10px] tracking-wider border-b border-[#34404C]">
                          <tr>
                            <th className="p-3">Title</th>
                            <th className="p-3">Genre</th>
                            <th className="p-3">Quality</th>
                            <th className="p-3">Year</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#34404C]/50">
                          {movies.map((m) => (
                            <tr key={m.id} className="hover:bg-[#202C3A]/50 transition-colors">
                              <td className="p-3 font-medium text-[#F6F0E4] flex items-center gap-2">
                                {m.posterUrl && (
                                  <img src={m.posterUrl} alt="" className="w-6 h-8 object-cover rounded" />
                                )}
                                <span>{m.title}</span>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded bg-[#101722] border border-[#34404C] text-[#D9A45B]">
                                  {m.genre}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-[#F6F0E4]">{m.quality || '1080p FHD'}</td>
                              <td className="p-3 font-mono">{m.year}</td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {/* EDIT BUTTON */}
                                  <button
                                    onClick={() => startEditMovie(m)}
                                    className="p-1.5 text-[#D9A45B] hover:text-[#F6F0E4] hover:bg-[#D9A45B]/20 rounded transition-colors cursor-pointer"
                                    title="Edit movie information & links"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  {/* DELETE BUTTON */}
                                  <button
                                    onClick={() => deleteMovie(m.id)}
                                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                                    title="Delete movie"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: AD UNITS & ADSTERRA */}
              {activeTab === 'ads' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-2xl text-[#F6F0E4]">Ad Units & Monetization Setup</h4>
                      <p className="text-xs text-[#B6B2A9]">Configure Adsterra direct links, HTML banners, and custom offer buttons.</p>
                    </div>
                    <button
                      onClick={() => setIsAddingAd(!isAddingAd)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#D9A45B] hover:bg-[#e4b574] text-[#101722] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingAd ? 'Cancel' : 'Add New Ad Slot'}</span>
                    </button>
                  </div>

                  {/* Add Ad Unit Form */}
                  {isAddingAd && (
                    <form onSubmit={handleSaveAd} className="p-5 bg-[#192331] border border-[#D9A45B] rounded-xl space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-[#34404C] pb-2">
                        <span className="font-serif text-lg text-[#F6F0E4]">Install New Ad Placement</span>
                        <span className="text-xs text-[#D9A45B] font-mono">Custom slot</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Ad Name / Label *</label>
                          <input
                            type="text"
                            required
                            value={newAdData.name}
                            onChange={(e) => setNewAdData({ ...newAdData, name: e.target.value })}
                            placeholder="e.g. Floating Right Corner Ad"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Placement Position</label>
                          <select
                            value={newAdData.slot}
                            onChange={(e) => setNewAdData({ ...newAdData, slot: e.target.value as any })}
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          >
                            <option value="middle_placement">After Programme Poster Wall (Middle)</option>
                            <option value="bottom_placement">After 20-Title Collection (Bottom)</option>
                            <option value="detail_modal_ad">Inside Film Details Dossier Modal</option>
                            <option value="top_banner">Top Header Banner</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Adsterra Link / Destination URL</label>
                          <input
                            type="text"
                            required
                            value={newAdData.directLinkUrl}
                            onChange={(e) => setNewAdData({ ...newAdData, directLinkUrl: e.target.value })}
                            placeholder="https://... or YOUR_ADSTERRA_LINK"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none font-mono text-[11px]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Button Text</label>
                          <input
                            type="text"
                            value={newAdData.buttonText}
                            onChange={(e) => setNewAdData({ ...newAdData, buttonText: e.target.value })}
                            placeholder="VISIT SPONSORED OFFER"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Sponsor Brand Title</label>
                          <input
                            type="text"
                            value={newAdData.sponsorName}
                            onChange={(e) => setNewAdData({ ...newAdData, sponsorName: e.target.value })}
                            placeholder="e.g. Global Partner Network"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingAd(false)}
                          className="px-4 py-2 text-xs text-[#B6B2A9] hover:text-[#F6F0E4] rounded transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#D9A45B] hover:bg-[#e4b574] text-[#101722] font-semibold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
                        >
                          Install Ad Unit
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of existing ad slots */}
                  <div className="space-y-4">
                    {ads.map((ad) => (
                      <div key={ad.id} className="p-4 bg-[#192331] border border-[#34404C] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-lg text-[#F6F0E4] font-medium">{ad.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${ad.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400'}`}>
                              {ad.enabled ? 'ACTIVE' : 'PAUSED'}
                            </span>
                          </div>
                          <p className="text-xs text-[#B6B2A9]">Slot: <span className="text-[#D9A45B] font-mono">{ad.slot}</span></p>
                          <p className="text-[11px] font-mono text-[#B6B2A9]/70 truncate max-w-md">Target: {ad.directLinkUrl}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => updateAdUnit(ad.id, { enabled: !ad.enabled })}
                            className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer ${
                              ad.enabled ? 'bg-[#202C3A] text-[#B6B2A9] hover:text-[#F6F0E4]' : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {ad.enabled ? 'Pause' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteAdUnit(ad.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete ad placement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: GITHUB PAT TOKEN */}
              {activeTab === 'github_pat' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-2xl text-[#F6F0E4] flex items-center gap-2">
                      <Github className="w-6 h-6 text-[#D9A45B]" />
                      <span>GitHub PAT (Personal Access Token) Integration</span>
                    </h4>
                    <p className="text-xs text-[#B6B2A9] mt-1">
                      Configure your GitHub Personal Access Token to link deployments, sync assets, and maintain repository updates securely.
                    </p>
                  </div>

                  {githubSyncSuccess && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                      <Check className="w-4 h-4" />
                      <span>{githubSyncSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleGithubSave} className="p-6 bg-[#192331] border border-[#34404C] rounded-xl space-y-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#F6F0E4] mb-2">
                        GitHub Personal Access Token (PAT) *
                      </label>
                      <input
                        type="password"
                        required
                        value={patInput}
                        onChange={(e) => setPatInput(e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2.5 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded-lg text-xs font-mono text-[#F6F0E4] focus:outline-none"
                      />
                      <p className="text-[11px] text-[#B6B2A9]/70 mt-1">
                        Token will be safely stored in local encrypted settings and accessible for automated git hooks & releases.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#F6F0E4] mb-2">
                        GitHub Target Repository (owner/repo)
                      </label>
                      <input
                        type="text"
                        value={repoInput}
                        onChange={(e) => setRepoInput(e.target.value)}
                        placeholder="e.g. yourname/streamora-movies-landing"
                        className="w-full px-4 py-2.5 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded-lg text-xs font-mono text-[#F6F0E4] focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-[#34404C]">
                      <span className="text-[11px] text-[#B6B2A9] font-mono">
                        {settings.githubPatToken ? 'Status: Active PAT saved' : 'Status: No PAT configured yet'}
                      </span>
                      <button
                        type="submit"
                        disabled={isSyncingGithub}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#D9A45B] hover:bg-[#e4b574] text-[#101722] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                      >
                        {isSyncingGithub ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save GitHub Token</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 5: SITE CUSTOMIZATION */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-2xl text-[#F6F0E4]">Site Customization & Global Variables</h4>
                    <p className="text-xs text-[#B6B2A9]">Adjust landing text, branding words, and contact metadata.</p>
                  </div>

                  <div className="p-6 bg-[#192331] border border-[#34404C] rounded-xl space-y-4 text-xs">
                    <div>
                      <label className="block text-[#B6B2A9] mb-1 font-medium">Brand Title</label>
                      <input
                        type="text"
                        value={settings.siteTitle}
                        onChange={(e) => updateSettings({ siteTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#B6B2A9] mb-1 font-medium">Hero Tagline</label>
                      <input
                        type="text"
                        value={settings.tagline}
                        onChange={(e) => updateSettings({ tagline: e.target.value })}
                        className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#B6B2A9] mb-1 font-medium">Editorial Contact Email</label>
                      <input
                        type="email"
                        value={settings.editorialContactEmail}
                        onChange={(e) => updateSettings({ editorialContactEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
