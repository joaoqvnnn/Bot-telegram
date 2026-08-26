// ==========================================
// FOFOCA BOT - Motor de Fluxos
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../config/logger';

// ==========================================
// TIPOS DO FLUXO
// ==========================================

export type StepHandler = (ctx: Context, data: any) => Promise<StepResult>;

export type StepResult = {
  proximoStep?: string;
  dados?: any;
  finalizar?: boolean;
  erro?: string;
};

export type FlowStep = {
  nome: string;
  handler: StepHandler;
};

export type FlowDefinition = {
  nome: string;
  steps: Record<string, FlowStep>;
  stepInicial: string;
};

// ==========================================
// CLASSE FLOW ENGINE
// ==========================================

export class FlowEngine {
  private flows: Map<string, FlowDefinition> = new Map();

  // ==========================================
  // REGISTRAR FLUXO
  // ==========================================

  registrar(flow: FlowDefinition) {
    this.flows.set(flow.nome, flow);
    logger.info(`✅ Fluxo registrado: ${flow.nome}`);
    return this;
  }

  // ==========================================
  // OBTER FLUXO
  // ==========================================

  obterFluxo(nome: string): FlowDefinition | undefined {
    return this.flows.get(nome);
  }

  // ==========================================
  // EXECUTAR STEP
  // ==========================================

  async executarStep(
    ctx: Context,
    flowNome: string,
    stepNome: string,
    dados: any = {}
  ): Promise<StepResult> {
    const flow = this.obterFluxo(flowNome);

    if (!flow) {
      logger.error(`❌ Fluxo não encontrado: ${flowNome}`);
      return { erro: 'Fluxo não encontrado' };
    }

    const step = flow.steps[stepNome];

    if (!step) {
      logger.error(`❌ Step não encontrado: ${stepNome}`);
      return { erro: 'Step não encontrado' };
    }

    try {
      logger.info(`🔄 Executando: ${flowNome}.${stepNome}`);
      const resultado = await step.handler(ctx, dados);
      return resultado;
    } catch (error) {
      logger.error(`❌ Erro ao executar step ${stepNome}:`, error);
      return { erro: 'Erro ao executar step' };
    }
  }

  // ==========================================
  // INICIAR FLUXO
  // ==========================================

  async iniciarFluxo(ctx: Context, flowNome: string, dados: any = {}) {
    const flow = this.obterFluxo(flowNome);

    if (!flow) {
      logger.error(`❌ Fluxo não encontrado: ${flowNome}`);
      return;
    }

    logger.info(`🚀 Iniciando fluxo: ${flowNome}`);
    const resultado = await this.executarStep(ctx, flowNome, flow.stepInicial, dados);
    return resultado;
  }

  // ==========================================
  // AVANÇAR PARA PRÓXIMO STEP
  // ==========================================

  async avancar(
    ctx: Context,
    flowNome: string,
    resultado: StepResult,
    dados: any = {}
  ) {
    if (resultado.finalizar) {
      logger.info(`✅ Fluxo finalizado: ${flowNome}`);
      return;
    }

    if (resultado.proximoStep) {
      await this.executarStep(ctx, flowNome, resultado.proximoStep, {
        ...dados,
        ...resultado.dados,
      });
    }
  }

  // ==========================================
  // LISTAR FLUXOS
  // ==========================================

  listarFluxos(): string[] {
    return Array.from(this.flows.keys());
  }

  // ==========================================
  // LIMPAR FLUXOS
  // ==========================================

  limpar() {
    this.flows.clear();
    return this;
  }
}

// ==========================================
// INSTÂNCIA ÚNICA
// ==========================================

export const flowEngine = new FlowEngine();

export default flowEngine;
