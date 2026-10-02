import React, { useState, useEffect } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Header } from './components/Header';
import { MovieSlider } from './components/MovieSlider';
import { MoviePortalGrid } from './components/MoviePortalGrid';
import { AdBannerSlot } from './components/AdBannerSlot';
import { GlobalAdScriptInjector } from './components/GlobalAdScriptInjector';
import { Footer } from './components/Footer';
import { MovieDetailPage } from './components/MovieDetailPage';
import { MovieDownloadPage } from './components/MovieDownloadPage';
import { FloatingCenterAd } from './components/FloatingCenterAd';
import { PolicyModal } from './components/PolicyModal';
import { AdminPortalSite } from './components/AdminPortalSite';
import { FilmItem } from './data/films';
import { CheckCircle2 } from 'lucide-react';
import { triggerPopunder, setupGlobalScreenClickPopunder } from './utils/popunder';

function AppRouter() {
  const { isAdminOpen, saveChangesNotification } = useAdmin();

  // If in Admin Mode (/admin, #admin, or toggled), render the dedicated Standalone Admin Site!
  if (isAdminOpen) {
    return (
      <div className="min-h-screen bg-[#0A0E17]">
        {saveChangesNotification && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#192331] border border-[#D9A45B] text-[#F6F0E4] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-[#D9A45B]" />
            <span className="text-xs font-medium font-sans">{saveChangesNotification}</span>
          </div>
        )}
        <AdminPortalSite />
      </div>
    );
  }

  // Otherwise, render the public visitor movie discovery site
  return <MainAppContent />;
}

