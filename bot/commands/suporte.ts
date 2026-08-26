// ==========================================
// FOFOCA BOT - Comando Suporte
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { suporteKeyboard } from '../keyboards/suporte';

// ==========================================
// HANDLER DO COMANDO /suporte
// ==========================================

export const suporteCommand = async (ctx: Context) => {
  try {
    const user = ctx.from;

    logger.info(`📝 /suporte - Usuário: ${user?.id}`);

    const mensagem = [
      `🆘 *SUPORTE*`,
      ``,
      `Precisa de ajuda? Estamos aqui!`,
      ``,
      `Escolha uma opção abaixo:`,
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
      reply_markup: suporteKeyboard,
    });

    logger.info(`✅ /suporte enviado para ${user?.id}`);
  } catch (error) {
    logger.error('❌ Erro no comando /suporte:', error);
    
    await ctx.reply('❌ Ocorreu um erro ao exibir suporte. Tente novamente.');
  }
};

// ==========================================
// HANDLER DE FAQ
// ==========================================

export const faqSuporte = async (ctx: Context) => {
  try {
    const mensagem = [
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
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
    });
  } catch (error) {
    logger.error('❌ Erro ao exibir FAQ:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

// ==========================================
// HANDLER DE CONTATO
// ==========================================

export const contatoSuporte = async (ctx: Context) => {
  try {
    const mensagem = [
      `📞 *CONTATO*`,
      ``,
      `• E-mail: suporte@fofocabot.com`,
      `• Telegram: @suporte_fofoca`,
      ``,
      `Digite sua mensagem que responderemos em breve:`,
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
    });
  } catch (error) {
    logger.error('❌ Erro ao exibir contato:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

// ==========================================
// HANDLER DE REPORTAR PROBLEMA
// ==========================================

export const reportarProblema = async (ctx: Context) => {
  try {
    const mensagem = [
      `⚠️ *REPORTAR PROBLEMA*`,
      ``,
      `Descreva o problema que você está enfrentando:`,
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
    });
  } catch (error) {
    logger.error('❌ Erro ao reportar problema:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};
