import React, { createContext, useContext, useState, useEffect } from 'react';
import { FilmItem, THE_20_TITLES } from '../data/films';

// Imported generated realistic posters
import posterCyber from '../assets/images/poster_cyber_odyssey_1790612776339.jpg';
import posterRoyal from '../assets/images/poster_royal_heart_1790612795993.jpg';
import posterShadow from '../assets/images/poster_shadow_veil_1790612811676.jpg';
import posterAlpine from '../assets/images/poster_alpine_echo_1790612825975.jpg';
import posterTokyo from '../assets/images/poster_neon_tokyo_1790612839510.jpg';
import posterAutumn from '../assets/images/poster_silent_echo_1790612867427.jpg';

export interface AdUnitConfig {
  id: string;
  name: string;
  slot: 'top_banner' | 'middle_placement' | 'bottom_placement' | 'detail_modal_ad' | 'floating_corner';
  enabled: boolean;
  type: 'direct_link' | 'html_code';
  directLinkUrl: string;
  buttonText: string;
  htmlScriptCode: string;
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
  oneClickPushToGitHub: (customPat?: string, customRepo?: string) => Promise<boolean>;
  oneClickPullFromGitHub: () => Promise<boolean>;
  downloadBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => boolean;
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
  brandDescriptor: 'Cinema Journal & Film Discovery',
  githubPatToken: '',
  githubRepo: 'cynthiashetler22/movie-lover-eng',
  githubBranch: 'main',
  githubFilePath: 'public/movies-catalog.json',
  seoDescription: 'Premier independent movie discovery journal and international cinema festival catalogue for Tier-1 film lovers.',
  editorialContactEmail: 'editorial@streamora-cinema.example',
  customHeaderScript: '',
  customFooterScript: '',
};

// Map initial films with high-fidelity attributes
const ENRICHED_INITIAL_FILMS: FilmItem[] = THE_20_TITLES.map((film, index) => {
  const posterArray = [posterCyber, posterRoyal, posterShadow, posterAlpine, posterTokyo, posterAutumn];
  const poster = posterArray[index % posterArray.length];
  const audioList = [
    'Dual Audio [Hindi + English]',
    'Multi Audio [Eng + Hindi + Bengali]',
    'English [Original Dolby 5.1]',
    'Dual Audio [Eng + Spanish]'
  ];
  return {
    ...film,
    posterUrl: poster,
    ratingScore: (8.4 + (index % 15) * 0.1).toFixed(1),
    editorialPick: index < 6,
    quality: index % 3 === 0 ? '4K Ultra HD' : '1080p FHD',
    fileSize: `${(1.2 + (index % 5) * 0.4).toFixed(1)} GB`,
    audioTracks: audioList[index % audioList.length],
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

  // Persistent movies in localStorage
  const [movies, setMovies] = useState<FilmItem[]>(() => {
    try {
      const saved = localStorage.getItem('streamora_movies_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ENRICHED_INITIAL_FILMS;
  });

  // Persistent ads in localStorage
  const [ads, setAds] = useState<AdUnitConfig[]>(() => {
    try {
      const saved = localStorage.getItem('streamora_ads_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ADS;
  });

  // Persistent settings in localStorage
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

  // GitHub Sync States
  const [isSyncingToGitHub, setIsSyncingToGitHub] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);
  const [lastSyncCommit, setLastSyncCommit] = useState<SyncCommitInfo | null>(() => {
    try {
      const saved = localStorage.getItem('streamora_last_commit');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const triggerSaveToast = (msg: string) => {
    setSaveChangesNotification(msg);
    setTimeout(() => {
      setSaveChangesNotification(null);
    }, 3800);
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
    if (pass === 'Aa123456@' || pass === 'admin123' || pass === 'streamora2026') {
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

  const addMovie = (movieData: Omit<FilmItem, 'id'>) => {
    const newFilm: FilmItem = {
      ...movieData,
      id: `custom-film-${Date.now()}`,
    };
    setMovies(prev => [newFilm, ...prev]);
    triggerSaveToast(`Movie "${newFilm.title}" added to catalogue!`);
  };

  const updateMovie = (id: string, movieData: Partial<FilmItem>) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, ...movieData } : m));
    triggerSaveToast('Movie catalogue updated successfully!');
  };

  const deleteMovie = (id: string) => {
    setMovies(prev => prev.filter(m => m.id !== id));
    triggerSaveToast('Movie deleted from catalogue.');
  };

  const bulkApplyAdsterraLink = (link: string) => {
    if (!link) return;
    setMovies(prev =>
      prev.map(m => ({
        ...m,
        downloadLink720p: m.downloadLink720p || link,
        downloadLink1080p: m.downloadLink1080p || link,
        downloadLink4k: m.downloadLink4k || link,
      }))
    );
    triggerSaveToast('Applied Adsterra link to all movie download buttons!');
  };

  const addAdUnit = (adData: Omit<AdUnitConfig, 'id'>) => {
    const newAd: AdUnitConfig = {
      ...adData,
      id: `ad-unit-${Date.now()}`,
    };
    setAds(prev => [...prev, newAd]);
    triggerSaveToast(`New ad slot "${newAd.name}" installed!`);
  };

  const updateAdUnit = (id: string, adData: Partial<AdUnitConfig>) => {
    setAds(prev => prev.map(a => a.id === id ? { ...a, ...adData } : a));
    triggerSaveToast('Ad placement settings synchronized!');
  };

  const deleteAdUnit = (id: string) => {
    setAds(prev => prev.filter(a => a.id !== id));
    triggerSaveToast('Ad placement removed.');
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    triggerSaveToast('Settings saved!');
  };

  // 1-Click Push to GitHub
  const oneClickPushToGitHub = async (customPat?: string, customRepo?: string): Promise<boolean> => {
    const pat = (customPat || settings.githubPatToken || '').trim();
    const repo = (customRepo || settings.githubRepo || '').trim();
    const branch = (settings.githubBranch || 'main').trim();
    const filePath = (settings.githubFilePath || 'public/movies-catalog.json').trim();

    if (!pat) {
      setSyncErrorMessage('Missing GitHub PAT token. Please enter your Personal Access Token with repo scope.');
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
      // 1. Get current SHA if file already exists in repo
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
      } else if (checkRes.status === 404) {
        // File doesn't exist yet on branch, which is fine; will be created
      }

      // 2. Prepare catalogue payload
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
        ads,
        movies,
      };

      const jsonString = JSON.stringify(catalogData, null, 2);
      // UTF-8 base64 encoding safe for unicode
      const base64Content = btoa(unescape(encodeURIComponent(jsonString)));

      // 3. Put / Commit the file
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
      setSyncStatusMessage(null);
      triggerSaveToast(`⚡ 100% Synced to GitHub! Commit: ${commitSha}. All changes are live!`);
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
      triggerSaveToast('Failed to download backup.');
    }
  };

  // Import local catalogue from JSON
  const importBackupJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.movies || !Array.isArray(parsed.movies)) {
        throw new Error('Invalid JSON format: missing "movies" array.');
      }
      setMovies(parsed.movies);
      if (parsed.ads && Array.isArray(parsed.ads)) {
        setAds(parsed.ads);
      }
      triggerSaveToast(`Successfully imported ${parsed.movies.length} movies!`);
      return true;
    } catch (err: unknown) {
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
        oneClickPushToGitHub,
        oneClickPullFromGitHub,
        downloadBackupJSON,
        importBackupJSON,
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
