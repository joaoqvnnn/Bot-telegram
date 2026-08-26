// ==========================================
// FOFOCA BOT - Comando Pedidos
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { pedidosKeyboard } from '../keyboards/pedidos';

// ==========================================
// HANDLER DO COMANDO /pedidos
// ==========================================

export const pedidosCommand = async (ctx: Context) => {
  try {
    const user = ctx.from;

    logger.info(`📝 /pedidos - Usuário: ${user?.id}`);

    const mensagem = [
      `📋 *MEUS PEDIDOS*`,
      ``,
      `Aqui você pode acompanhar seus pedidos.`,
      ``,
      `Escolha uma opção:`,
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
      reply_markup: pedidosKeyboard,
    });

    logger.info(`✅ /pedidos enviado para ${user?.id}`);
  } catch (error) {
    logger.error('❌ Erro no comando /pedidos:', error);
    
    await ctx.reply('❌ Ocorreu um erro ao exibir pedidos. Tente novamente.');
  }
};

// ==========================================
// HANDLER DE PEDIDOS ATIVOS
// ==========================================

export const pedidosAtivos = async (ctx: Context) => {
  try {
    const user = ctx.from;

    logger.info(`📝 Pedidos ativos - Usuário: ${user?.id}`);

    const mensagem = [
      `📋 *PEDIDOS ATIVOS*`,
      ``,
      `Você não possui pedidos ativos no momento.`,
      ``,
      `Para criar um novo pedido, use /anunciar`,
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
    });
  } catch (error) {
    logger.error('❌ Erro ao exibir pedidos ativos:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

// ==========================================
// HANDLER DE HISTÓRICO
// ==========================================

export const historicoPedidos = async (ctx: Context) => {
  try {
    const user = ctx.from;

    logger.info(`📝 Histórico de pedidos - Usuário: ${user?.id}`);

    const mensagem = [
      `📋 *HISTÓRICO DE PEDIDOS*`,
      ``,
      `Você não possui histórico de pedidos.`,
      ``,
      `Para criar seu primeiro pedido, use /anunciar`,
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
    });
  } catch (error) {
    logger.error('❌ Erro ao exibir histórico:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};
