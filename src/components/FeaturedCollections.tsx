import React from 'react';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import loveImg from '../assets/images/collection_love_longing_1790611829291.jpg';
import mysteryImg from '../assets/images/collection_secrets_midnight_1790611842025.jpg';
import horizonImg from '../assets/images/collection_beyond_horizon_1790611853483.jpg';

interface FeaturedCollectionsProps {
  onSelectCollectionGenre: (genre: string) => void;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({ onSelectCollectionGenre }) => {
  const collections = [
    {
      id: 'love-and-longing',
      title: 'Love & Longing',
      subtitle: 'Romance-Inspired Stories',
      targetGenre: 'Romance',
      image: loveImg,
      alt: 'Atmospheric silhouettes under rain in Paris street at night',
      description: 'Quiet cafe corners, rain-swept cobblestone streets, and the tender ache of unspoken devotions in European and Asian independent cinema.',
      titlesCount: '6 Selected Stories',
      themeNote: 'Curated by Élodie Martin',
    },
    {
      id: 'secrets-after-midnight',
      title: 'Secrets After Midnight',
      subtitle: 'Mystery & Thriller Discoveries',
      targetGenre: 'Mystery',
      image: mysteryImg,
      alt: 'Silhouette walking through midnight misty alleyway with vintage lamppost',
      description: 'Labyrinthine alleys, cold forensic archives, and slow-burning investigative procedurals that dissect human obsession in the dead of night.',
      titlesCount: '5 Curated Enigmas',
      themeNote: 'Curated by Marcus Brandt',
    },
    {
      id: 'beyond-the-horizon',
      title: 'Beyond the Horizon',
      subtitle: 'Adventure & Fantasy Selections',
      targetGenre: 'Adventure',
      image: horizonImg,
      alt: 'Solitary wanderer standing atop misty alpine mountain ridge at golden dusk',
      description: 'Untamed sub-arctic plateaus, forgotten nautical routes, and mythical primeval forests where human spirit confronts immense horizons.',
      titlesCount: '4 Epic Journeys',
      themeNote: 'Curated by Astrid Lindholm',
    },
  ];

  return (
    <section id="collections" className="py-20 lg:py-24 border-b border-[#34404C] bg-[#101722]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pb-6 border-b border-[#34404C]">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#D9A45B] mb-2">
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Editorial Series</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#F6F0E4]">
              Featured Collections
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#B6B2A9] mt-2 max-w-xl">
              Three themed anthologies exploring human romance, nocturnal tension, and planetary frontiers.
            </p>
          </div>
          <span className="text-xs uppercase tracking-widest text-[#B6B2A9]/60 font-mono">
            Editorial Anthologies
          </span>
        </div>

        {/* 3 Editorial Collection Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col) => (
            <article
              key={col.id}
              className="group bg-[#192331] border border-[#34404C] hover:border-[#D9A45B]/60 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black/50"
            >
              <div>
                {/* Visual Header */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#101722]">
                  <img
                    src={col.image}
                    alt={col.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#192331] via-transparent to-transparent" />
                  
                  {/* Category Pill-free text overlay */}
                  <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-[#101722]/85 backdrop-blur-sm border border-[#34404C] rounded text-[11px] font-sans font-medium uppercase tracking-widest text-[#D9A45B]">
                    {col.subtitle}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#B6B2A9]/60 mb-2">
                    {col.themeNote}
                  </div>
                  <h3 className="font-serif text-2xl text-[#F6F0E4] group-hover:text-[#D9A45B] transition-colors mb-3">
                    {col.title}
                  </h3>
                  <p className="font-sans text-sm text-[#B6B2A9] leading-relaxed mb-4">
                    {col.description}
                  </p>
                </div>
              </div>

              {/* Panel Footer */}
              <div className="px-6 pb-6 pt-2 border-t border-[#34404C]/50 flex items-center justify-between">
                <span className="text-xs text-[#B6B2A9]/75 font-mono">
                  {col.titlesCount}
                </span>

                <button
                  onClick={() => {
                    onSelectCollectionGenre(col.targetGenre);
                    const el = document.getElementById('collection');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D9A45B] hover:text-[#F6F0E4] transition-colors cursor-pointer"
                  aria-label={`Explore ${col.title} collection`}
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
