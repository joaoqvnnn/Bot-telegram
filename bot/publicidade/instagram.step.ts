// ==========================================
// FOFOCA BOT - Step: Instagram
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { sessionManager } from '../../flows/session-manager';
import { validarInstagram } from '../../validation/instagram.validator';
import { validarDuplicado } from '../../validation/duplicate.validator';

// ==========================================
// STEP: INSTAGRAM
// ==========================================

export const instagramStep = async (ctx: Context, dados?: any) => {
  try {
    const user = ctx.from;

    if (!user) {
      return;
    }

    // Se veio valor da mensagem
    if (dados?.valor) {
      const instagram = dados.valor.trim();

      // Validar formato do Instagram
      const valido = validarInstagram(instagram);

      if (!valido) {
        await ctx.reply('❌ Instagram inválido. Use o formato @usuario ou usuario. Digite novamente:');
        return;
      }

      // Verificar duplicidade
      const duplicado = await validarDuplicado('instagram', instagram);

      if (duplicado) {
        await ctx.reply('🔄 Este Instagram já possui uma solicitação ativa. Use outro:');
        return;
      }

      // Normalizar Instagram (remover @ se tiver)
      const instagramNormalizado = instagram.replace('@', '');

      // Salvar na sessão
      await sessionManager.atualizarDados(user.id, {
        instagram: instagramNormalizado,
      });

      logger.info(`✅ Instagram salvo: @${instagramNormalizado}`);

      // Enviar confirmação
      await ctx.reply(`✅ *Instagram:* @${instagramNormalizado}`, { parse_mode: 'Markdown' });

      // Avançar para próximo step
      await ctx.reply('📧 Agora, digite o e-mail para contato:');
      await sessionManager.atualizarSessao(user.id, { stepAtual: 'email' });
    } else {
      // Perguntar Instagram
      await ctx.reply('📱 Qual o Instagram da empresa? (Ex: @empresa)');
    }
  } catch (error) {
    logger.error('❌ Erro no step instagram:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

export default instagramStep;
