import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';
import { faqsData } from '../data';

interface FaqSectionProps {
  darkMode: boolean;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ darkMode }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First open by default for clear immediate visibility
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  const categories = ["Todos", "Disponibilidade", "Reservas", "Trade In", "Saúde", "Garantia"];

  const filteredFaqs = activeCategory === "Todos" 
    ? faqsData 
    : faqsData.filter(f => f.category === activeCategory);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section 
      id="faq" 
      className={`py-20 border-t transition-colors ${
        darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-100/60'
      }`}
    >
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-mono uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Respostas Claras
          </div>
          <p id="faq-title" className="text-3xl md:text-4xl font-bold tracking-tight">
            Perguntas Frequentes
          </p>
          <p className="text-slate-400 mt-2 text-sm">
            Tudo o que precisa de saber sobre disponibilidade, reservas, retomas e garantias em Portugal.
          </p>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`faq-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => {
                setActiveCategory(cat);
                setOpenFaq(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-rose-500 text-white shadow-sm'
                  : darkMode
                    ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div id="faq-accordion-list" className="space-y-3.5">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                id={`faq-item-${index}`}
                className={`rounded-2xl border transition duration-200 overflow-hidden ${
                  isOpen
                    ? darkMode 
                      ? 'bg-slate-900/90 border-slate-700 shadow-md' 
                      : 'bg-white border-slate-300 shadow-sm'
                    : darkMode 
                      ? 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700' 
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  id={`faq-toggle-btn-${index}`}
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 font-semibold text-base focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base leading-snug">{faq.q}</span>
                  <span 
                    className={`transform transition-transform duration-200 text-slate-400 shrink-0 ${
                      isOpen ? 'rotate-180 text-rose-400' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </button>
                
                {isOpen && (
                  <div 
                    id={`faq-answer-${index}`}
                    className={`px-6 pb-6 text-sm leading-relaxed border-t pt-4 ${
                      darkMode ? 'text-slate-300 border-slate-800' : 'text-slate-600 border-slate-100'
                    }`}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Phone Support Callout */}
        <div className={`mt-10 p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-4 text-xs ${
          darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold">Prefere falar com um especialista em Portugal?</span>
              <p className="text-slate-400 text-[11px]">Linha de apoio gratuito a compras e clientes particulares.</p>
            </div>
          </div>
          <a 
            id="faq-phone-support-link"
            href="tel:800207758" 
            className="font-bold text-rose-400 hover:underline text-sm"
          >
            800 207 758
          </a>
        </div>

      </div>
    </section>
  );
};
