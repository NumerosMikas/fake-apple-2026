import React from 'react';
import { User, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { personasData } from '../data';

interface PersonasSectionProps {
  darkMode: boolean;
  onSelectPersonaDevice: (device: string) => void;
}

export const PersonasSection: React.FC<PersonasSectionProps> = ({
  darkMode,
  onSelectPersonaDevice
}) => {
  return (
    <section 
      id="personas" 
      className={`py-20 border-t transition-colors ${
        darkMode ? 'border-slate-800/80 bg-slate-950/30' : 'border-slate-200 bg-slate-100/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="personas-eyebrow" className="text-xs font-mono uppercase tracking-widest text-rose-500 mb-2">
            Para Quem Foi Desenhado
          </h2>
          <p id="personas-title" className="text-3xl md:text-4xl font-bold tracking-tight">
            Criado para quem não aceita limitações.
          </p>
          <p className="text-slate-400 mt-3 text-base">
            Identifique o perfil de inovação que melhor responde às suas necessidades diárias.
          </p>
        </div>

        {/* Personas Cards Grid */}
        <div id="personas-cards-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personasData.map((persona, idx) => (
            <div 
              id={`persona-card-${idx}`}
              key={idx} 
              className={`rounded-3xl border p-8 relative flex flex-col justify-between transition hover:border-slate-600 ${
                darkMode ? 'bg-slate-900/60 border-slate-800 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-mono uppercase px-3 py-1 rounded-full border border-slate-700 bg-slate-800/50 text-slate-300">
                    {persona.badge}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                    <User className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-1">{persona.role}</h3>
                <p className="text-xs text-rose-400 font-medium mb-6">{persona.tagline}</p>

                <div className="space-y-4 text-sm">
                  {/* Frustration */}
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/30">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <p className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                        Frustração Atual
                      </p>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{persona.frustration}</p>
                  </div>

                  {/* Desired Outcome */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                        Resultado Desejado
                      </p>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{persona.outcome}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Solução recomendada:</span>
                <button
                  id={`persona-sol-btn-${idx}`}
                  onClick={() => onSelectPersonaDevice(persona.recommendedDevice)}
                  className="font-semibold text-slate-200 hover:text-rose-400 transition cursor-pointer flex items-center gap-1"
                >
                  <span>{persona.recommendedDevice}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
