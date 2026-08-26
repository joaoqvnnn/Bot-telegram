// ==========================================
// FOFOCA BOT - Comando Start
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { principalKeyboard } from '../keyboards/principal';

// ==========================================
// HANDLER DO COMANDO /start
// ==========================================

export const startCommand = async (ctx: Context) => {
  try {
    const user = ctx.from;

    // Log do comando
    logger.info(`📝 /start - Usuário: ${user?.id} (@${user?.username || 'sem username'})`);

    // Dados do usuário
    const firstName = user?.first_name || 'Anunciante';
    const username = user?.username || '';

    // Mensagem de boas-vindas
    const mensagem = [
      `👋 Olá, ${firstName}!`,
      ``,
      `Bem-vindo ao *Fofoca Bot*!`,
      ``,
      `Aqui você pode anunciar sua empresa, Instagram, produto ou serviço.`,
      ``,
      `📢 *Como funciona:*`,
      `1️⃣ Você preenche um formulário rápido`,
      `2️⃣ Nós validamos seus dados`,
      `3️⃣ Você faz o pagamento via Mercado Pago`,
      `4️⃣ Sua publicidade é confirmada!`,
      ``,
      `Escolha uma opção abaixo:`,
    ].join('\n');

    // Enviar mensagem com teclado
    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
      reply_markup: principalKeyboard,
    });

    logger.info(`✅ /start enviado para ${user?.id}`);
  } catch (error) {
    logger.error('❌ Erro no comando /start:', error);
    
    await ctx.reply('❌ Ocorreu um erro ao iniciar. Tente novamente.');
  }
};

// ==========================================
// COMANDO /start COM PARÂMETRO
// ==========================================

export const startCommandWithParam = async (ctx: Context, param: string) => {
  try {
    switch (param) {
      case 'anunciar':
        await ctx.reply('📢 Vamos começar seu anúncio! Clique no botão abaixo:');
        await ctx.reply('👇 Escolha uma opção:', {
          reply_markup: principalKeyboard,
        });
        break;

      case 'suporte':
        await ctx.reply('🆘 Você precisa de suporte? Clique no botão abaixo:');
        await ctx.reply('👇 Escolha uma opção:', {
          reply_markup: principalKeyboard,
        });
        break;

      default:
        await startCommand(ctx);
        break;
    }
  } catch (error) {
    logger.error('❌ Erro no comando /start com parâmetro:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};
