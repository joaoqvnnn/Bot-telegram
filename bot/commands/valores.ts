// ==========================================
// FOFOCA BOT - Comando Valores
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { valoresKeyboard } from '../keyboards/valores';

// ==========================================
// HANDLER DO COMANDO /valores
// ==========================================

export const valoresCommand = async (ctx: Context) => {
  try {
    const user = ctx.from;

    logger.info(`📝 /valores - Usuário: ${user?.id}`);

    const mensagem = [
      `💰 *VALORES*`,
      ``,
      `Confira nossos preços:`,
      ``,
      `📱 *STORY*`,
      `• Valor: R$ XX,XX`,
      `• Duração: 24 horas`,
      ``,
      `📝 *FEED*`,
      `• Valor: R$ XX,XX`,
      `• Duração: Permanente`,
      ``,
      `🎥 *REELS*`,
      `• Valor: R$ XX,XX`,
      `• Duração: Permanente`,
      ``,
      `📦 *PACOTE COMPLETO*`,
      `• Story + Feed + Reels`,
      `• Valor: R$ XX,XX`,
      `• Duração: 24 horas + permanentes`,
      ``,
      `Clique abaixo para anunciar:`,
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
      reply_markup: valoresKeyboard,
    });

    logger.info(`✅ /valores enviado para ${user?.id}`);
  } catch (error) {
    logger.error('❌ Erro no comando /valores:', error);
    
    await ctx.reply('❌ Ocorreu um erro ao exibir valores. Tente novamente.');
  }
};

// ==========================================
// HANDLER DE DETALHES DE FORMATO
// ==========================================

export const detalhesFormato = async (ctx: Context, formato: string) => {
  try {
    const user = ctx.from;

    logger.info(`📝 Detalhes do formato ${formato} - Usuário: ${user?.id}`);

    let mensagem = '';

    switch (formato) {
      case 'story':
        mensagem = [
          `📱 *STORY*`,
          ``,
          `• Publicação nos stories`,
          `• Duração: 24 horas`,
          `• Inclui link de redirecionamento`,
          `• Valor: R$ XX,XX`,
          ``,
          `_*Disponibilidade:* Seg a Sex_`,
        ].join('\n');
        break;

      case 'feed':
        mensagem = [
          `📝 *FEED*`,
          ``,
          `• Publicação no feed principal`,
          `• Duração: Permanente`,
          `• Inclui legenda personalizada`,
          `• Valor: R$ XX,XX`,
          ``,
          `_*Disponibilidade:* Seg a Sex_`,
        ].join('\n');
        break;

      case 'reels':
        mensagem = [
          `🎥 *REELS*`,
          ``,
          `• Vídeo no formato Reels`,
          `• Duração: Permanente`,
          `• Inclui edição básica`,
          `• Valor: R$ XX,XX`,
          ``,
          `_*Disponibilidade:* Seg a Sex_`,
        ].join('\n');
        break;

      case 'pacote':
        mensagem = [
          `📦 *PACOTE COMPLETO*`,
          ``,
          `• Story (24h) + Feed + Reels`,
          `• Máximo alcance`,
          `• Valor promocional: R$ XX,XX`,
          ``,
          `_*Disponibilidade:* Seg a Sex_`,
        ].join('\n');
        break;

      default:
        mensagem = '❌ Formato não encontrado.';
        break;
    }

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
    });
  } catch (error) {
    logger.error('❌ Erro ao exibir detalhes do formato:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};
