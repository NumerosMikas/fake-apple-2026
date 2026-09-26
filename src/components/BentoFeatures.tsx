import React from 'react';
import { Cpu, Camera, HeartPulse, BatteryCharging, Headphones, Sparkles, ArrowUpRight } from 'lucide-react';

interface BentoFeaturesProps {
  darkMode: boolean;
  onOpenReservationWithProduct: (productId: string) => void;
}

export const BentoFeatures: React.FC<BentoFeaturesProps> = ({
  darkMode,
  onOpenReservationWithProduct
}) => {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="features-eyebrow" className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-2">
            Ecossistema de Inovação
          </h2>
          <p id="features-title" className="text-3xl md:text-5xl font-extrabold tracking-tight">
            O alinhamento perfeito de hardware e poder.
          </p>
          <p className="text-slate-400 mt-4 text-base">
            Descubra os 5 pilares do novo ecossistema Apple para 2026.
          </p>
        </div>

        {/* Bento Grid */}
        <div id="bento-grid-container" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tile 1: iPhone 18 Pro (Large 2 Cols) */}
          <div 
            id="bento-tile-iphone-18-pro"
            onClick={() => onOpenReservationWithProduct("iphone-18-pro")}
            className={`md:col-span-2 rounded-3xl border p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/60 ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500/20 transition">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Flagship • 18/09</span>
                <div className="w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold">iPhone 18 Pro</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  A19 Pro 2nm
                </span>
              </div>
              <p className="text-slate-400 text-sm max-w-xl mb-4 leading-relaxed">
                Potência M5/A19 Pro de nível de estúdio e câmaras de precisão no seu bolso com zoom ótico 7x e gravação ProRes 8K nativa.
              </p>
              <p className="text-xs text-rose-400 font-semibold">
                "Um Pro muito à frente." — Autonomia alargada em 5 horas e construção em titânio de grau aeroespacial.
              </p>
            </div>
          </div>

          {/* Tile 2: iPhone Duo */}
          <div 
            id="bento-tile-iphone-duo"
            onClick={() => onOpenReservationWithProduct("iphone-duo")}
            className={`rounded-3xl border p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:border-purple-500/60 group ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition">
                <Camera className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Reserva 16/10</span>
                <div className="w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">iPhone Duo</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Produtividade dobrável e multitarefa contínua numa experiência ecrã duplo revolucionária sem vincos visíveis.
              </p>
              <span className="text-xs font-mono text-purple-300">Novo formato flexível.</span>
            </div>
          </div>

          {/* Tile 3: Apple Watch Series 12 */}
          <div 
            id="bento-tile-watch-12"
            onClick={() => onOpenReservationWithProduct("watch-series-12")}
            className={`rounded-3xl border p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/60 group ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Saúde • 18/09</span>
                <div className="w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Apple Watch Series 12</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Monitorização cardíaca clínica com a maior precisão científica alguma vez testada num wearable comercial.
              </p>
              <span className="text-xs font-mono text-emerald-300">Validado por estudos clínicos (2026)</span>
            </div>
          </div>

          {/* Tile 4: MacBook Air & Pro M5 */}
          <div 
            id="bento-tile-macbook-m5"
            onClick={() => onOpenReservationWithProduct("macbook-pro-m5")}
            className={`rounded-3xl border p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:border-blue-500/60 group ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Apple Silicon</span>
                <div className="w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">MacBook Air & Pro M5</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Velocidade relâmpago para cargas de trabalho exigentes com autonomia de até 22 horas para todo o dia.
              </p>
              <span className="text-xs font-mono text-blue-300">Superpoderes do chip M5, M5 Pro e Max.</span>
            </div>
          </div>

          {/* Tile 5: AirPods 5 */}
          <div 
            id="bento-tile-airpods-5"
            onClick={() => onOpenReservationWithProduct("airpods-5")}
            className={`rounded-3xl border p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:border-amber-500/60 group ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500/20 transition">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Áudio • 18/09</span>
                <div className="w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">AirPods 5</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Imersão sonora instantânea e a magia do Cancelamento Ativo de Ruído adaptativo de nova geração.
              </p>
              <span className="text-xs font-mono text-amber-300">Som Espacial de Próxima Geração.</span>
            </div>
          </div>

        </div>

        {/* Education Offer Campaign Bar */}
        <div 
          id="education-offer-banner"
          className="mt-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-300">
              Campanha de Educação — Universidade
            </span>
            <h4 className="text-xl font-bold text-white mt-1">Ganha um cartão-oferta de 80 € a 120 €*</h4>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Quando compras um Mac ou iPad com descontos especiais para estudantes, docentes e investigadores qualificados em Portugal.
            </p>
          </div>
          <button 
            id="education-campaign-cta-btn"
            onClick={() => onOpenReservationWithProduct("macbook-pro-m5")}
            className="whitespace-nowrap px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm transition shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            Aproveitar Oferta
          </button>
        </div>

      </div>
    </section>
  );
};
