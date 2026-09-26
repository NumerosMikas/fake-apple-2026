import React from 'react';
import { Camera, Cpu, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  darkMode: boolean;
  onOpenReservation: () => void;
  onOpenModelPricing: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  darkMode,
  onOpenReservation,
  onOpenModelPricing
}) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Background ambient lighting */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-rose-900/30 via-purple-900/20 to-transparent blur-[120px] rounded-full pointer-events-none" 
        aria-hidden="true"
      />
      
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        
        {/* Launch tag */}
        <div 
          id="hero-launch-badge"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-medium mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          Nova Geração Flagship 2026
        </div>

        {/* Headline (Max 10 Words) */}
        <h1 
          id="hero-main-title" 
          className="text-4xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-none mb-6"
        >
          Um Pro muito à frente. <br />
          <span className="bg-gradient-to-r from-rose-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
            Engenharia Sem Limites.
          </span>
        </h1>

        {/* Subheadline (Max 25 Words) */}
        <p 
          id="hero-subtitle" 
          className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8"
        >
          Concebido para elevar a sua produtividade, criatividade e saúde com o maior salto de desempenho e inovação alguma vez criado.
        </p>

        {/* CTAs */}
        <div id="hero-action-buttons" className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button 
            id="hero-primary-reserve-btn"
            onClick={onOpenReservation}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-100 text-slate-950 font-bold text-base hover:bg-white transition transform hover:scale-105 shadow-xl shadow-rose-950/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Reservar Agora — Desde 18/09</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            id="hero-view-pricing-btn"
            onClick={onOpenModelPricing}
            className={`w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-base border transition cursor-pointer ${
              darkMode 
                ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-200' 
                : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
            }`}
          >
            Ver Preços e Modelos
          </button>
        </div>

        {/* Hero Visual Display Container */}
        <div 
          id="hero-visual-card"
          className={`relative max-w-5xl mx-auto rounded-3xl border p-4 md:p-8 shadow-2xl backdrop-blur-2xl transition ${
            darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white/60 border-slate-200'
          }`}
        >
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-[#0d0714] border border-white/10 py-16 px-6 md:px-12 text-left flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="max-w-md space-y-4">
              <span className="text-xs font-mono tracking-wider text-rose-400 uppercase">
                Destaque de Lançamento
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                iPhone 18 Pro
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Estrutura em titânio de grau aeroespacial na nova cor Burgundy Deep. Chip A19 Pro ultrarrápido e módulo de câmara triplo de 48 MP com alcance zoom estendido.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-slate-300">
                <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-rose-400" /> Chip A19 Pro
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-purple-400" /> Câmara 48MP 8K
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Bateria +5h
                </span>
              </div>
            </div>

            {/* Graphic Card Representation */}
            <div 
              id="hero-product-teaser-box"
              className="w-full md:w-80 h-76 rounded-2xl bg-gradient-to-tr from-rose-950 via-rose-900 to-purple-900 p-6 flex flex-col justify-between border border-rose-500/30 relative overflow-hidden group shadow-2xl transition hover:border-rose-400/60"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 pointer-events-none" />
              
              <div className="flex justify-between items-start z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-200">
                  Titanium Burgundy
                </span>
                <span className="text-xs bg-rose-500/30 text-rose-100 px-2.5 py-0.5 rounded-full border border-rose-400/40 font-mono font-semibold">
                  18/09
                </span>
              </div>

              <div className="z-10 mt-auto">
                <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-white/20 mb-4 flex items-center justify-center text-rose-400 shadow-inner">
                  <Camera className="w-7 h-7" />
                </div>
                <p className="text-xl font-bold text-white tracking-tight">iPhone 18 Pro</p>
                <p className="text-xs text-rose-200 mb-3">Disponível para reserva imediata em Portugal</p>
                
                <button
                  id="teaser-configure-btn"
                  onClick={onOpenReservation}
                  className="w-full text-center py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur border border-white/20 transition cursor-pointer"
                >
                  Configurar & Reservar &rarr;
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
