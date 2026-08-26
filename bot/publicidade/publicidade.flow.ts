// ==========================================
// FOFOCA BOT - Fluxo de Publicidade
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { sessionManager } from '../../flows/session-manager';
import { flowEngine } from '../../flows/flow-engine';

// ==========================================
// IMPORTAÇÃO DOS STEPS
// ==========================================

import { empresaStep } from './empresa.step';
import { instagramStep } from './instagram.step';
import { emailStep } from './email.step';
import { telefoneStep } from './telefone.step';
import { formatoStep } from './formato.step';
import { dataStep } from './data.step';
import { descricaoStep } from './descricao.step';
import { confirmacaoStep } from './confirmacao.step';

// ==========================================
// NOME DO FLUXO
// ==========================================

const FLOW_NOME = 'publicidade';

// ==========================================
// DEFINIÇÃO DO FLUXO
// ==========================================

const publicidadeFlowDefinition = {
  nome: FLOW_NOME,
  stepInicial: 'empresa',
  steps: {
    empresa: {
      nome: 'empresa',
      handler: empresaStep,
    },
    instagram: {
      nome: 'instagram',
      handler: instagramStep,
    },
    email: {
      nome: 'email',
      handler: emailStep,
    },
    telefone: {
      nome: 'telefone',
      handler: telefoneStep,
    },
    formato: {
      nome: 'formato',
      handler: formatoStep,
    },
    data: {
      nome: 'data',
      handler: dataStep,
    },
    descricao: {
      nome: 'descricao',
      handler: descricaoStep,
    },
    confirmacao: {
      nome: 'confirmacao',
      handler: confirmacaoStep,
    },
  },
};

// ==========================================
// CLASSE DO FLUXO DE PUBLICIDADE
// ==========================================

export class PublicidadeFlow {
  // ==========================================
  // INICIAR FLUXO
  // ==========================================

  async iniciar(ctx: Context) {
    try {
      const user = ctx.from;

      if (!user) {
        return;
      }

      logger.info(`🚀 Iniciando fluxo de publicidade para ${user.id}`);

      // Verificar se já existe sessão ativa
      const sessaoExistente = await sessionManager.obterSessao(user.id);

      if (sessaoExistente) {
        await ctx.reply('🔄 Você já possui uma solicitação em andamento. Continue de onde parou:');
        
        const stepAtual = sessaoExistente.stepAtual;
        await this.resumir(ctx, stepAtual);
        return;
      }

      // Criar nova sessão
      await sessionManager.criarSessao(user.id, FLOW_NOME, 'empresa');

      // Iniciar primeiro step
      await flowEngine.executarStep(ctx, FLOW_NOME, 'empresa');
    } catch (error) {
      logger.error('❌ Erro ao iniciar fluxo:', error);
      await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
    }
  }

  // ==========================================
  // RESUMIR FLUXO
  // ==========================================

  async resumir(ctx: Context, stepAtual: string) {
    try {
      await flowEngine.executarStep(ctx, FLOW_NOME, stepAtual);
    } catch (error) {
      logger.error('❌ Erro ao resumir fluxo:', error);
      await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
    }
  }

  // ==========================================
  // PROCESSAR MENSAGEM
  // ==========================================

  async processarMensagem(ctx: Context, mensagem: string, sessao: any) {
    try {
      const stepAtual = sessao.stepAtual;

      logger.info(`🔄 Processando mensagem no step: ${stepAtual}`);

      switch (stepAtual) {
        case 'empresa':
          await empresaStep(ctx, { valor: mensagem });
          break;

        case 'instagram':
          await instagramStep(ctx, { valor: mensagem });
          break;

        case 'email':
          await emailStep(ctx, { valor: mensagem });
          break;

        case 'telefone':
          await telefoneStep(ctx, { valor: mensagem });
          break;

        case 'descricao':
          await descricaoStep(ctx, { valor: mensagem });
          break;

        default:
          logger.warn(`⚠️ Step não processa mensagem: ${stepAtual}`);
          break;
      }
    } catch (error) {
      logger.error('❌ Erro ao processar mensagem:', error);
      await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
    }
  }

  // ==========================================
  // HANDLE CALLBACK
  // ==========================================

  async handleCallback(ctx: Context, action: string) {
    try {
      switch (action) {
        case 'iniciar':
          await this.iniciar(ctx);
          break;

        case 'comecar':
          await ctx.reply('📝 Vamos começar! Digite o nome da sua empresa:');
          await sessionManager.atualizarSessao(ctx.from?.id || 0, { stepAtual: 'empresa' });
          break;

        case 'voltar':
          await this.cancelar(ctx);
          break;

        default:
          logger.warn(`⚠️ Callback não reconhecido: ${action}`);
          break;
      }
    } catch (error) {
      logger.error('❌ Erro no callback:', error);
    }
  }

  // ==========================================
  // HANDLE FORMATO
  // ==========================================

  async handleFormato(ctx: Context, action: string) {
    try {
      const user = ctx.from;

      if (!user) {
        return;
      }

      const formatos = {
        story: '📱 Story',
        feed: '📝 Feed',
        reels: '🎥 Reels',
        pacote: '📦 Pacote Completo',
      };

      if (action in formatos) {
        await sessionManager.atualizarDados(user.id, {
          formato: action,
          formatoNome: formatos[action as keyof typeof formatos],
        });

        await ctx.reply(`✅ Formato selecionado: ${formatos[action as keyof typeof formatos]}`);
        await flowEngine.executarStep(ctx, FLOW_NOME, 'data');
      }
    } catch (error) {
      logger.error('❌ Erro ao selecionar formato:', error);
    }
  }

  // ==========================================
  // HANDLE DATA
  // ==========================================

  async handleData(ctx: Context, action: string) {
    try {
      const user = ctx.from;

      if (!user) {
        return;
      }

      await sessionManager.atualizarDados(user.id, { data: action });
      await ctx.reply(`✅ Data selecionada: ${action}`);
      await flowEngine.executarStep(ctx, FLOW_NOME, 'descricao');
    } catch (error) {
      logger.error('❌ Erro ao selecionar data:', error);
    }
  }

  // ==========================================
  // CANCELAR FLUXO
  // ==========================================

  async cancelar(ctx: Context) {
    try {
      const user = ctx.from;

      if (user) {
        await sessionManager.limparSessao(user.id);
      }

      await ctx.reply('✅ Solicitação cancelada. Use /start para recomeçar.');
    } catch (error) {
      logger.error('❌ Erro ao cancelar fluxo:', error);
    }
  }
}

// ==========================================
// REGISTRAR FLUXO NO ENGINE
// ==========================================

flowEngine.registrar(publicidadeFlowDefinition);

// ==========================================
// INSTÂNCIA ÚNICA
// ==========================================

export const publicidadeFlow = new PublicidadeFlow();

export default publicidadeFlow;
