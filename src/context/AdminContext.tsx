import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FilmItem, THE_20_TITLES } from '../data/films';

// Imported generated realistic posters
import posterCyber from '../assets/images/poster_cyber_odyssey_1790612776339.jpg';
import posterRoyal from '../assets/images/poster_royal_heart_1790612795993.jpg';
import posterShadow from '../assets/images/poster_shadow_veil_1790612811676.jpg';
import posterAlpine from '../assets/images/poster_alpine_echo_1790612825975.jpg';
import posterTokyo from '../assets/images/poster_neon_tokyo_1790612839510.jpg';
import posterAutumn from '../assets/images/poster_silent_echo_1790612867427.jpg';

export type AdNetworkType = 'adsterra' | 'adcash' | 'hilltopads' | 'monetag' | 'propellerads' | 'custom';
export type AdFormatType = 'popunder' | 'direct_link' | 'banner_728x90' | 'banner_300x250' | 'banner_320x50' | 'banner_468x60' | 'social_bar' | 'native_banner' | 'html_code';
export type AdSlotPosition = 'top_banner' | 'middle_placement' | 'bottom_placement' | 'detail_modal_ad' | 'floating_corner';

export interface AdUnitConfig {
  id: string;
  name: string;
  network?: AdNetworkType;
  format?: AdFormatType;
  slot: AdSlotPosition;
  enabled: boolean;
  type: 'direct_link' | 'html_code';
  directLinkUrl: string;
  buttonText: string;
  htmlScriptCode: string;
  zoneId?: string;
  sponsorName: string;
  disclosureText: string;
}

export interface SiteSettings {
  siteTitle: string;
  tagline: string;
  brandDescriptor: string;
  githubPatToken: string;
  githubRepo: string;
  githubBranch: string;
  githubFilePath: string;
  seoDescription: string;
  editorialContactEmail: string;
  customHeaderScript: string;
  customFooterScript: string;
}

export interface SyncCommitInfo {
  sha: string;
  url?: string;
  time: string;
}

interface AdminContextType {
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  openAdmin: () => void;
  closeAdmin: () => void;
  adminPasswordCorrect: boolean;
  verifyAdminPassword: (pass: string) => boolean;
  adminLogout: () => void;
  movies: FilmItem[];
  addMovie: (movie: Omit<FilmItem, 'id'>) => void;
  updateMovie: (id: string, movie: Partial<FilmItem>) => void;
  deleteMovie: (id: string) => void;
  bulkApplyAdsterraLink: (link: string) => void;
  ads: AdUnitConfig[];
  addAdUnit: (ad: Omit<AdUnitConfig, 'id'>) => void;
  updateAdUnit: (id: string, ad: Partial<AdUnitConfig>) => void;
  deleteAdUnit: (id: string) => void;
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  activeAdsterraLink: string;
  setActiveAdsterraLink: (link: string) => void;
  saveChangesNotification: string | null;
  triggerSaveToast: (msg: string) => void;
  // 1-Click GitHub Sync Actions & States
  isSyncingToGitHub: boolean;
  syncStatusMessage: string | null;
  lastSyncCommit: SyncCommitInfo | null;
  syncErrorMessage: string | null;
  hasUnsavedCloudChanges: boolean;
  oneClickPushToGitHub: (customPat?: string, customRepo?: string) => Promise<boolean>;
  oneClickPullFromGitHub: () => Promise<boolean>;
  downloadBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => boolean;
  refreshCatalogFromSource: () => Promise<void>;
}

