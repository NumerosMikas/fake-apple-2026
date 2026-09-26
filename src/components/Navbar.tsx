import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenReservation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenReservation
}) => {
  return (
    <>
      {/* Top Banner / Announcement */}
      <div 
        id="top-announcement-banner"
        className="bg-gradient-to-r from-rose-950 via-purple-900 to-slate-900 text-xs text-slate-200 py-2.5 px-4 text-center font-medium border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">
            Lançamento em Portugal
          </span>
          <span>Disponível a partir de 18/09. Reserve já o seu dispositivo de nova geração.</span>
          <button 
            id="banner-reserve-btn"
            onClick={onOpenReservation}
            className="underline font-semibold hover:text-white transition inline-flex items-center gap-1 cursor-pointer"
          >
            Reservar &rarr;
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <header 
        id="main-navigation-header"
        className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-200 ${
          darkMode ? 'bg-[#0a0a0c]/85 border-slate-800/80' : 'bg-white/85 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a id="brand-logo-link" href="#" className="font-bold text-xl tracking-tight flex items-center gap-2">
              <span className="text-2xl"></span>
              <span className="bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 bg-clip-text text-transparent">Apple</span>
              <span className="text-xs text-slate-400 font-mono">PT</span>
            </a>
            <nav id="desktop-nav-links" className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
              <a id="nav-hero-link" href="#hero" className="hover:text-slate-100 transition">iPhone 18 Pro</a>
              <a id="nav-personas-link" href="#personas" className="hover:text-slate-100 transition">Para Quem É</a>
              <a id="nav-features-link" href="#features" className="hover:text-slate-100 transition">Inovações</a>
              <a id="nav-faq-link" href="#faq" className="hover:text-slate-100 transition">Perguntas Frequentes</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button 
              id="theme-toggle-btn"
              onClick={onToggleDarkMode}
              className={`p-2 rounded-full border transition cursor-pointer ${
                darkMode 
                  ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/60' 
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-black hover:bg-slate-200'
              }`}
              aria-label="Alternar Modo Escuro"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button 
              id="header-reserve-now-btn"
              onClick={onOpenReservation}
              className="bg-slate-100 text-slate-950 hover:bg-white font-semibold text-sm px-4 py-2 rounded-full transition shadow-lg shadow-white/5 cursor-pointer"
            >
              Reservar Agora
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
