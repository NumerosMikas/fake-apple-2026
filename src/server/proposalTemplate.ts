import type { Proposta } from './types.ts';
import { formatarEuros } from './calculator.ts';

function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderPropostaHtml(proposta: Proposta): string {
  const dataCriacaoFmt = new Date(proposta.dataCriacao).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const dataValidadeFmt = new Date(proposta.dataValidade).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const totalFormatado = formatarEuros(proposta.totalCentimos);

  const linhasTabela = proposta.itens
    .map(
      (item, idx) => `
      <tr class="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
        <td class="py-4 px-4 text-xs font-mono text-slate-400 text-center">${idx + 1}</td>
        <td class="py-4 px-4">
          <div class="font-bold text-sm text-slate-900 dark:text-slate-100">${escapeHtml(item.nome)}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${escapeHtml(item.descricao)}</div>
          ${
            item.condicoes
              ? `<div class="text-[11px] text-rose-700 dark:text-rose-400 mt-1 font-mono">${escapeHtml(item.condicoes)}</div>`
              : ''
          }
        </td>
        <td class="py-4 px-4 text-center">
          <span class="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 capitalize">${escapeHtml(item.unidadeVenda)}</span>
        </td>
        <td class="py-4 px-4 text-center">
          <span class="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-xs">
            ${item.quantidade}
          </span>
        </td>
        <td class="py-4 px-4 text-right font-mono text-sm text-slate-700 dark:text-slate-300">
          ${formatarEuros(item.precoUnitarioCentimos)}
        </td>
        <td class="py-4 px-4 text-right font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
          ${formatarEuros(item.subtotalCentimos)}
        </td>
      </tr>
    `
    )
    .join('');

  const condicoesHtml = (proposta.condicoes || [])
    .map(
      (c) => `
      <li class="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <span class="text-rose-600 dark:text-rose-400 font-bold">•</span>
        <span>${escapeHtml(c)}</span>
      </li>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="pt-PT" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Proposta Comercial Oficial — ${escapeHtml(proposta.numero)} | Apple Portugal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            appleDark: '#0a0a0c',
            appleCard: '#121318',
            burgundy: {
              400: '#e05375',
              500: '#c5284f',
              600: '#9d173b',
              800: '#5c0f24',
              900: '#380614',
            }
          },
          fontFamily: {
            sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
            mono: ['"SF Mono"', 'Menlo', 'Monaco', 'Courier New', 'monospace']
          }
        }
      }
    }
  </script>
  <style>
    @media print {
      body { background: #ffffff !important; color: #000000 !important; }
      .no-print { display: none !important; }
      .print-shadow-none { box-shadow: none !important; border: 1px solid #cccccc !important; }
    }
  </style>
</head>
<body class="bg-slate-100 dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 min-h-screen py-8 px-4 sm:px-6 transition-colors duration-200">

  <!-- Top Navigation & Controls Bar -->
  <div class="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print">
    <a href="/" class="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
      <span>&larr; Voltar à Página Principal</span>
    </a>
    <div class="flex items-center gap-3">
      <button onclick="toggleTheme()" class="px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer">
        Alternar Tema 🌓
      </button>
      <button onclick="window.print()" class="px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold hover:opacity-90 transition cursor-pointer shadow">
        Imprimir / Guardar PDF
      </button>
    </div>
  </div>

  <!-- Educational Demonstration Notice Banner -->
  <div class="max-w-4xl mx-auto mb-6 p-3.5 rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between gap-3 no-print">
    <div class="flex items-center gap-2">
      <span class="text-base">🎓</span>
      <span><strong>Ambiente de Formação:</strong> Esta proposta comercial foi interpretada por Inteligência Artificial e calculada pelo catálogo da aplicação para efeitos de aprendizagem.</span>
    </div>
    <span class="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-200 dark:bg-amber-900/40 px-2 py-0.5 rounded">Demonstração</span>
  </div>

  <!-- Main Proposal Document Container -->
  <div class="max-w-4xl mx-auto bg-white dark:bg-[#121318] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl overflow-hidden print-shadow-none">
    
    <!-- Document Header -->
    <div class="bg-gradient-to-r from-rose-950 via-burgundy-950 to-slate-950 text-white p-6 sm:p-10 border-b border-slate-200 dark:border-white/10">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2.5 mb-2">
            <span class="text-3xl"></span>
            <span class="font-bold text-xl tracking-tight">Apple Portugal</span>
            <span class="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">Oficial</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Proposta Comercial</h1>
          <p class="text-xs text-rose-300 font-mono mt-1">Lançamento de Equipamentos & Soluções 2026</p>
        </div>
        <div class="sm:text-right bg-white/5 sm:bg-transparent p-4 sm:p-0 rounded-xl border border-white/10 sm:border-none">
          <div class="text-xs text-slate-400 font-mono uppercase tracking-wider">N.º da Proposta</div>
          <div class="text-xl font-bold font-mono text-white">${escapeHtml(proposta.numero)}</div>
          <div class="text-xs text-slate-300 mt-2">
            <div>Emissão: <strong class="text-white">${dataCriacaoFmt}</strong></div>
            <div>Validade: <strong class="text-rose-300">${dataValidadeFmt}</strong></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scope Summary Card -->
    <div class="p-6 sm:p-10 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20">
      <div class="text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold mb-2">
        Resumo do Âmbito do Pedido
      </div>
      <p class="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
        ${escapeHtml(proposta.resumoAmbito)}
      </p>
    </div>

    <!-- Items Table -->
    <div class="p-6 sm:p-10 overflow-x-auto">
      <div class="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-4">
        Discriminação de Produtos e Serviços
      </div>
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr class="border-b-2 border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th class="py-3 px-4 text-center w-12">#</th>
            <th class="py-3 px-4">Designação / Especificações</th>
            <th class="py-3 px-4 text-center">Unidade</th>
            <th class="py-3 px-4 text-center">Qtd.</th>
            <th class="py-3 px-4 text-right">Preço Unitário</th>
            <th class="py-3 px-4 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${linhasTabela}
        </tbody>
      </table>
    </div>

    <!-- Total Highlight Box -->
    <div class="p-6 sm:p-10 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div class="text-xs text-slate-500 dark:text-slate-400 max-w-md">
        <p>• Valores calculados automaticamente através do catálogo comercial de preços.</p>
        <p>• Isenção / liquidação de IVA apurada no momento da faturação final.</p>
      </div>
      <div class="sm:text-right p-5 rounded-2xl bg-white dark:bg-[#121318] border border-slate-200 dark:border-slate-800 shadow-sm">
        <span class="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Total sem IVA</span>
        <span class="block text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 tracking-tight font-mono mt-1">
          ${totalFormatado}
        </span>
        <span class="block text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Moeda: EUR (€) • Preço final sem IVA</span>
      </div>
    </div>

    <!-- Applicable Conditions & Support -->
    <div class="p-6 sm:p-10 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 class="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-3">
          Termos e Condições Comerciais
        </h4>
        <ul class="space-y-2">
          ${condicoesHtml}
        </ul>
      </div>

      <div class="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-900/30">
        <h4 class="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-2">
          Apoio e Esclarecimento de Dúvidas
        </h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          Para aprovar esta proposta, esclarecer dúvidas de configuração ou agendar uma reunião técnica com um especialista Apple Portugal:
        </p>
        <div class="space-y-2 text-xs">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900 dark:text-slate-100">Telefone Gratuito:</span>
            <a href="tel:800207758" class="font-mono text-rose-600 dark:text-rose-400 font-bold hover:underline">800 207 758</a>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900 dark:text-slate-100">Reunião 1:1 (Cal.com):</span>
            <a href="https://app.cal.com/miguelds/30min" target="_blank" rel="noopener noreferrer" class="text-rose-600 dark:text-rose-400 hover:underline">cal.com/miguelds/30min</a>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900 dark:text-slate-100">Garantia:</span>
            <span class="text-slate-600 dark:text-slate-400">3 anos de cobertura legal em Portugal</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Footer -->
    <div class="bg-slate-100 dark:bg-[#08080a] p-4 text-center text-[11px] text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800">
      Documento gerado eletronicamente • Apple Portugal 2026 • Ref. Pedido: ${escapeHtml(proposta.pedidoId)}
    </div>

  </div>

  <script>
    function toggleTheme() {
      const html = document.documentElement;
      html.classList.toggle('dark');
    }
  </script>
</body>
</html>`;
}

export function renderPropostaErroHtml(mensagem: string): string {
  return `<!DOCTYPE html>
<html lang="pt-PT" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Proposta Não Encontrada | Apple Portugal</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-6">
  <div class="max-w-md w-full bg-white dark:bg-[#121318] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-xl">
    <div class="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center text-2xl font-bold mb-4">
      ✕
    </div>
    <h1 class="text-xl font-bold mb-2">Proposta Indisponível</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
      ${escapeHtml(mensagem)}
    </p>
    <a href="/" class="inline-block px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition">
      Voltar à Página Principal
    </a>
  </div>
</body>
</html>`;
}