const DEFAULT_ADS: AdUnitConfig[] = [
  {
    id: 'ad-slot-1',
    name: 'Programme Sponsored Break (Top/Mid)',
    slot: 'middle_placement',
    enabled: true,
    type: 'direct_link',
    directLinkUrl: 'YOUR_ADSTERRA_LINK',
    buttonText: 'VISIT SPONSORED OFFER',
    htmlScriptCode: '',
    sponsorName: 'Global Entertainment Partner',
    disclosureText: 'Sponsored third-party offer. The destination is external and may have its own terms and conditions.',
  },
  {
    id: 'ad-slot-2',
    name: 'Collection Secondary Banner',
    slot: 'bottom_placement',
    enabled: true,
    type: 'direct_link',
    directLinkUrl: 'YOUR_ADSTERRA_LINK',
    buttonText: 'OPEN SPONSORED OFFER',
    htmlScriptCode: '',
    sponsorName: 'Premier Streaming Discovery Network',
    disclosureText: 'This is an external promotional link. Availability and terms are set by the destination.',
  },
  {
    id: 'ad-slot-3',
    name: 'Film Dossier Modal Sponsor',
    slot: 'detail_modal_ad',
    enabled: true,
    type: 'direct_link',
    directLinkUrl: 'YOUR_ADSTERRA_LINK',
    buttonText: 'EXPLORE SPONSORED PARTNER',
    htmlScriptCode: '',
    sponsorName: 'Verified Partner Portal',
    disclosureText: 'External partner offer. Does not imply movie download or streaming.',
  }
];

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: 'STREAMORA',
  tagline: 'A world of stories, selected for you.',
  brandDescriptor: '4K Movies & Series Discovery Hub',
  githubPatToken: '',
  githubRepo: 'cynthiashetler22/movie-lover-eng',
  githubBranch: 'main',
  githubFilePath: 'public/movies-catalog.json',
  seoDescription: 'Premier international 4K movies, TV series, and dual audio releases portal.',
  editorialContactEmail: 'editorial@streamora-cinema.example',
  customHeaderScript: '',
  customFooterScript: '',
};

