// ==========================================
// FOFOCA BOT - Comando Anunciar
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { publicidadeKeyboard } from '../keyboards/publicidade';

// ==========================================
// HANDLER DO COMANDO /anunciar
// ==========================================

export const anunciarCommand = async (ctx: Context) => {
  try {
    const user = ctx.from;

    logger.info(`📝 /anunciar - Usuário: ${user?.id}`);

    const mensagem = [
      `📢 *QUERO ANUNCIAR*`,
      ``,
      `Que ótimo! Vamos começar sua publicidade.`,
      ``,
      `Antes de continuar, veja os formatos disponíveis:`,
      ``,
      `📱 *STORY* - R$ XX,XX`,
      `📝 *FEED* - R$ XX,XX`,
      `🎥 *REELS* - R$ XX,XX`,
      `📦 *PACOTE* - R$ XX,XX`,
      ``,
      `Clique no botão abaixo para começar:`,
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
      reply_markup: publicidadeKeyboard,
    });

    logger.info(`✅ /anunciar enviado para ${user?.id}`);
  } catch (error) {
    logger.error('❌ Erro no comando /anunciar:', error);
    
    await ctx.reply('❌ Ocorreu um erro ao iniciar o anúncio. Tente novamente.');
  }
};

// ==========================================
// HANDLER DE INÍCIO DO FORMULÁRIO
// ==========================================

export const iniciarFormulario = async (ctx: Context) => {
  try {
    const user = ctx.from;

    logger.info(`📝 Iniciando formulário para ${user?.id}`);

    const mensagem = [
      `📋 *FORMULÁRIO DE PUBLICIDADE*`,
      ``,
      `Vamos preencher seus dados passo a passo.`,
      ``,
      `*Passo 1:* Nome da empresa`,
      ``,
      `Digite o nome da sua empresa:`,
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
    });

    logger.info(`✅ Formulário iniciado para ${user?.id}`);
  } catch (error) {
    logger.error('❌ Erro ao iniciar formulário:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};
