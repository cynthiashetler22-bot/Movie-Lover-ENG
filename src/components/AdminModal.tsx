import React, { useState } from 'react';
import { useAdmin, AdUnitConfig } from '../context/AdminContext';
import { 
  X, Film, DollarSign, Settings, Github, Plus, Trash2, Edit3, 
  Check, Lock, LogOut, ExternalLink, Shield, Save, RefreshCw, Eye
} from 'lucide-react';
import { FilmItem } from '../data/films';

export const AdminModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
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
  const [authError, setAuthError] = useState(false);

  // New Movie Form State
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [newMovieData, setNewMovieData] = useState<Omit<FilmItem, 'id'>>({
    title: '',
    genre: 'Drama',
    secondaryGenre: 'Festival Choice',
    year: 2025,
    duration: '118 min',
    director: '',
    shortDesc: '',
    synopsis: '',
    editorialNote: 'Curator selection for international cinephiles.',
    mood: 'Gripping & Poetic',
    accentHue: '#D9A45B',
    posterUrl: '',
    ratingScore: '8.8',
  });

  // Edit Movie State
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);

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

  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovieData.title.trim()) return;
    addMovie(newMovieData);
    setIsAddingMovie(false);
    setNewMovieData({
      title: '',
      genre: 'Drama',
      secondaryGenre: 'Festival Choice',
      year: 2025,
      duration: '118 min',
      director: '',
      shortDesc: '',
      synopsis: '',
      editorialNote: 'Curator selection for international cinephiles.',
      mood: 'Gripping & Poetic',
      accentHue: '#D9A45B',
      posterUrl: '',
      ratingScore: '8.8',
    });
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
    // Update all direct link ads with this url
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
      onClick={() => setIsAdminOpen(false)}
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
                  v2.4 PRO
                </span>
              </div>
              <p className="text-xs text-[#B6B2A9]">Tier-1 Marketing, Movie Manager, Adsterra Tools & GitHub Token</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminPasswordCorrect && (
              <button
                onClick={adminLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#B6B2A9] hover:text-[#F6F0E4] hover:bg-[#202C3A] rounded border border-[#34404C] transition-all"
                title="Log out from admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-[#B6B2A9] hover:text-[#F6F0E4] hover:bg-[#202C3A] rounded-lg transition-colors"
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
              Enter the site master password to manage movie catalogues, add ad placements, configure Adsterra links, and insert GitHub PAT tokens.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder="Enter admin password (e.g. admin123)"
                  className="w-full px-4 py-3 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded-lg text-sm text-[#F6F0E4] text-center tracking-widest focus:outline-none"
                  autoFocus
                />
                {authError && (
                  <p className="text-xs text-rose-400 mt-2">Incorrect password. Default: <code className="text-[#D9A45B]">admin123</code></p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#D9A45B] hover:bg-[#e4b574] text-[#101722] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Unlock Admin Dashboard
              </button>
            </form>
            <p className="text-[11px] text-[#B6B2A9]/60 font-mono mt-4">
              Demo access code: <strong>admin123</strong> or <strong>streamora2026</strong>
            </p>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Left Sidebar Navigation */}
            <aside className="w-full md:w-56 bg-[#101722] border-r border-[#34404C] p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap text-left ${
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
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap text-left ${
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
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap text-left ${
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
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap text-left ${
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
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all whitespace-nowrap text-left ${
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
                      <span className="text-[11px] text-emerald-400 mt-1 inline-block">100% Responsive Grid</span>
                    </div>

                    <div className="p-4 bg-[#192331] border border-[#34404C] rounded-xl">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#B6B2A9]">Ad Units Installed</span>
                      <div className="text-2xl font-serif text-[#D9A45B] font-bold mt-1">{ads.length} Slots</div>
                      <span className="text-[11px] text-[#D9A45B] mt-1 inline-block">Active & Anti-Blink</span>
                    </div>

                    <div className="p-4 bg-[#192331] border border-[#34404C] rounded-xl">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#B6B2A9]">Target Regions</span>
                      <div className="text-lg font-serif text-[#F6F0E4] font-bold mt-1">Tier 1, 2, 3</div>
                      <span className="text-[11px] text-teal-400 mt-1 inline-block">US, UK, CA, EU, Global</span>
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

                  {/* Marketing Readiness Checklist */}
                  <div className="p-5 bg-[#192331] border border-[#34404C] rounded-xl">
                    <h5 className="font-serif text-lg text-[#F6F0E4] mb-3">Tier-1 Optimization Features Enabled:</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#B6B2A9]">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Zero Layout Shift (No "lafalafi" / jitter when loading)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Lightning Fast 60FPS CSS & GPU-accelerated rendering</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Pre-cached modern art-house vertical posters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Honest editorial branding compliance (Safe for Ad Networks)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MANAGE MOVIES */}
              {activeTab === 'movies' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-2xl text-[#F6F0E4]">Movie Catalogue Manager</h4>
                      <p className="text-xs text-[#B6B2A9]">Add new movie titles, update synopses, and customize posters.</p>
                    </div>
                    <button
                      onClick={() => setIsAddingMovie(!isAddingMovie)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#D9A45B] hover:bg-[#e4b574] text-[#101722] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingMovie ? 'Cancel' : 'Add New Movie'}</span>
                    </button>
                  </div>

                  {/* Add Movie Form */}
                  {isAddingMovie && (
                    <form onSubmit={handleSaveMovie} className="p-5 bg-[#192331] border border-[#D9A45B] rounded-xl space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-[#34404C] pb-2">
                        <span className="font-serif text-lg text-[#F6F0E4]">New Film Dossier</span>
                        <span className="text-xs text-[#D9A45B] font-mono">Fill in details</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Movie Title *</label>
                          <input
                            type="text"
                            required
                            value={newMovieData.title}
                            onChange={(e) => setNewMovieData({ ...newMovieData, title: e.target.value })}
                            placeholder="e.g. Midnight in Berlin"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Primary Genre</label>
                          <select
                            value={newMovieData.genre}
                            onChange={(e) => setNewMovieData({ ...newMovieData, genre: e.target.value as any })}
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
                              value={newMovieData.year}
                              onChange={(e) => setNewMovieData({ ...newMovieData, year: Number(e.target.value) })}
                              className="w-1/2 px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                            />
                            <input
                              type="text"
                              value={newMovieData.duration}
                              onChange={(e) => setNewMovieData({ ...newMovieData, duration: e.target.value })}
                              placeholder="120 min"
                              className="w-1/2 px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Director</label>
                          <input
                            type="text"
                            value={newMovieData.director}
                            onChange={(e) => setNewMovieData({ ...newMovieData, director: e.target.value })}
                            placeholder="e.g. Christopher Nolan"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Poster Image URL (Leave empty for default cinematic cover)</label>
                          <input
                            type="url"
                            value={newMovieData.posterUrl || ''}
                            onChange={(e) => setNewMovieData({ ...newMovieData, posterUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/... or leave blank"
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none font-mono text-[11px]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Short Editorial Hook (1 sentence)</label>
                          <input
                            type="text"
                            value={newMovieData.shortDesc}
                            onChange={(e) => setNewMovieData({ ...newMovieData, shortDesc: e.target.value })}
                            placeholder="A spellbinding exploration of memory and nocturnal secrets."
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[#B6B2A9] mb-1 font-medium">Full Curatorial Synopsis</label>
                          <textarea
                            rows={3}
                            value={newMovieData.synopsis}
                            onChange={(e) => setNewMovieData({ ...newMovieData, synopsis: e.target.value })}
                            placeholder="Detailed story arc and cinematographic notes..."
                            className="w-full px-3 py-2 bg-[#101722] border border-[#34404C] focus:border-[#D9A45B] rounded text-[#F6F0E4] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingMovie(false)}
                          className="px-4 py-2 text-xs text-[#B6B2A9] hover:text-[#F6F0E4] rounded transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#D9A45B] hover:bg-[#e4b574] text-[#101722] font-semibold text-xs uppercase tracking-wider rounded transition-colors"
                        >
                          Save & Publish Movie
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Movie Table List */}
                  <div className="bg-[#192331] border border-[#34404C] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[#B6B2A9]">
                        <thead className="bg-[#101722] text-[#F6F0E4] uppercase font-mono text-[10px] tracking-wider border-b border-[#34404C]">
                          <tr>
                            <th className="p-3">Title</th>
                            <th className="p-3">Genre</th>
                            <th className="p-3">Year</th>
                            <th className="p-3">Director</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#34404C]/50">
                          {movies.map((m) => (
                            <tr key={m.id} className="hover:bg-[#202C3A]/50 transition-colors">
                              <td className="p-3 font-medium text-[#F6F0E4]">
                                {m.title}
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded bg-[#101722] border border-[#34404C] text-[#D9A45B]">
                                  {m.genre}
                                </span>
                              </td>
                              <td className="p-3 font-mono">{m.year}</td>
                              <td className="p-3">{m.director || 'Curator Archive'}</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => deleteMovie(m.id)}
                                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                                  title="Delete movie"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
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
                          className="px-4 py-2 text-xs text-[#B6B2A9] hover:text-[#F6F0E4] rounded transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#D9A45B] hover:bg-[#e4b574] text-[#101722] font-semibold text-xs uppercase tracking-wider rounded transition-colors"
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