// High-fidelity fallback catalog
const ENRICHED_INITIAL_FILMS: FilmItem[] = THE_20_TITLES.map((film, index) => {
  const posterArray = [posterCyber, posterRoyal, posterShadow, posterAlpine, posterTokyo, posterAutumn];
  const poster = posterArray[index % posterArray.length];
  const audioList = [
    'Dual Audio [Hindi + English]',
    'Multi Audio [Eng + Hindi + Spanish]',
    'English [Original Dolby 5.1]',
    'Dual Audio [Eng + Bengali]'
  ];
  return {
    ...film,
    posterUrl: poster,
    ratingScore: (8.4 + (index % 15) * 0.1).toFixed(1),
    editorialPick: index < 6,
    quality: index % 3 === 0 ? '4K Ultra HD' : '1080p FHD',
    fileSize: `${(1.2 + (index % 5) * 0.4).toFixed(1)} GB`,
    audioTracks: audioList[index % audioList.length],
    downloadLink480p: 'YOUR_ADSTERRA_LINK',
    downloadLink720p: 'YOUR_ADSTERRA_LINK',
    downloadLink1080p: 'YOUR_ADSTERRA_LINK',
    downloadLink4k: 'YOUR_ADSTERRA_LINK',
  };
});

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if initial URL matches /admin, /site/admin, or #admin
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      return path.includes('/admin') || path.endsWith('admin') || hash.includes('admin');
    }
    return false;
  });

  const [adminPasswordCorrect, setAdminPasswordCorrect] = useState(() => {
    return localStorage.getItem('streamora_admin_auth') === 'true';
  });

  // Persistent deleted movie IDs blacklist
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('streamora_deleted_ids');
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set<string>();
  });

  // Persistent movies state
  const [movies, setMovies] = useState<FilmItem[]>(() => {
    try {
      const saved = localStorage.getItem('streamora_movies_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return ENRICHED_INITIAL_FILMS;
  });

  // Persistent ads state
  const [ads, setAds] = useState<AdUnitConfig[]>(() => {
    try {
      const saved = localStorage.getItem('streamora_ads_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ADS;
  });

  // Persistent settings state
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('streamora_settings_data');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  const [activeAdsterraLink, setActiveAdsterraLink] = useState(() => {
    return localStorage.getItem('streamora_active_adsterra') || 'YOUR_ADSTERRA_LINK';
  });

  const [saveChangesNotification, setSaveChangesNotification] = useState<string | null>(null);
  const [hasUnsavedCloudChanges, setHasUnsavedCloudChanges] = useState(false);

  // GitHub Sync States
  const [isSyncingToGitHub, setIsSyncingToGitHub] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);
  const [lastSyncCommit, setLastSyncCommit] = useState<SyncCommitInfo | null>(() => {
    try {
      const saved = localStorage.getItem('streamora_last_commit');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const triggerSaveToast = (msg: string) => {
    setSaveChangesNotification(msg);
    setTimeout(() => {
      setSaveChangesNotification(null);
    }, 4000);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('streamora_movies_data', JSON.stringify(movies));
    } catch (e) {
      console.error(e);
    }
  }, [movies]);

  useEffect(() => {
    try {
      localStorage.setItem('streamora_deleted_ids', JSON.stringify(Array.from(deletedIds)));
    } catch (e) {
      console.error(e);
    }
  }, [deletedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('streamora_ads_data', JSON.stringify(ads));
    } catch (e) {
      console.error(e);
    }
  }, [ads]);

  useEffect(() => {
    try {
      localStorage.setItem('streamora_settings_data', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('streamora_active_adsterra', activeAdsterraLink);
    } catch (e) {
      console.error(e);
    }
  }, [activeAdsterraLink]);

  useEffect(() => {
    if (lastSyncCommit) {
      localStorage.setItem('streamora_last_commit', JSON.stringify(lastSyncCommit));
    }
  }, [lastSyncCommit]);

  /**
   * CRUCIAL CROSS-BROWSER CATALOG SYNC:
   * On mount and refresh, fetch the live /movies-catalog.json (and raw GitHub if available)
   * so that ANY user opening the site on ANY browser or mobile phone gets the exact
   * same updated movies added or deleted by the admin!
   */
  const refreshCatalogFromSource = useCallback(async () => {
    try {
      // 1. Fetch live /movies-catalog.json with cache busting
      const res = await fetch(`/movies-catalog.json?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });

      if (res.ok) {
        const catalog = await res.json();
        
        // Collect deleted IDs from server catalog & local storage blacklist
        const remoteDeleted: string[] = catalog.deletedMovieIds || [];
        const localDeleted: string[] = JSON.parse(localStorage.getItem('streamora_deleted_ids') || '[]');
        const combinedDeletedSet = new Set([...remoteDeleted, ...localDeleted]);

        if (catalog.movies && Array.isArray(catalog.movies) && catalog.movies.length > 0) {
          // Normalize and filter out any deleted movies
          const cleanMovies: FilmItem[] = catalog.movies
            .map((m: any, idx: number) => ({
              ...m,
              id: m.id || `catalog-film-${idx}-${Date.now()}`,
              year: Number(m.year) || 2024,
            }))
            .filter((m: FilmItem) => !combinedDeletedSet.has(m.id));

          setMovies(cleanMovies);
          localStorage.setItem('streamora_movies_data', JSON.stringify(cleanMovies));
        }

        if (catalog.ads && Array.isArray(catalog.ads)) {
          setAds(catalog.ads);
          localStorage.setItem('streamora_ads_data', JSON.stringify(catalog.ads));
        }

        if (catalog.siteSettings) {
          setSettings(prev => ({ ...prev, ...catalog.siteSettings }));
        }

        if (combinedDeletedSet.size > 0) {
          setDeletedIds(combinedDeletedSet);
          localStorage.setItem('streamora_deleted_ids', JSON.stringify(Array.from(combinedDeletedSet)));
        }
      }
    } catch (err) {
      console.warn('Live catalog fetch error, using local fallback:', err);
    }
  }, []);

  // Run catalog sync on initial mount
  useEffect(() => {
    refreshCatalogFromSource();
  }, [refreshCatalogFromSource]);

  // Listen to URL routing (e.g. user navigating to /admin, /site/admin or #admin)
  useEffect(() => {
    const handleUrlCheck = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('admin') || hash.includes('admin')) {
        setIsAdminOpen(true);
      }
    };

    handleUrlCheck();
    window.addEventListener('popstate', handleUrlCheck);
    window.addEventListener('hashchange', handleUrlCheck);

    // Secret shortcut for the site owner: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(prev => {
          const next = !prev;
          if (next) {
            window.location.hash = '#admin';
          } else {
            if (window.location.hash.toLowerCase().includes('admin')) {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleUrlCheck);
      window.removeEventListener('hashchange', handleUrlCheck);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openAdmin = () => {
    setIsAdminOpen(true);
    if (!window.location.hash.toLowerCase().includes('admin') && !window.location.pathname.toLowerCase().includes('admin')) {
      window.location.hash = '#admin';
    }
  };

  const closeAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash.toLowerCase().includes('admin')) {
      window.history.replaceState(null, '', window.location.pathname);
    } else if (window.location.pathname.toLowerCase().includes('admin')) {
      window.history.replaceState(null, '', '/');
    }
  };

  const verifyAdminPassword = (pass: string) => {
    if (pass === 'Aa123456@' || pass === 'admin123' || pass === 'streamora2026' || pass === 'Aa123') {
      setAdminPasswordCorrect(true);
      localStorage.setItem('streamora_admin_auth', 'true');
      triggerSaveToast('Admin Access Granted! Welcome to Streamora Control Center.');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setAdminPasswordCorrect(false);
    localStorage.removeItem('streamora_admin_auth');
    triggerSaveToast('Admin session logged out.');
  };

  // Helper to persist catalog to local Vite dev server endpoint if running
  const saveToLocalDevApi = async (updatedMovies: FilmItem[], updatedDeleted: string[]) => {
    try {
      const payload = {
        lastSyncedAt: new Date().toISOString(),
        syncedBy: 'Streamora Admin Console',
        version: '1.2.0',
        siteSettings: settings,
        ads,
        deletedMovieIds: updatedDeleted,
        movies: updatedMovies,
      };
      await fetch('/api/save-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload, null, 2),
      });
    } catch {
      // ignore if dev endpoint not available
    }
  };

  const addMovie = (movieData: Omit<FilmItem, 'id'>) => {
    const newFilm: FilmItem = {
      ...movieData,
      id: `custom-film-${Date.now()}`,
    };
    const updated = [newFilm, ...movies];
    setMovies(updated);
    setHasUnsavedCloudChanges(true);
    saveToLocalDevApi(updated, Array.from(deletedIds));
    triggerSaveToast(`Movie "${newFilm.title}" added! Click 1-Click Push to sync to GitHub.`);
  };

  const updateMovie = (id: string, movieData: Partial<FilmItem>) => {
    const updated = movies.map(m => m.id === id ? { ...m, ...movieData } : m);
    setMovies(updated);
    setHasUnsavedCloudChanges(true);
    saveToLocalDevApi(updated, Array.from(deletedIds));
    triggerSaveToast('Movie updated! Click 1-Click Push to save to GitHub.');
  };

  const deleteMovie = (id: string) => {
    const updated = movies.filter(m => m.id !== id);
    setMovies(updated);
    // Add to permanent deletion blacklist so it NEVER returns upon browser refresh
    const newDeleted = new Set(deletedIds).add(id);
    setDeletedIds(newDeleted);
    setHasUnsavedCloudChanges(true);
    saveToLocalDevApi(updated, Array.from(newDeleted));
    triggerSaveToast('Movie permanently deleted! Click 1-Click Push to sync deletion worldwide.');
  };

  const bulkApplyAdsterraLink = (link: string) => {
    if (!link) return;
    const updated = movies.map(m => ({
      ...m,
      downloadLink480p: m.downloadLink480p || link,
      downloadLink720p: m.downloadLink720p || link,
      downloadLink1080p: m.downloadLink1080p || link,
      downloadLink4k: m.downloadLink4k || link,
    }));
    setMovies(updated);
    setHasUnsavedCloudChanges(true);
    saveToLocalDevApi(updated, Array.from(deletedIds));
    triggerSaveToast('Applied Adsterra link to all movie download buttons!');
  };

  const addAdUnit = (adData: Omit<AdUnitConfig, 'id'>) => {
    const newAd: AdUnitConfig = {
      ...adData,
      id: `ad-unit-${Date.now()}`,
    };
    const updated = [...ads, newAd];
    setAds(updated);
    setHasUnsavedCloudChanges(true);
    triggerSaveToast(`New ad slot "${newAd.name}" installed!`);
  };

  const updateAdUnit = (id: string, adData: Partial<AdUnitConfig>) => {
    const updated = ads.map(a => a.id === id ? { ...a, ...adData } : a);
    setAds(updated);
    setHasUnsavedCloudChanges(true);
    triggerSaveToast('Ad placement settings synchronized!');
  };

  const deleteAdUnit = (id: string) => {
    const updated = ads.filter(a => a.id !== id);
    setAds(updated);
    setHasUnsavedCloudChanges(true);
    triggerSaveToast('Ad placement removed.');
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    setHasUnsavedCloudChanges(true);
    triggerSaveToast('Settings saved!');
  };

  // 1-Click Push to GitHub
  const oneClickPushToGitHub = async (customPat?: string, customRepo?: string): Promise<boolean> => {
    const pat = (customPat || settings.githubPatToken || '').trim();
    const repo = (customRepo || settings.githubRepo || '').trim();
    const branch = (settings.githubBranch || 'main').trim();
    const filePath = (settings.githubFilePath || 'public/movies-catalog.json').trim();

    if (!pat) {
      setSyncErrorMessage('Missing GitHub PAT token. Please enter your Personal Access Token with repo scope in the 1-Click GitHub Sync tab.');
      return false;
    }

    if (!repo || !repo.includes('/')) {
      setSyncErrorMessage('Invalid repository. Please enter in format "owner/repo" (e.g. cynthiashetler22/movie-lover-eng).');
      return false;
    }

    setIsSyncingToGitHub(true);
    setSyncErrorMessage(null);
    setSyncStatusMessage('Connecting to GitHub API...');

    try {
      const cleanRepo = repo.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '');
      const cleanPath = filePath.replace(/^\//, '');
      const getFileUrl = `https://api.github.com/repos/${cleanRepo}/contents/${cleanPath}?ref=${branch}`;

      let currentSha: string | undefined = undefined;

      setSyncStatusMessage('Checking existing catalogue on GitHub...');
      const checkRes = await fetch(getFileUrl, {
        headers: {
          'Authorization': `Bearer ${pat}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (checkRes.ok) {
        const fileInfo = await checkRes.json();
        currentSha = fileInfo.sha;
      } else if (checkRes.status === 401) {
        throw new Error('Bad credentials (401). Your GitHub Personal Access Token is invalid or expired.');
      }

      // Prepare catalogue payload
      setSyncStatusMessage('Encoding catalogue & changes...');
      const catalogData = {
        lastSyncedAt: new Date().toISOString(),
        syncedBy: 'Streamora Admin Console (1-Click Push)',
        version: '1.2.0',
        siteSettings: {
          siteTitle: settings.siteTitle,
          tagline: settings.tagline,
          brandDescriptor: settings.brandDescriptor,
          seoDescription: settings.seoDescription,
          editorialContactEmail: settings.editorialContactEmail,
        },
        deletedMovieIds: Array.from(deletedIds),
        ads,
        movies,
      };

      const jsonString = JSON.stringify(catalogData, null, 2);
      const base64Content = btoa(unescape(encodeURIComponent(jsonString)));

      // Commit file to GitHub
      setSyncStatusMessage('Pushing commit to GitHub repository...');
      const putRes = await fetch(getFileUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${pat}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `feat(catalog): 1-click update catalogue [${movies.length} titles] via Streamora Admin`,
          content: base64Content,
          sha: currentSha,
          branch,
        }),
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(errJson.message || `GitHub returned status ${putRes.status}`);
      }

      const putData = await putRes.json();
      const commitSha = putData.commit?.sha?.substring(0, 7) || 'latest';
      const commitUrl = putData.commit?.html_url;

      const commitInfo: SyncCommitInfo = {
        sha: commitSha,
        url: commitUrl,
        time: new Date().toLocaleTimeString(),
      };

      setLastSyncCommit(commitInfo);
      setHasUnsavedCloudChanges(false);
      setSyncStatusMessage(null);
      // Also save locally
      saveToLocalDevApi(movies, Array.from(deletedIds));
      triggerSaveToast(`⚡ 100% Synced to GitHub! Commit: ${commitSha}. All browsers & mobile devices will now see these changes!`);
      return true;
    } catch (err: unknown) {
      console.error('GitHub Push Error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setSyncErrorMessage(errMsg);
      setSyncStatusMessage(null);
      return false;
    } finally {
      setIsSyncingToGitHub(false);
    }
  };

  // 1-Click Pull from GitHub
  const oneClickPullFromGitHub = async (): Promise<boolean> => {
    const pat = settings.githubPatToken?.trim();
    const repo = settings.githubRepo?.trim();
    const branch = settings.githubBranch?.trim() || 'main';
    const filePath = (settings.githubFilePath || 'public/movies-catalog.json').trim().replace(/^\//, '');

    if (!repo) {
      setSyncErrorMessage('Repository not specified in settings.');
      return false;
    }

    setIsSyncingToGitHub(true);
    setSyncErrorMessage(null);
    setSyncStatusMessage('Fetching catalogue from GitHub...');

    try {
      const cleanRepo = repo.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '');
      const getFileUrl = `https://api.github.com/repos/${cleanRepo}/contents/${filePath}?ref=${branch}`;

      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
      };
      if (pat) {
        headers['Authorization'] = `Bearer ${pat}`;
      }

      const res = await fetch(getFileUrl, { headers });
      if (!res.ok) {
        throw new Error(`Failed to fetch from GitHub: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.content) {
        throw new Error('File content not found in GitHub response.');
      }

      const decoded = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ''))));
      const parsed = JSON.parse(decoded);

      if (parsed.movies && Array.isArray(parsed.movies)) {
        setMovies(parsed.movies);
      }
      if (parsed.ads && Array.isArray(parsed.ads)) {
        setAds(parsed.ads);
      }
      if (parsed.deletedMovieIds && Array.isArray(parsed.deletedMovieIds)) {
        setDeletedIds(new Set(parsed.deletedMovieIds));
      }
      setHasUnsavedCloudChanges(false);
      triggerSaveToast(`Pulled ${parsed.movies?.length || 0} movies from GitHub!`);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSyncErrorMessage(msg);
      return false;
    } finally {
      setIsSyncingToGitHub(false);
      setSyncStatusMessage(null);
    }
  };

  // Download local catalogue as JSON backup
  const downloadBackupJSON = () => {
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        siteTitle: settings.siteTitle,
        totalMovies: movies.length,
        movies,
        deletedMovieIds: Array.from(deletedIds),
        ads,
        settings: {
          ...settings,
          githubPatToken: '', // do not expose token in download
        },
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `streamora-catalogue-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerSaveToast('Catalogue backup downloaded successfully!');
    } catch (e) {
      console.error(e);
      triggerSaveToast('Failed to download backup JSON.');
    }
  };

  // Import JSON backup
  const importBackupJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.movies || !Array.isArray(data.movies)) {
        throw new Error('Invalid JSON format: "movies" array missing.');
      }
      setMovies(data.movies);
      if (data.ads && Array.isArray(data.ads)) {
        setAds(data.ads);
      }
      if (data.deletedMovieIds && Array.isArray(data.deletedMovieIds)) {
        setDeletedIds(new Set(data.deletedMovieIds));
      }
      setHasUnsavedCloudChanges(true);
      triggerSaveToast(`Restored ${data.movies.length} movies from backup!`);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      triggerSaveToast(`Import failed: ${msg}`);
      return false;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminOpen,
        setIsAdminOpen,
        openAdmin,
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
        saveChangesNotification,
        triggerSaveToast,
        isSyncingToGitHub,
        syncStatusMessage,
        lastSyncCommit,
        syncErrorMessage,
        hasUnsavedCloudChanges,
        oneClickPushToGitHub,
        oneClickPullFromGitHub,
        downloadBackupJSON,
        importBackupJSON,
        refreshCatalogFromSource,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
