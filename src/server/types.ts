export interface CatalogoItem {
  id: string;
  nome: string;
  descricao: string;
  unidadeVenda: 'unidade' | 'hora' | 'pacote';
  precoUnitarioCentimos: number; // in cents (e.g. 134900 = 1.349,00 €)
  moeda: 'EUR';
  ativo: boolean;
  condicoes?: string;
}

export type EstadoProcessamento =
  | 'recebido'
  | 'em_analise'
  | 'necessita_revisao'
  | 'proposta_criada'
  | 'erro';

export interface InterpretacaoItem {
  catalogoId: string;
  quantidade: number | null;
  evidencia: string;
}

export interface InterpretacaoIA {
  resumo: string;
  itens: InterpretacaoItem[];
  prazoPedido: string | null;
  informacaoEmFalta: string[];
  necessitaRevisao: boolean;
  motivoRevisao: string | null;
}

export interface Pedido {
  id: string;
  nome: string;
  email: string;
  textoPedido: string;
  dataCriacao: string; // ISO String
  dataAtualizacao: string; // ISO String
  estadoProcessamento: EstadoProcessamento;
  interpretacaoIA: InterpretacaoIA | null;
  informacaoEmFalta: string[];
  motivoRevisao: string | null;
  propostaId: string | null;
  errosProcessamento: string[];
}

export interface PropostaItemSnapshot {
  catalogoId: string;
  nome: string;
  descricao: string;
  unidadeVenda: 'unidade' | 'hora' | 'pacote';
  precoUnitarioCentimos: number;
  quantidade: number;
  subtotalCentimos: number;
  condicoes?: string;
  evidencia?: string;
}

export type EstadoNotificacao =
  | 'por_enviar'
  | 'aceite_pelo_servico'
  | 'falhou'
  | 'nao_configurado';

export interface NotificacaoAluno {
  estado: EstadoNotificacao;
  resendId: string | null;
  dataTentativa: string | null;
  erro: string | null;
}

export interface Proposta {
  id: string;
  numero: string;
  pedidoId: string;
  token: string;
  dataCriacao: string;
  dataValidade: string; // 15 days from creation
  resumoAmbito: string;
  itens: PropostaItemSnapshot[];
  totalCentimos: number;
  condicoes: string[];
  linkProposta: string;
  notificacaoAluno: NotificacaoAluno;
  propostaDemonstracao: boolean;
}
