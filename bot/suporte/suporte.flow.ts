// ==========================================
// FOFOCA BOT - Fluxo de Suporte
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { sessionManager } from '../../flows/session-manager';
import { flowEngine } from '../../flows/flow-engine';

// ==========================================
// NOME DO FLUXO
// ==========================================

const FLOW_NOME = 'suporte';

// ==========================================
// DEFINIÇÃO DO FLUXO
// ==========================================

const suporteFlowDefinition = {
  nome: FLOW_NOME,
  stepInicial: 'inicio',
  steps: {
    inicio: {
      nome: 'inicio',
      handler: inicioStep,
    },
    faq: {
      nome: 'faq',
      handler: faqStep,
    },
    contato: {
      nome: 'contato',
      handler: contatoStep,
    },
    problema: {
      nome: 'problema',
      handler: problemaStep,
    },
  },
};

// ==========================================
// STEP: INÍCIO
// ==========================================

async function inicioStep(ctx: Context) {
  try {
    await ctx.reply(
      [
        `🆘 *SUPORTE*`,
        ``,
        `Como podemos ajudar?`,
      ].join('\n'),
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '❓ PERGUNTAS FREQUENTES', callback_data: 'suporte:faq' },
            ],
            [
              { text: '📞 CONTATO', callback_data: 'suporte:contato' },
              { text: '⚠️ REPORTAR PROBLEMA', callback_data: 'suporte:problema' },
            ],
            [
              { text: '⬅️ VOLTAR', callback_data: 'menu:principal' },
            ],
          ],
        },
      }
    );
  } catch (error) {
    logger.error('❌ Erro no step início:', error);
  }
}

// ==========================================
// STEP: FAQ
// ==========================================

async function faqStep(ctx: Context) {
  try {
    await ctx.reply(
      [
        `❓ *PERGUNTAS FREQUENTES*`,
        ``,
        `1️⃣ *Como anunciar?*`,
        `Use /anunciar e siga o formulário.`,
        ``,
        `2️⃣ *Quais formatos disponíveis?*`,
        `Story, Feed, Reels e Pacote completo.`,
        ``,
        `3️⃣ *Como funciona o pagamento?*`,
        `Via Mercado Pago, após aprovação.`,
        ``,
        `4️⃣ *Prazo de aprovação?*`,
        `Geralmente em até 24 horas.`,
        ``,
        `5️⃣ *Posso cancelar?*`,
        `Sim, antes do pagamento.`,
      ].join('\n'),
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '⬅️ VOLTAR', callback_data: 'suporte:inicio' },
            ],
          ],
        },
      }
    );
  } catch (error) {
    logger.error('❌ Erro no step FAQ:', error);
  }
}

// ==========================================
// STEP: CONTATO
// ==========================================

async function contatoStep(ctx: Context) {
  try {
    await ctx.reply(
      [
        `📞 *CONTATO*`,
        ``,
        `• E-mail: suporte@fofocabot.com`,
        `• Telegram: @suporte_fofoca`,
        ``,
        `Digite sua mensagem que responderemos em breve:`,
      ].join('\n'),
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '⬅️ VOLTAR', callback_data: 'suporte:inicio' },
            ],
          ],
        },
      }
    );

    const user = ctx.from;
    if (user) {
      await sessionManager.criarSessao(user.id, FLOW_NOME, 'contato');
    }
  } catch (error) {
    logger.error('❌ Erro no step contato:', error);
  }
}

// ==========================================
// STEP: PROBLEMA
// ==========================================

async function problemaStep(ctx: Context) {
  try {
    await ctx.reply(
      [
        `⚠️ *REPORTAR PROBLEMA*`,
        ``,
        `Descreva o problema que você está enfrentando:`,
      ].join('\n'),
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '⬅️ VOLTAR', callback_data: 'suporte:inicio' },
            ],
          ],
        },
      }
    );

    const user = ctx.from;
    if (user) {
      await sessionManager.criarSessao(user.id, FLOW_NOME, 'problema');
    }
  } catch (error) {
    logger.error('❌ Erro no step problema:', error);
  }
}

// ==========================================
// CLASSE DO FLUXO DE SUPORTE
// ==========================================

export class SuporteFlow {
  // ==========================================
  // INICIAR FLUXO
  // ==========================================

  async iniciar(ctx: Context) {
    try {
      const user = ctx.from;

      if (!user) {
        return;
      }

      logger.info(`🚀 Iniciando fluxo de suporte para ${user.id}`);

      await flowEngine.executarStep(ctx, FLOW_NOME, 'inicio');
    } catch (error) {
      logger.error('❌ Erro ao iniciar fluxo de suporte:', error);
      await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
    }
  }

  // ==========================================
  // HANDLE CALLBACK
  // ==========================================

  async handleCallback(ctx: Context, action: string) {
    try {
      switch (action) {
        case 'inicio':
          await flowEngine.executarStep(ctx, FLOW_NOME, 'inicio');
          break;

        case 'faq':
          await flowEngine.executarStep(ctx, FLOW_NOME, 'faq');
          break;

        case 'contato':
          await flowEngine.executarStep(ctx, FLOW_NOME, 'contato');
          break;

        case 'problema':
          await flowEngine.executarStep(ctx, FLOW_NOME, 'problema');
          break;

        default:
          logger.warn(`⚠️ Callback de suporte não reconhecido: ${action}`);
          break;
      }
    } catch (error) {
      logger.error('❌ Erro no callback de suporte:', error);
    }
  }

  // ==========================================
  // PROCESSAR MENSAGEM
  // ==========================================

  async processarMensagem(ctx: Context, mensagem: string, sessao: any) {
    try {
      const stepAtual = sessao.stepAtual;

      logger.info(`🔄 Processando mensagem de suporte no step: ${stepAtual}`);

      switch (stepAtual) {
        case 'contato':
          await ctx.reply('✅ Mensagem recebida! Nossa equipe responderá em breve.');
          await sessionManager.limparSessao(ctx.from?.id || 0);
          break;

        case 'problema':
          await ctx.reply('✅ Problema reportado! Nossa equipe irá analisar.');
          await sessionManager.limparSessao(ctx.from?.id || 0);
          break;

        default:
          logger.warn(`⚠️ Step de suporte não processa mensagem: ${stepAtual}`);
          break;
      }
    } catch (error) {
      logger.error('❌ Erro ao processar mensagem de suporte:', error);
    }
  }
}

// ==========================================
// REGISTRAR FLUXO NO ENGINE
// ==========================================

flowEngine.registrar(suporteFlowDefinition);

// ==========================================
// INSTÂNCIA ÚNICA
// ==========================================

export const suporteFlow = new SuporteFlow();

export default suporteFlow;
