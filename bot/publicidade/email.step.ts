// ==========================================
// FOFOCA BOT - Step: E-mail
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { sessionManager } from '../../flows/session-manager';
import { validarEmail } from '../../validation/email.validator';
import { validarDuplicado } from '../../validation/duplicate.validator';

// ==========================================
// STEP: E-MAIL
// ==========================================

export const emailStep = async (ctx: Context, dados?: any) => {
  try {
    const user = ctx.from;

    if (!user) {
      return;
    }

    // Se veio valor da mensagem
    if (dados?.valor) {
      const email = dados.valor.trim().toLowerCase();

      // Validar formato do e-mail
      const valido = validarEmail(email);

      if (!valido) {
        await ctx.reply('❌ E-mail inválido. Use o formato exemplo@dominio.com. Digite novamente:');
        return;
      }

      // Verificar duplicidade
      const duplicado = await validarDuplicado('email', email);

      if (duplicado) {
        await ctx.reply('🔄 Este e-mail já possui uma solicitação ativa. Use outro:');
        return;
      }

      // Salvar na sessão
      await sessionManager.atualizarDados(user.id, { email });

      logger.info(`✅ E-mail salvo: ${email}`);

      // Enviar confirmação
      await ctx.reply(`✅ *E-mail:* ${email}`, { parse_mode: 'Markdown' });

      // Avançar para próximo step
      await ctx.reply('📞 Agora, digite o telefone para contato:');
      await sessionManager.atualizarSessao(user.id, { stepAtual: 'telefone' });
    } else {
      // Perguntar e-mail
      await ctx.reply('📧 Qual o e-mail para contato?');
    }
  } catch (error) {
    logger.error('❌ Erro no step email:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

export default emailStep;
