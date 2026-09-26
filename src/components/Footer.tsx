import React from 'react';

interface FooterProps {
  darkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ darkMode }) => {
  return (
    <footer 
      id="main-footer"
      className={`border-t text-xs py-12 transition-colors ${
        darkMode ? 'border-slate-800/80 bg-[#08080a] text-slate-500' : 'border-slate-200 bg-slate-100 text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        <p id="footer-disclaimer-text" className="leading-relaxed">
          * Oferta válida para compras elegíveis efetuadas por estudantes e docentes qualificados em Portugal. Sujeito aos Termos e Condições do programa Apple Educação. As datas de disponibilidade do iPhone Duo e restantes equipamentos podem sofrer alterações conforme o stock inicial.
        </p>
        <div className="border-t border-slate-800/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p id="footer-copyright-text">
            © 2026 Apple Inc. Todos os direitos reservados. Apoio ao Cliente: 800 207 758.
          </p>
          <div id="footer-legal-links" className="flex flex-wrap gap-6">
            <a id="footer-privacy-link" href="#" className="hover:underline hover:text-slate-300 transition">
              Política de Privacidade
            </a>
            <a id="footer-terms-link" href="#" className="hover:underline hover:text-slate-300 transition">
              Termos de Utilização
            </a>
            <a id="footer-refunds-link" href="#" className="hover:underline hover:text-slate-300 transition">
              Vendas e Reembolsos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
