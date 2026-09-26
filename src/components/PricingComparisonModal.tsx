import React from 'react';
import { X, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { productsData } from '../data';

interface PricingComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductToReserve: (productId: string) => void;
  darkMode: boolean;
}

export const PricingComparisonModal: React.FC<PricingComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectProductToReserve,
  darkMode
}) => {
  if (!isOpen) return null;

  return (
    <div id="pricing-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-md bg-black/70 animate-in fade-in duration-200">
      <div 
        id="pricing-modal-container"
        className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col ${
          darkMode ? 'bg-[#0e0f14] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-6 border-b flex items-center justify-between ${darkMode ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-100 bg-slate-50/70'}`}>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-rose-400">
              Gama Completa Apple 2026
            </span>
            <h3 id="pricing-modal-title" className="text-xl font-bold mt-1">
              Preços e Modelos em Portugal
            </h3>
          </div>
          <button 
            id="close-pricing-modal-btn"
            onClick={onClose}
            className={`p-2 rounded-full border transition ${
              darkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-600'
            }`}
            aria-label="Fechar tabela de preços"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          <p className="text-xs text-slate-400 leading-relaxed">
            Todos os preços incluem IVA à taxa legal em vigor em Portugal (23%) e garantia legal europeia de 3 anos. Possibilidade de financiamento até 24 ou 36 meses sem juros com parceiros selecionados.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productsData.map((p) => (
              <div 
                key={p.id}
                id={`pricing-card-${p.id}`}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition ${
                  darkMode ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wide">
                        {p.badge}
                      </span>
                      <h4 className="text-lg font-bold">{p.name}</h4>
                      <p className="text-xs text-slate-400">{p.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-100">Desde {p.priceStartingAt} €</span>
                      <p className="text-[10px] text-slate-400">ou {p.monthlyFrom} €/mês</p>
                    </div>
                  </div>

                  {/* Specs summary */}
                  <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                    {p.specs.slice(0, 3).map((spec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug text-slate-400">{spec}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Disponibilidade:</span>
                    <span className="text-slate-200 font-medium">{p.releaseDate}</span>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    id={`reserve-now-product-${p.id}`}
                    onClick={() => onSelectProductToReserve(p.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Configurar & Reservar {p.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/20 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Dúvidas sobre compatibilidade com os seus acessórios anteriores?</span>
            </div>
            <a href="tel:800207758" className="font-semibold text-rose-400 hover:underline">
              Ligue 800 207 758 (Grátis)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
