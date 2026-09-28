import React from 'react';
import { Film, Compass, Heart, ShieldCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-28 border-b border-[#34404C] bg-[#101722]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading and Mission Statement */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#D9A45B] mb-3">
              <Film className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Editorial Manifesto</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#F6F0E4] leading-tight mb-6">
              A journal for curious film lovers.
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#B6B2A9] font-sans leading-relaxed">
              <p className="text-[#F6F0E4]/90 font-serif text-lg italic border-l-2 border-[#D9A45B] pl-4 py-1">
                “Streamora is an independent movie-discovery journal for exploring film-inspired collections, genre guides, and editorial recommendations. It does not host, stream, or provide downloads of films.”
              </p>
              <p>
                In an era of algorithmic saturation, Streamora returns to the human cadence of independent film festivals: thoughtful thematic groupings, directors' notes, historical lineage, and the quiet pleasure of discovering unexpected cinematic gems.
              </p>
              <p>
                Every programme and collection is shaped with curatorial intent—pairing well-known genre pillars alongside quiet international festival selections.
              </p>
            </div>
          </div>

          {/* Right Column: Curatorial Pillars */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 bg-[#192331] border border-[#34404C] rounded-lg">
              <div className="w-9 h-9 rounded bg-[#202C3A] flex items-center justify-center text-[#D9A45B] mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#F6F0E4] mb-2">Curated Journeys</h3>
              <p className="text-xs text-[#B6B2A9] leading-relaxed">
                Genre pathways and thematic collections assembled by film scholars and passionate moviegoers.
              </p>
            </div>

            <div className="p-6 bg-[#192331] border border-[#34404C] rounded-lg">
              <div className="w-9 h-9 rounded bg-[#202C3A] flex items-center justify-center text-[#63A9A0] mb-4">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#F6F0E4] mb-2">Independent Voice</h3>
              <p className="text-xs text-[#B6B2A9] leading-relaxed">
                Committed strictly to discovering storytelling craft, cinematographic composition, and directorial vision.
              </p>
            </div>

            <div className="p-6 bg-[#192331] border border-[#34404C] rounded-lg">
              <div className="w-9 h-9 rounded bg-[#202C3A] flex items-center justify-center text-[#D9A45B] mb-4">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#F6F0E4] mb-2">Pure Discovery</h3>
              <p className="text-xs text-[#B6B2A9] leading-relaxed">
                No bloated subscriptions, no paywalls, and no clutter. Just pure film appreciation and discovery.
              </p>
            </div>

            <div className="p-6 bg-[#192331] border border-[#34404C] rounded-lg">
              <div className="w-9 h-9 rounded bg-[#202C3A] flex items-center justify-center text-[#63A9A0] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#F6F0E4] mb-2">Honest Clarity</h3>
              <p className="text-xs text-[#B6B2A9] leading-relaxed">
                Clear distinction between editorial discovery content and clearly disclosed partner offers.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
