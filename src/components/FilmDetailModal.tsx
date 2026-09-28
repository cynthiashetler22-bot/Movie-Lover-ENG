import React, { useEffect } from 'react';
import { FilmItem } from '../data/films';
import { X, Calendar, Clock, Film, BookOpen, AlertCircle, Star, ExternalLink } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface FilmDetailModalProps {
  film: FilmItem | null;
  onClose: () => void;
}

export const FilmDetailModal: React.FC<FilmDetailModalProps> = ({ film, onClose }) => {
  const { ads, activeAdsterraLink } = useAdmin();

  // Find modal ad if enabled
  const modalAd = ads.find(a => a.slot === 'detail_modal_ad' && a.enabled);
  const targetModalAdUrl = modalAd?.directLinkUrl === 'YOUR_ADSTERRA_LINK' && activeAdsterraLink !== 'YOUR_ADSTERRA_LINK'
    ? activeAdsterraLink
    : modalAd?.directLinkUrl || activeAdsterraLink;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (film) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [film, onClose]);

  if (!film) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="film-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#192331] border border-[#34404C] rounded-2xl shadow-2xl text-[#F6F0E4] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 text-[#B6B2A9] hover:text-[#F6F0E4] bg-[#101722]/80 backdrop-blur-sm hover:bg-[#202C3A] rounded-full transition-colors cursor-pointer border border-[#34404C]"
          aria-label="Close film details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Poster Column */}
          {film.posterUrl && (
            <div className="md:col-span-4 flex flex-col">
              <div className="rounded-xl overflow-hidden border border-[#34404C] shadow-lg aspect-[2/3] bg-[#101722]">
                <img
                  src={film.posterUrl}
                  alt={`${film.title} poster art`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 p-2.5 bg-[#101722] rounded-lg border border-[#34404C] text-center">
                <span className="text-[11px] font-mono text-[#D9A45B]">35mm Archival Print</span>
              </div>
            </div>
          )}

          {/* Details Column */}
          <div className={film.posterUrl ? 'md:col-span-8 flex flex-col justify-between' : 'md:col-span-12'}>
            <div>
              {/* Category & Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D9A45B]">
                  {film.genre}
                </span>
                {film.secondaryGenre && (
                  <>
                    <span className="text-[#34404C] text-xs">/</span>
                    <span className="text-xs text-[#B6B2A9]">{film.secondaryGenre}</span>
                  </>
                )}
                <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#101722] border border-[#34404C] text-xs text-[#D9A45B] font-mono">
                  <Star className="w-3.5 h-3.5 fill-[#D9A45B]" />
                  <span>{film.ratingScore || '8.8'} / 10</span>
                </div>
              </div>

              {/* Title */}
              <h2 id="film-modal-title" className="font-serif text-3xl sm:text-4xl text-[#F6F0E4] font-medium leading-tight mb-3">
                {film.title}
              </h2>

              {/* Metadata Line */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#B6B2A9] pb-3 mb-4 border-b border-[#34404C]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D9A45B]" />
                  {film.year}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D9A45B]" />
                  {film.duration}
                </span>
                <span>·</span>
                <span>Director: <strong className="text-[#F6F0E4]">{film.director || 'Curator Choice'}</strong></span>
              </div>

              {/* Mood */}
              <div className="mb-4 p-3 bg-[#202C3A]/60 border-l-2 border-[#D9A45B] rounded-r text-xs text-[#F6F0E4]">
                <strong className="text-[#D9A45B] uppercase font-sans tracking-wide">Atmosphere:</strong> {film.mood}
              </div>

              {/* Curatorial Synopsis */}
              <div className="mb-4 space-y-1.5">
                <h3 className="text-xs font-sans uppercase tracking-widest text-[#B6B2A9]">Curatorial Synopsis</h3>
                <p className="font-sans text-xs sm:text-sm text-[#F6F0E4]/90 leading-relaxed">
                  {film.synopsis || film.shortDesc}
                </p>
              </div>

              {/* Editorial Reflection */}
              {film.editorialNote && (
                <div className="mb-4 p-3.5 rounded-lg bg-[#101722] border border-[#34404C]">
                  <h4 className="text-[11px] font-sans uppercase tracking-widest text-[#D9A45B] mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" />
                    <span>Editor's Reflection</span>
                  </h4>
                  <p className="font-serif text-xs italic text-[#B6B2A9] leading-relaxed">
                    "{film.editorialNote}"
                  </p>
                </div>
              )}
            </div>

            {/* Optional Modal Ad Banner (Safely labeled) */}
            {modalAd && targetModalAdUrl && targetModalAdUrl !== 'YOUR_ADSTERRA_LINK' && (
              <div className="my-3 p-3 bg-[#101722] border border-dashed border-[#D9A45B]/50 rounded-xl flex items-center justify-between gap-3">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-mono text-[#D9A45B] tracking-wider block">
                    SPONSORED PARTNER
                  </span>
                  <span className="text-xs text-[#F6F0E4] font-medium">{modalAd.sponsorName}</span>
                </div>
                <a
                  href={targetModalAdUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#101722] bg-[#D9A45B] hover:bg-[#e4b574] rounded transition-colors"
                >
                  <span>{modalAd.buttonText}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Disclaimer */}
            <div className="p-3 bg-[#101722]/80 border border-[#34404C] rounded-lg text-[11px] text-[#B6B2A9] flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-[#D9A45B] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Streamora is strictly an independent cinema discovery journal. We do not stream or distribute media files.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#101722] border-t border-[#34404C] flex items-center justify-between">
          <span className="text-xs text-[#B6B2A9]/60 font-mono">Streamora Film Journal Record #{film.id}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#202C3A] hover:bg-[#D9A45B] hover:text-[#101722] text-[#F6F0E4] rounded-lg transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
