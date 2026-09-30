import React, { useState, useEffect } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Header } from './components/Header';
import { MovieSlider } from './components/MovieSlider';
import { MoviePortalGrid } from './components/MoviePortalGrid';
import { SponsoredPlacementOne } from './components/SponsoredPlacementOne';
import { SponsoredPlacementTwo } from './components/SponsoredPlacementTwo';
import { Footer } from './components/Footer';
import { FilmDetailModal } from './components/FilmDetailModal';
import { PolicyModal } from './components/PolicyModal';
import { AdminPortalSite } from './components/AdminPortalSite';
import { FilmItem } from './data/films';
import { CheckCircle2 } from 'lucide-react';

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
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  // Genre Filter & Search State
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * CRITICAL URL HASH ROUTING:
   * Sync selected film with URL hash (e.g. #movie/cyber-odyssey)
   * This guarantees that when a user is viewing a movie and hits Browser Refresh (F5),
   * they STAY ON THAT MOVIE PAGE instead of going back to the home page!
   */
  useEffect(() => {
    const handleHashCheck = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (hash.startsWith('#movie/')) {
        const movieId = hash.replace('#movie/', '');
        const targetFilm = movies.find((m) => m.id === movieId);
        if (targetFilm) {
          setSelectedFilm(targetFilm);
        }
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

  const handleSelectFilm = (film: FilmItem) => {
    setSelectedFilm(film);
    window.location.hash = `#movie/${film.id}`;
  };

  const handleCloseFilmModal = () => {
    setSelectedFilm(null);
    if (window.location.hash.startsWith('#movie/')) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  const handleHeaderSearchClick = () => {
    const moviesSection = document.getElementById('movies');
    if (moviesSection) {
      moviesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080D14] text-white font-sans selection:bg-[#D9A45B]/30 selection:text-white">
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
          const el = document.getElementById('movies');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main id="top">
        {/* 2. TOP FEATURED MOVIES SLIDER (Moviebaaz style) */}
        <MovieSlider 
          movies={movies} 
          onSelectFilm={handleSelectFilm} 
        />

        {/* 3. FIRST ADSTERRA / SPONSORED BANNER BREAK */}
        <SponsoredPlacementOne />

        {/* 4. MAIN GLOBAL MOVIES & SERIES GRID (With live search & filters) */}
        <MoviePortalGrid
          movies={movies}
          onSelectFilm={handleSelectFilm}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
        />

        {/* 5. SECOND ADSTERRA / SPONSORED PLACEMENT BANNER */}
        <SponsoredPlacementTwo />
      </main>

      {/* 6. CLEAN MODERN FOOTER */}
      <Footer onOpenPolicy={setPolicyType} />

      {/* MODALS */}
      {/* Movie Details & Download Modal (Keeps URL as #movie/{id}) */}
      <FilmDetailModal
        film={selectedFilm}
        onClose={handleCloseFilmModal}
      />

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
