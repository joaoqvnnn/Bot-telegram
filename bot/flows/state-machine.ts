// ==========================================
// FOFOCA BOT - Máquina de Estados
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// TIPOS DA MÁQUINA DE ESTADOS
// ==========================================

export type State = string;

export type Transition = {
  de: State;
  para: State;
  condicao?: (dados: any) => boolean;
  acao?: (dados: any) => void;
};

export type StateMachineConfig = {
  estadoInicial: State;
  estados: State[];
  transicoes: Transition[];
};

// ==========================================
// CLASSE STATE MACHINE
// ==========================================

export class StateMachine {
  private estadoAtual: State;
  private estados: Set<State>;
  private transicoes: Transition[];
  private historico: State[] = [];

  // ==========================================
  // CONSTRUTOR
  // ==========================================

  constructor(config: StateMachineConfig) {
    this.estadoAtual = config.estadoInicial;
    this.estados = new Set(config.estados);
    this.transicoes = config.transicoes;
    this.historico = [config.estadoInicial];

    logger.info(`🤖 Máquina de estados criada. Estado inicial: ${config.estadoInicial}`);
  }

  // ==========================================
  // OBTER ESTADO ATUAL
  // ==========================================

  obterEstado(): State {
    return this.estadoAtual;
  }

  // ==========================================
  // OBTER HISTÓRICO
  // ==========================================

  obterHistorico(): State[] {
    return [...this.historico];
  }

  // ==========================================
  // VERIFICAR SE PODE TRANSICIONAR
  // ==========================================

  podeTransicionar(para: State, dados?: any): boolean {
    const transicao = this.transicoes.find(
      (t) => t.de === this.estadoAtual && t.para === para
    );

    if (!transicao) {
      return false;
    }

    if (transicao.condicao && !transicao.condicao(dados)) {
      return false;
    }

    return true;
  }

  // ==========================================
  // TRANSICIONAR PARA NOVO ESTADO
  // ==========================================

  transicionar(para: State, dados?: any): boolean {
    if (!this.estados.has(para)) {
      logger.error(`❌ Estado não existe: ${para}`);
      return false;
    }

    if (!this.podeTransicionar(para, dados)) {
      logger.warn(`⚠️ Transição não permitida: ${this.estadoAtual} -> ${para}`);
      return false;
    }

    const transicao = this.transicoes.find(
      (t) => t.de === this.estadoAtual && t.para === para
    );

    logger.info(`🔄 Transição: ${this.estadoAtual} -> ${para}`);

    if (transicao?.acao) {
      transicao.acao(dados);
    }

    this.estadoAtual = para;
    this.historico.push(para);

    return true;
  }

  // ==========================================
  // FORÇAR TRANSIÇÃO (IGNORAR REGRAS)
  // ==========================================

  forcarTransicao(para: State) {
    if (!this.estados.has(para)) {
      logger.error(`❌ Estado não existe: ${para}`);
      return false;
    }

    logger.info(`⚡ Transição forçada: ${this.estadoAtual} -> ${para}`);
    this.estadoAtual = para;
    this.historico.push(para);
    return true;
  }

  // ==========================================
  // VOLTAR PARA ESTADO ANTERIOR
  // ==========================================

  voltar(): boolean {
    if (this.historico.length <= 1) {
      logger.warn('⚠️ Não há estado anterior');
      return false;
    }

    this.historico.pop();
    this.estadoAtual = this.historico[this.historico.length - 1];
    logger.info(`⬅️ Voltando para: ${this.estadoAtual}`);
    return true;
  }

  // ==========================================
  // RESETAR MÁQUINA
  // ==========================================

  resetar() {
    const estadoInicial = this.historico[0];
    this.estadoAtual = estadoInicial;
    this.historico = [estadoInicial];
    logger.info(`🔄 Máquina resetada para: ${estadoInicial}`);
  }

  // ==========================================
  // OBTER TRANSIÇÕES DISPONÍVEIS
  // ==========================================

  obterTransicoesDisponiveis(dados?: any): State[] {
    return this.transicoes
      .filter((t) => t.de === this.estadoAtual)
      .filter((t) => !t.condicao || t.condicao(dados))
      .map((t) => t.para);
  }

  // ==========================================
  // VERIFICAR SE ESTÁ EM DETERMINADO ESTADO
  // ==========================================

  estaEm(estado: State): boolean {
    return this.estadoAtual === estado;
  }
}

