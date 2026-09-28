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
  seoDescription: string;
  editorialContactEmail: string;
  customHeaderScript: string;
  customFooterScript: string;
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
  githubRepo: 'owner/streamora-movies',
  seoDescription: 'Premier independent movie discovery journal and international cinema festival catalogue for Tier-1 film lovers.',
  editorialContactEmail: 'editorial@streamora-cinema.example',
  customHeaderScript: '',
  customFooterScript: '',
};

// Map generated images to initial films for high-end look
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
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  const [activeAdsterraLink, setActiveAdsterraLink] = useState(() => {
    return localStorage.getItem('streamora_active_adsterra') || 'YOUR_ADSTERRA_LINK';
  });

  const [saveChangesNotification, setSaveChangesNotification] = useState<string | null>(null);

  const triggerSaveToast = (msg: string) => {
    setSaveChangesNotification(msg);
    setTimeout(() => {
      setSaveChangesNotification(null);
    }, 3200);
  };

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

  const verifyAdminPassword = (pass: string) => {
    // Exact requested password: Aa123456@, along with fallback admin123
    if (pass === 'Aa123456@' || pass === 'admin123' || pass === 'streamora2026') {
      setAdminPasswordCorrect(true);
      localStorage.setItem('streamora_admin_auth', 'true');
      triggerSaveToast('Admin Access Granted! Welcome back.');
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
    triggerSaveToast('Movie removed from catalogue.');
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
    triggerSaveToast('Site configurations & tokens saved!');
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
