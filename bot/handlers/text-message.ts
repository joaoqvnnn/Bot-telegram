// ==========================================
// FOFOCA BOT - Handler de Mensagens de Texto
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';

// ==========================================
// IMPORTAÇÃO DE FLUXOS
// ==========================================

import { publicidadeFlow } from '../../flows/publicidade/publicidade.flow';
import { suporteFlow } from '../../flows/suporte/suporte.flow';

// ==========================================
// IMPORTAÇÃO DE SERVIÇOS
// ==========================================

import { sessionManager } from '../../flows/session-manager';
import { flowEngine } from '../../flows/flow-engine';

// ==========================================
// HANDLER PRINCIPAL DE MENSAGENS DE TEXTO
// ==========================================

export const textMessageHandler = async (ctx: Context) => {
  try {
    const message = (ctx.message as any)?.text;
    const user = ctx.from;

    if (!message || !user) {
      return;
    }

    logger.info(`💬 Mensagem: "${message}" - Usuário: ${user.id}`);

    // Verificar se é um comando
    if (message.startsWith('/')) {
      return; // Comandos são tratados em outro handler
    }

    // Verificar se o usuário tem uma sessão ativa
    const session = await sessionManager.obterSessao(user.id);

    if (session) {
      // Usuário está em um fluxo ativo
      await processarMensagemDoFluxo(ctx, session, message);
    } else {
      // Usuário não está em um fluxo
      await processarMensagemLivre(ctx, message);
    }
  } catch (error) {
    logger.error('❌ Erro no handler de mensagem:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

// ==========================================
// PROCESSAR MENSAGEM DO FLUXO
// ==========================================

async function processarMensagemDoFluxo(ctx: Context, session: any, message: string) {
  try {
    const userId = ctx.from?.id;
    const flowAtual = session.flowAtual;
    const stepAtual = session.stepAtual;

    logger.info(`🔄 Fluxo: ${flowAtual}, Step: ${stepAtual}`);

    switch (flowAtual) {
      case 'publicidade':
        await publicidadeFlow.processarMensagem(ctx, message, session);
        break;

      case 'suporte':
        await suporteFlow.processarMensagem(ctx, message, session);
        break;

      default:
        logger.warn(`⚠️ Fluxo não reconhecido: ${flowAtual}`);
        await sessionManager.limparSessao(userId);
        await ctx.reply('⚠️ Sua sessão expirou. Use /start para recomeçar.');
        break;
    }
  } catch (error) {
    logger.error('❌ Erro ao processar mensagem do fluxo:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
}

// ==========================================
// PROCESSAR MENSAGEM LIVRE
// ==========================================

async function processarMensagemLivre(ctx: Context, message: string) {
  try {
    // Verificar se a mensagem corresponde a algum comando de texto
    const mensagemLower = message.toLowerCase();

    switch (mensagemLower) {
      case 'menu':
      case 'inicio':
      case 'começar':
      case 'comecar':
        await ctx.reply('🏠 Menu principal:');
        break;

      case 'anunciar':
      case 'quero anunciar':
        await ctx.reply('📢 Vamos começar seu anúncio!');
        await publicidadeFlow.iniciar(ctx);
        break;

      case 'pedidos':
      case 'meus pedidos':
        await ctx.reply('📋 Seus pedidos:');
        break;

      case 'valores':
      case 'preços':
      case 'precos':
        await ctx.reply('💰 Valores dos formatos:');
        break;

      case 'suporte':
      case 'ajuda':
      case 'help':
        await ctx.reply('🆘 Suporte:');
        break;

      default:
        // Mensagem não reconhecida
        await ctx.reply('🤔 Não entendi. Use os botões abaixo ou digite /start:');
        break;
    }
  } catch (error) {
    logger.error('❌ Erro ao processar mensagem livre:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
}

// ==========================================
// HANDLER DE CANCELAMENTO
// ==========================================

export const cancelarFluxo = async (ctx: Context) => {
  try {
    const user = ctx.from;
    
    if (user) {
      await sessionManager.limparSessao(user.id);
      logger.info(`🛑 Fluxo cancelado pelo usuário ${user.id}`);
    }

    await ctx.reply('✅ Operação cancelada. Use /start para recomeçar.');
  } catch (error) {
    logger.error('❌ Erro ao cancelar fluxo:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

// ==========================================
// HANDLER DE TIMEOUT
// ==========================================

export const timeoutHandler = async (ctx: Context) => {
  try {
    const user = ctx.from;
    
    if (user) {
      await sessionManager.limparSessao(user.id);
      logger.info(`⏰ Sessão expirada para ${user.id}`);
    }

    await ctx.reply('⏰ Sua sessão expirou. Use /start para recomeçar.');
  } catch (error) {
    logger.error('❌ Erro ao processar timeout:', error);
  }
};
