import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/films';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  // State to track open item index (default first item open)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-24 border-b border-[#34404C] bg-[#101722]">
      <div className="max-w-[880px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#D9A45B] mb-2">
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Curatorial Inquiries</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#F6F0E4]">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-sm text-[#B6B2A9] mt-2 max-w-lg mx-auto">
            Essential information regarding Streamora’s cinema discovery format and editorial standards.
          </p>
        </div>

        {/* Accessible Accordion List */}
        <div className="space-y-4" role="region" aria-label="Frequently Asked Questions Accordion">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const headingId = `faq-heading-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <div
                key={index}
                className="bg-[#192331] border border-[#34404C] rounded-lg transition-colors overflow-hidden"
              >
                <button
                  id={headingId}
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D9A45B]"
                >
                  <span className="font-serif text-lg sm:text-xl text-[#F6F0E4] font-medium leading-snug">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D9A45B] flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#B6B2A9] font-sans leading-relaxed border-t border-[#34404C]/40 animate-fadeIn"
                  >
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