// ==========================================
// ESTADOS DO FOFOCA BOT
// ==========================================

export const EstadosFluxo = {
  // Estados do formulário
  INICIO: 'INICIO',
  AGUARDANDO_EMPRESA: 'AGUARDANDO_EMPRESA',
  AGUARDANDO_INSTAGRAM: 'AGUARDANDO_INSTAGRAM',
  AGUARDANDO_EMAIL: 'AGUARDANDO_EMAIL',
  AGUARDANDO_TELEFONE: 'AGUARDANDO_TELEFONE',
  AGUARDANDO_FORMATO: 'AGUARDANDO_FORMATO',
  AGUARDANDO_DATA: 'AGUARDANDO_DATA',
  AGUARDANDO_DESCRICAO: 'AGUARDANDO_DESCRICAO',
  CONFIRMACAO: 'CONFIRMACAO',

  // Estados de aprovação
  VALIDANDO: 'VALIDANDO',
  ANALISANDO: 'ANALISANDO',
  APROVADO: 'APROVADO',
  RECUSADO: 'RECUSADO',
  EM_REVISAO: 'EM_REVISAO',

  // Estados de pagamento
  AGUARDANDO_PAGAMENTO: 'AGUARDANDO_PAGAMENTO',
  PAGAMENTO_APROVADO: 'PAGAMENTO_APROVADO',
  PAGAMENTO_RECUSADO: 'PAGAMENTO_RECUSADO',

  // Estados finais
  CONCLUIDO: 'CONCLUIDO',
  CANCELADO: 'CANCELADO',
};

// ==========================================
// TRANSIÇÕES PADRÃO
// ==========================================

export const transicoesPadrao: Transition[] = [
  // Fluxo do formulário
  { de: EstadosFluxo.INICIO, para: EstadosFluxo.AGUARDANDO_EMPRESA },
  { de: EstadosFluxo.AGUARDANDO_EMPRESA, para: EstadosFluxo.AGUARDANDO_INSTAGRAM },
  { de: EstadosFluxo.AGUARDANDO_INSTAGRAM, para: EstadosFluxo.AGUARDANDO_EMAIL },
  { de: EstadosFluxo.AGUARDANDO_EMAIL, para: EstadosFluxo.AGUARDANDO_TELEFONE },
  { de: EstadosFluxo.AGUARDANDO_TELEFONE, para: EstadosFluxo.AGUARDANDO_FORMATO },
  { de: EstadosFluxo.AGUARDANDO_FORMATO, para: EstadosFluxo.AGUARDANDO_DATA },
  { de: EstadosFluxo.AGUARDANDO_DATA, para: EstadosFluxo.AGUARDANDO_DESCRICAO },
  { de: EstadosFluxo.AGUARDANDO_DESCRICAO, para: EstadosFluxo.CONFIRMACAO },

  // Fluxo de aprovação
  { de: EstadosFluxo.CONFIRMACAO, para: EstadosFluxo.VALIDANDO },
  { de: EstadosFluxo.VALIDANDO, para: EstadosFluxo.ANALISANDO },
  { de: EstadosFluxo.ANALISANDO, para: EstadosFluxo.APROVADO },
  { de: EstadosFluxo.ANALISANDO, para: EstadosFluxo.RECUSADO },
  { de: EstadosFluxo.ANALISANDO, para: EstadosFluxo.EM_REVISAO },

  // Fluxo de pagamento
  { de: EstadosFluxo.APROVADO, para: EstadosFluxo.AGUARDANDO_PAGAMENTO },
  { de: EstadosFluxo.AGUARDANDO_PAGAMENTO, para: EstadosFluxo.PAGAMENTO_APROVADO },
  { de: EstadosFluxo.AGUARDANDO_PAGAMENTO, para: EstadosFluxo.PAGAMENTO_RECUSADO },

  // Fluxo final
  { de: EstadosFluxo.PAGAMENTO_APROVADO, para: EstadosFluxo.CONCLUIDO },
  { de: EstadosFluxo.RECUSADO, para: EstadosFluxo.CANCELADO },
  { de: EstadosFluxo.PAGAMENTO_RECUSADO, para: EstadosFluxo.CANCELADO },
];

// ==========================================
// INSTÂNCIA ÚNICA
// ==========================================

export const stateMachine = new StateMachine({
  estadoInicial: EstadosFluxo.INICIO,
  estados: Object.values(EstadosFluxo),
  transicoes: transicoesPadrao,
});

export default stateMachine;
