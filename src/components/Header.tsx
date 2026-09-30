import React, { useState } from 'react';
import { Search, Menu, X, Film, Tv, Flame, Sparkles } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface HeaderProps {
  onSearchClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectCategory?: (category: 'all' | 'movie' | 'series') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearchClick, 
  searchQuery, 
  setSearchQuery,
  onSelectCategory
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useAdmin();

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080D14]/95 backdrop-blur-md border-b border-[#1E293B] transition-colors">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group focus-visible:outline-none"
          aria-label="Streamora Movie Portal - Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9A45B] to-amber-600 flex items-center justify-center text-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-black tracking-wider text-white group-hover:text-[#D9A45B] transition-colors">
              {settings.siteTitle || 'STREAMORA'}
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 -mt-1">
              4K Movies & Series Hub
            </span>
          </div>
        </a>

        {/* Desktop Primary Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
          <button 
            onClick={() => handleNavClick('top')}
            className="hover:text-[#D9A45B] transition-colors cursor-pointer"
          >
            Featured
          </button>
          <button 
            onClick={() => {
              if (onSelectCategory) onSelectCategory('movie');
              handleNavClick('movies');
            }}
            className="hover:text-[#D9A45B] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Film className="w-3.5 h-3.5 text-[#D9A45B]" />
            Movies
          </button>
          <button 
            onClick={() => {
              if (onSelectCategory) onSelectCategory('series');
              handleNavClick('movies');
            }}
            className="hover:text-[#D9A45B] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Tv className="w-3.5 h-3.5 text-teal-400" />
            TV Series
          </button>
          <button 
            onClick={() => handleNavClick('movies')}
            className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 text-amber-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
            4K Ultra HD
          </button>
        </nav>

        {/* Right Search Input Box */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-48 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalogue..."
              className="w-full bg-[#121A26] text-white text-xs pl-8 pr-7 py-2 rounded-xl border border-[#233145] focus:border-[#D9A45B] focus:outline-none placeholder-slate-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => handleNavClick('movies')}
            className="px-4 py-2 text-xs font-black uppercase tracking-wider bg-[#D9A45B] hover:bg-[#E5B573] text-black rounded-xl transition-all shadow-md cursor-pointer hidden sm:flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Explore All</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl bg-[#121A26] border border-[#233145]"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0E17] border-b border-[#1E293B] px-4 py-5 space-y-4 animate-fadeIn">
          {/* Mobile search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, genres, cast..."
              className="w-full bg-[#121A26] text-white text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#233145] focus:border-[#D9A45B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono font-bold">
            <button
              onClick={() => handleNavClick('movies')}
              className="p-3 rounded-xl bg-[#121A26] text-left text-white border border-[#233145] hover:border-[#D9A45B] flex items-center gap-2"
            >
              <Film className="w-4 h-4 text-[#D9A45B]" />
              <span>All Movies</span>
            </button>
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory('series');
                handleNavClick('movies');
              }}
              className="p-3 rounded-xl bg-[#121A26] text-left text-white border border-[#233145] hover:border-[#D9A45B] flex items-center gap-2"
            >
              <Tv className="w-4 h-4 text-teal-400" />
              <span>TV Series</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