function MainAppContent() {
  const { movies, saveChangesNotification } = useAdmin();

  // Modal & Selection States
  const [selectedFilm, setSelectedFilm] = useState<FilmItem | null>(null);
  const [downloadTarget, setDownloadTarget] = useState<{
    film: FilmItem;
    quality: '480p' | '720p' | '1080p' | '4k';
  } | null>(null);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  // Genre Filter & Search State
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * CRITICAL URL HASH ROUTING:
   * Syncs with #download/${movieId}/${quality} and #movie/${movieId}
   * This guarantees that when a user is viewing a download page or movie and hits Browser Refresh (F5),
   * they STAY ON THAT PAGE!
   */
  useEffect(() => {
    const handleHashCheck = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;

      if (hash.startsWith('#download/')) {
        const parts = hash.replace('#download/', '').split('/');
        const movieId = parts[0];
        const qual = (parts[1] || '1080p') as '480p' | '720p' | '1080p' | '4k';
        const targetFilm = movies.find((m) => m.id === movieId);
        if (targetFilm) {
          setDownloadTarget({ film: targetFilm, quality: qual });
          setSelectedFilm(targetFilm);
        } else {
          setDownloadTarget(null);
          setSelectedFilm(null);
        }
      } else if (hash.startsWith('#movie/')) {
        setDownloadTarget(null);
        const movieId = hash.replace('#movie/', '');
        const targetFilm = movies.find((m) => m.id === movieId);
        if (targetFilm) {
          setSelectedFilm(targetFilm);
        } else {
          setSelectedFilm(null);
        }
      } else {
        setDownloadTarget(null);
        setSelectedFilm(null);
      }
    };

    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    window.addEventListener('popstate', handleHashCheck);

    return () => {
      window.removeEventListener('hashchange', handleHashCheck);
      window.removeEventListener('popstate', handleHashCheck);
    };
  }, [movies]);

  // Global screen click popunder setup
  useEffect(() => {
    setupGlobalScreenClickPopunder();
  }, []);

  const handleSelectFilm = (film: FilmItem) => {
    triggerPopunder();
    setDownloadTarget(null);
    setSelectedFilm(film);
    window.location.hash = `#movie/${film.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToDownload = (quality: '480p' | '720p' | '1080p' | '4k') => {
    if (selectedFilm) {
      setDownloadTarget({ film: selectedFilm, quality });
      window.location.hash = `#download/${selectedFilm.id}/${quality}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToMovie = () => {
    if (downloadTarget) {
      const film = downloadTarget.film;
      setDownloadTarget(null);
      setSelectedFilm(film);
      window.location.hash = `#movie/${film.id}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleBackToHome();
    }
  };

  const handleChangeDownloadQuality = (newQuality: '480p' | '720p' | '1080p' | '4k') => {
    if (downloadTarget) {
      setDownloadTarget({ ...downloadTarget, quality: newQuality });
      window.location.hash = `#download/${downloadTarget.film.id}/${newQuality}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToHome = () => {
    setDownloadTarget(null);
    setSelectedFilm(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeaderSearchClick = () => {
    if (selectedFilm || downloadTarget) {
      handleBackToHome();
    }
    setTimeout(() => {
      const moviesSection = document.getElementById('movies');
      if (moviesSection) {
        moviesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#080D14] text-white font-sans selection:bg-[#D9A45B]/30 selection:text-white">
      {/* Global Ad & Network Script Injector (for Popunders, Social Bar, Adcash AutoTag, HilltopAds) */}
      <GlobalAdScriptInjector />

      {/* Toast Notification */}
      {saveChangesNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121A26] border border-[#D9A45B] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#D9A45B]" />
          <span className="text-xs font-semibold font-mono">{saveChangesNotification}</span>
        </div>
      )}

      {/* 1. MOVIEBAAZ-STYLE TOP NAVBAR */}
      <Header
        onSearchClick={handleHeaderSearchClick}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={() => {
          handleBackToHome();
          setTimeout(() => {
            const el = document.getElementById('movies');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* DEDICATED MOVIEBAAZ DOWNLOAD PAGE vs SINGLE MOVIE PAGE vs HOMEPAGE */}
      {downloadTarget ? (
        <MovieDownloadPage
          film={downloadTarget.film}
          quality={downloadTarget.quality}
          onBackToMovie={handleBackToMovie}
          onChangeQuality={handleChangeDownloadQuality}
        />
      ) : selectedFilm ? (
        <MovieDetailPage
          film={selectedFilm}
          onBackToHome={handleBackToHome}
          onSelectFilm={handleSelectFilm}
          onNavigateToDownload={handleNavigateToDownload}
          allMovies={movies}
        />
      ) : (
        /* HOMEPAGE VIEW (When on home page) */
        <>
          {/* TOP BANNER AD (728x90, 468x60, 320x50 - Adsterra, Adcash, HilltopAds) */}
          <AdBannerSlot slot="top_banner" className="my-1 py-1" />

          <main id="top">
            {/* 2. TOP FEATURED MOVIES SLIDER (Moviebaaz style) */}
            <MovieSlider 
              movies={movies} 
              onSelectFilm={handleSelectFilm} 
            />

            {/* 3. MIDDLE ADSTERRA / ADCASH / HILLTOPADS BANNER */}
            <AdBannerSlot slot="middle_placement" />

            {/* 4. MAIN GLOBAL MOVIES & SERIES GRID (With live search & filters) */}
            <MoviePortalGrid
              movies={movies}
              onSelectFilm={handleSelectFilm}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
            />

            {/* 5. BOTTOM ADSTERRA / ADCASH / HILLTOPADS BANNER */}
            <AdBannerSlot slot="bottom_placement" />
          </main>
        </>
      )}

      {/* 6. CLEAN MODERN FOOTER */}
      <Footer onOpenPolicy={setPolicyType} />

      {/* Floating Center / Bottom Cinema Ad (High-CPM Pop-Up) */}
      <FloatingCenterAd />

      {/* Policy & Legal Disclosure Placeholder Modal */}
      <PolicyModal
        type={policyType}
        onClose={() => setPolicyType(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <AppRouter />
    </AdminProvider>
  );
}
