/**
 * Streamora Cinema Journal – Responsive Movie Discovery Landing Page
 * 
 * IMPORTANT POSITIONING:
 * This is an entertainment discovery and editorial-recommendation page,
 * not a movie-streaming service. No films can be played, streamed, downloaded,
 * or accessed for free on this site. No fake video players or fake play/download buttons.
 */

import React, { useState } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProgrammeWall } from './components/ProgrammeWall';
import { SponsoredPlacementOne } from './components/SponsoredPlacementOne';
import { CuratorSpotlight } from './components/CuratorSpotlight';
import { GenreJourney } from './components/GenreJourney';
import { FeaturedCollections } from './components/FeaturedCollections';
import { CollectionGrid } from './components/CollectionGrid';
import { SponsoredPlacementTwo } from './components/SponsoredPlacementTwo';
import { AboutSection } from './components/AboutSection';
import { FAQSection } from './components/FAQSection';
import { EditorialCTA } from './components/EditorialCTA';
import { Footer } from './components/Footer';
import { FilmDetailModal } from './components/FilmDetailModal';
import { EditorsNoteModal } from './components/EditorsNoteModal';
import { PolicyModal } from './components/PolicyModal';
import { AdminPortalSite } from './components/AdminPortalSite';
import { FilmItem } from './data/films';
import { CheckCircle2 } from 'lucide-react';

function AppRouter() {
  const { isAdminOpen, saveChangesNotification } = useAdmin();

  // If in Admin Mode (/admin, #admin, or toggled), render the dedicated Standalone Admin Site!
  // No popup, no modal overlay over landing page - a true independent administrative portal.
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
  // Modal & Selection States
  const [selectedFilm, setSelectedFilm] = useState<FilmItem | null>(null);
  const [editorsNoteOpen, setEditorsNoteOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  // Genre Filter & Search State shared across sections
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { saveChangesNotification } = useAdmin();

  const handleHeaderSearchClick = () => {
    const collectionEl = document.getElementById('collection');
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#101722] text-[#F6F0E4] font-sans film-grain selection:bg-[#D9A45B]/30 selection:text-[#F6F0E4]">
      {/* Toast Notification */}
      {saveChangesNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#192331] border border-[#D9A45B] text-[#F6F0E4] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#D9A45B]" />
          <span className="text-xs font-medium font-sans">{saveChangesNotification}</span>
        </div>
      )}

      {/* 1. COMPACT FESTIVAL HEADER */}
      <Header
        onSearchClick={handleHeaderSearchClick}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main>
        {/* 2. CENTERED FESTIVAL HERO */}
        <Hero />

        {/* 3. “NOW IN THE PROGRAMME” POSTER WALL */}
        <ProgrammeWall onSelectFilm={setSelectedFilm} />

        {/* 4. STANDALONE SPONSORED PLACEMENT (MODULE 1) */}
        <SponsoredPlacementOne />

        {/* 5. CURATOR’S SPOTLIGHT */}
        <CuratorSpotlight onOpenEditorsNote={() => setEditorsNoteOpen(true)} />

        {/* 6. GENRE JOURNEY */}
        <GenreJourney
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />

        {/* 7. FEATURED COLLECTIONS */}
        <FeaturedCollections
          onSelectCollectionGenre={(genre) => setSelectedGenre(genre)}
        />

        {/* 8. THE 20-TITLE COLLECTION */}
        <CollectionGrid
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectFilm={setSelectedFilm}
        />

        {/* 9. SECOND SPONSORED MODULE (MODULE 2) */}
        <SponsoredPlacementTwo />

        {/* 10. ABOUT STREAMORA */}
        <AboutSection />

        {/* 11. FREQUENTLY ASKED QUESTIONS */}
        <FAQSection />

        {/* 12. FINAL EDITORIAL CTA */}
        <EditorialCTA />
      </main>

      {/* 13. FOOTER */}
      <Footer onOpenPolicy={setPolicyType} />

      {/* MODALS */}
      {/* Local Film Details Modal */}
      <FilmDetailModal
        film={selectedFilm}
        onClose={() => setSelectedFilm(null)}
      />

      {/* Curator's Spotlight Editor's Note Modal */}
      <EditorsNoteModal
        isOpen={editorsNoteOpen}
        onClose={() => setEditorsNoteOpen(false)}
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
