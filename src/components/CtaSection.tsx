import React from 'react';
import { Truck, ShieldCheck, RotateCcw, ArrowRight } from 'lucide-react';

interface CtaSectionProps {
  darkMode: boolean;
  onOpenReservation: () => void;
  onOpenModelPricing: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  darkMode,
  onOpenReservation,
  onOpenModelPricing
}) => {
  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      {/* Ambient background glow */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-rose-950/20 via-purple-950/30 to-slate-950 pointer-events-none" 
        aria-hidden="true" 
      />
      
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <span 
          id="cta-eyebrow-pill"
          className="text-xs font-mono uppercase tracking-widest text-rose-400 border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 rounded-full inline-block mb-6"
        >
          Reservas Abertas em Portugal
        </span>

        <h2 
          id="cta-title"
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight"
        >
          Garantir o seu lugar na nova era do desempenho.
        </h2>

        <p 
          id="cta-description"
          className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Efetue a sua pré-reserva hoje mesmo e receba o seu dispositivo com prioridade no dia de lançamento oficial, a 18 de setembro.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            id="cta-primary-reserve-btn"
            onClick={onOpenReservation}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-slate-100 text-slate-950 font-bold text-base hover:bg-white transition transform hover:scale-105 shadow-xl shadow-rose-950/30 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Reservar Agora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            id="cta-secondary-pricing-btn"
            onClick={onOpenModelPricing}
            className="w-full sm:w-auto px-10 py-4 rounded-full font-semibold text-base border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 transition cursor-pointer"
          >
            Ver Preços e Modelos
          </button>
        </div>

        {/* Trust Value Propositions Grid */}
        <div id="trust-propositions-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-slate-800/80 pt-12">
          
          <div id="trust-card-shipping" className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-800/80 text-rose-400 border border-slate-700 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">Envio Gratuito em Portugal</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Entrega rápida ao domicílio ou levantamento na Apple Store mais próxima.
              </p>
            </div>
          </div>

          <div id="trust-card-warranty" className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-800/80 text-emerald-400 border border-slate-700 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">Garantia de 3 Anos</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Proteção legal completa da UE com suporte e assistência especializada Apple.
              </p>
            </div>
          </div>

          <div id="trust-card-tradein" className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-800/80 text-blue-400 border border-slate-700 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">Apple Trade In</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Troque o seu equipamento antigo por crédito imediato na sua reserva.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
