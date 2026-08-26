// ==========================================
// FOFOCA BOT - Comando Ajuda
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { principalKeyboard } from '../keyboards/principal';

// ==========================================
// HANDLER DO COMANDO /ajuda
// ==========================================

export const ajudaCommand = async (ctx: Context) => {
  try {
    const user = ctx.from;

    logger.info(`📝 /ajuda - Usuário: ${user?.id}`);

    const mensagem = [
      `❓ *Como funciona o Fofoca Bot*`,
      ``,
      `📢 *Para anunciar:*`,
      `1️⃣ Clique em "QUERO ANUNCIAR"`,
      `2️⃣ Preencha os dados da sua empresa`,
      `3️⃣ Informe seu Instagram`,
      `4️⃣ Escolha o formato de publicidade`,
      `5️⃣ Selecione a data desejada`,
      `6️⃣ Aguarde a aprovação`,
      `7️⃣ Pague via Mercado Pago`,
      `8️⃣ Pronto! Publicidade confirmada!`,
      ``,
      `💰 *Valores:*`,
      `Use /valores para ver os preços`,
      ``,
      `📋 *Meus pedidos:*`,
      `Use /pedidos para acompanhar`,
      ``,
      `👤 *Minha conta:*`,
      `Use /conta para ver seus dados`,
      ``,
      `🆘 *Suporte:*`,
      `Use /suporte para falar conosco`,
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
      reply_markup: principalKeyboard,
    });

    logger.info(`✅ /ajuda enviado para ${user?.id}`);
  } catch (error) {
    logger.error('❌ Erro no comando /ajuda:', error);
    
    await ctx.reply('❌ Ocorreu um erro ao exibir ajuda. Tente novamente.');
  }
};
