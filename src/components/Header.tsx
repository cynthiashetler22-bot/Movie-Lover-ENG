import React, { useState } from 'react';
import { Search, Menu, X, Compass, Shield, Lock } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface HeaderProps {
  onSearchClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick, searchQuery, setSearchQuery }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { setIsAdminOpen, adminPasswordCorrect, settings } = useAdmin();

  return (
    <header className="sticky top-0 z-40 bg-[#101722]/95 backdrop-blur-md border-b border-[#34404C] transition-colors">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Left: Streamora Wordmark & Descriptor */}
        <a 
          href="#top" 
          className="flex items-baseline gap-2.5 group focus-visible:outline-none"
          aria-label="Streamora Cinema Journal - Home"
        >
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-[#F6F0E4] group-hover:text-[#D9A45B] transition-colors">
            {settings.siteTitle || 'STREAMORA'}
          </span>
          <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-[#D9A45B] hidden sm:inline-block border-l border-[#34404C] pl-2.5">
            Cinema Journal
          </span>
        </a>

        {/* Center: Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#B6B2A9]" aria-label="Main Navigation">
          <a href="#programme" className="hover:text-[#F6F0E4] transition-colors">
            The Programme
          </a>
          <a href="#collections" className="hover:text-[#F6F0E4] transition-colors">
            Collections
          </a>
          <a href="#genres" className="hover:text-[#F6F0E4] transition-colors">
            Genres
          </a>
          <a href="#about" className="hover:text-[#F6F0E4] transition-colors">
            About
          </a>
          <a href="#faq" className="hover:text-[#F6F0E4] transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right: Search, Admin button, and Browse internal actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {searchOpen ? (
            <div className="relative flex items-center animate-fadeIn">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, genres, cast..."
                className="bg-[#192331] text-[#F6F0E4] text-xs px-3 py-1.5 pr-8 rounded border border-[#34404C] focus:border-[#D9A45B] focus:outline-none w-44 sm:w-56"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-2 text-[#B6B2A9] hover:text-[#F6F0E4] cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setSearchOpen(true);
                onSearchClick();
              }}
              className="p-2 text-[#B6B2A9] hover:text-[#D9A45B] transition-colors rounded hover:bg-[#192331] cursor-pointer"
              aria-label="Open film search"
              title="Search film titles"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* ADMIN PANEL ACCESS BUTTON */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded border transition-all cursor-pointer ${
              adminPasswordCorrect
                ? 'bg-[#D9A45B]/15 text-[#D9A45B] border-[#D9A45B]/50 hover:bg-[#D9A45B] hover:text-[#101722]'
                : 'bg-[#192331] text-[#B6B2A9] border-[#34404C] hover:text-[#F6F0E4] hover:border-[#D9A45B]/60'
            }`}
            title="Open Admin Control Center (Movies, Ads, GitHub PAT)"
            aria-label="Open Admin Control Center"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="sm:hidden">Admin</span>
          </button>

          <a
            href="#collection"
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase text-[#101722] bg-[#D9A45B] hover:bg-[#e4b574] rounded transition-all whitespace-nowrap"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Browse Titles</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#B6B2A9] hover:text-[#F6F0E4] rounded hover:bg-[#192331]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#192331] border-b border-[#34404C] px-6 py-6 flex flex-col gap-4 animate-fadeIn">
          <nav className="flex flex-col gap-3 text-base text-[#F6F0E4]">
            <a 
              href="#programme" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#B6B2A9] hover:text-[#D9A45B] transition-colors"
            >
              The Programme
            </a>
            <a 
              href="#collections" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#B6B2A9] hover:text-[#D9A45B] transition-colors"
            >
              Collections
            </a>
            <a 
              href="#genres" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#B6B2A9] hover:text-[#D9A45B] transition-colors"
            >
              Genres
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#B6B2A9] hover:text-[#D9A45B] transition-colors"
            >
              About
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#B6B2A9] hover:text-[#D9A45B] transition-colors"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-3 border-t border-[#34404C] flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="w-full text-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#202C3A] text-[#D9A45B] border border-[#D9A45B]/40 rounded hover:bg-[#2c3d50] transition-colors flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel (Manage Site & Ads)</span>
            </button>
            <a
              href="#collection"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#D9A45B] text-[#101722] rounded hover:bg-[#e4b574] transition-colors"
            >
              Browse 20 Titles
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
