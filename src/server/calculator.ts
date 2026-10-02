import crypto from 'crypto';
import type { CatalogoItem, InterpretacaoIA, Proposta, PropostaItemSnapshot } from './types.ts';

export interface CalculoResultado {
  podeGerarProposta: boolean;
  motivoInvalido?: string;
  itensSnapshot: PropostaItemSnapshot[];
  totalCentimos: number;
}

export function calcularPropostaBackend(
  interpretacao: InterpretacaoIA,
  catalogoAtivo: CatalogoItem[]
): CalculoResultado {
  // If the AI flagged that human review is needed, or if there are no items
  if (interpretacao.necessitaRevisao) {
    return {
      podeGerarProposta: false,
      motivoInvalido: interpretacao.motivoRevisao || 'Pedido assinalado para revisão pela IA.',
      itensSnapshot: [],
      totalCentimos: 0
    };
  }

  if (!interpretacao.itens || interpretacao.itens.length === 0) {
    return {
      podeGerarProposta: false,
      motivoInvalido: 'Nenhum item do catálogo foi identificado no pedido.',
      itensSnapshot: [],
      totalCentimos: 0
    };
  }

  const catalogoMap = new Map<string, CatalogoItem>();
  for (const c of catalogoAtivo) {
    if (c.ativo) {
      catalogoMap.set(c.id, c);
    }
  }

  const itensSnapshot: PropostaItemSnapshot[] = [];
  let totalCentimos = 0;

  for (const item of interpretacao.itens) {
    // 1. Verify item exists in active catalog
    const catItem = catalogoMap.get(item.catalogoId);
    if (!catItem) {
      return {
        podeGerarProposta: false,
        motivoInvalido: `O item '${item.catalogoId}' não existe no catálogo ativo oficial.`,
        itensSnapshot: [],
        totalCentimos: 0
      };
    }

    // 2. Verify quantity is valid and positive
    if (item.quantidade === null || item.quantidade === undefined || typeof item.quantidade !== 'number' || item.quantidade <= 0) {
      return {
        podeGerarProposta: false,
        motivoInvalido: `A quantidade para o item '${catItem.nome}' não está especificada ou é inválida.`,
        itensSnapshot: [],
        totalCentimos: 0
      };
    }

    const quantidade = Math.round(item.quantidade);
    const precoUnitarioCentimos = catItem.precoUnitarioCentimos;
    const subtotalCentimos = Math.round(quantidade * precoUnitarioCentimos);

    totalCentimos += subtotalCentimos;

    itensSnapshot.push({
      catalogoId: catItem.id,
      nome: catItem.nome,
      descricao: catItem.descricao,
      unidadeVenda: catItem.unidadeVenda,
      precoUnitarioCentimos,
      quantidade,
      subtotalCentimos,
      condicoes: catItem.condicoes || 'Condições padrão de fornecimento Apple Portugal.',
      evidencia: item.evidencia || ''
    });
  }

  return {
    podeGerarProposta: true,
    itensSnapshot,
    totalCentimos
  };
}

export function gerarTokenAleatorio(): string {
  // Long, cryptographically random, unpredictable token (48 chars hex)
  return crypto.randomBytes(24).toString('hex');
}

export function gerarNumeroProposta(): string {
  const ano = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const timeSlice = String(Date.now()).slice(-4);
  return `PROP-${ano}-${timeSlice}${randomSuffix}`;
}

export function criarObjetoProposta(
  pedidoId: string,
  resumoAmbito: string,
  calculo: CalculoResultado,
  baseUrl: string
): Proposta {
  const token = gerarTokenAleatorio();
  const numero = gerarNumeroProposta();
  const dataCriacao = new Date().toISOString();
  // Standard 15 days validity for demo/training exercise
  const validadeDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
  const dataValidade = validadeDate.toISOString();

  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const linkProposta = `${cleanBaseUrl}/proposta/${token}`;

  const condicoes = [
    'Preços apresentados em Euros (€), valores sem IVA.',
    'Garantia legal integral de 3 anos nos termos da Diretiva Europeia e DL n.º 84/2021 em Portugal.',
    'Validade da proposta de 15 dias a contar da data de emissão.',
    'Envio prioritário gratuito para Portugal Continental e Regiões Autónomas.',
    'Suporte técnico e assistência autorizada Apple Portugal: 800 207 758.'
  ];

  return {
    id: `prop_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    numero,
    pedidoId,
    token,
    dataCriacao,
    dataValidade,
    resumoAmbito,
    itens: calculo.itensSnapshot,
    totalCentimos: calculo.totalCentimos,
    condicoes,
    linkProposta,
    notificacaoAluno: {
      estado: 'por_enviar',
      resendId: null,
      dataTentativa: null,
      erro: null
    },
    propostaDemonstracao: true
  };
}

export function formatarEuros(centimos: number): string {
  const euros = centimos / 100;
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(euros);
}
