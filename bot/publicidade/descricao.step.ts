// ==========================================
// FOFOCA BOT - Step: Descrição
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { sessionManager } from '../../flows/session-manager';

// ==========================================
// STEP: DESCRIÇÃO
// ==========================================

export const descricaoStep = async (ctx: Context, dados?: any) => {
  try {
    const user = ctx.from;

    if (!user) {
      return;
    }

    // Se veio descrição da mensagem
    if (dados?.valor) {
      const descricao = dados.valor.trim();

      // Validar tamanho mínimo
      if (descricao.length < 10) {
        await ctx.reply('❌ A descrição é muito curta. Digite pelo menos 10 caracteres:');
        return;
      }

      // Validar tamanho máximo
      if (descricao.length > 500) {
        await ctx.reply('❌ A descrição é muito longa. Digite no máximo 500 caracteres:');
        return;
      }

      // Salvar na sessão
      await sessionManager.atualizarDados(user.id, { descricao });

      logger.info(`✅ Descrição salva (${descricao.length} caracteres)`);

      // Enviar confirmação
      await ctx.reply(`✅ *Descrição:* ${descricao}`, { parse_mode: 'Markdown' });

      // Avançar para confirmação
      await ctx.reply('📋 Vamos revisar seus dados:');
      await sessionManager.atualizarSessao(user.id, { stepAtual: 'confirmacao' });

      // Mostrar resumo
      await mostrarResumo(ctx);
    } else {
      // Perguntar descrição
      await ctx.reply(
        [
          `📝 Descreva brevemente o que será divulgado:`,
          ``,
          `• Mínimo: 10 caracteres`,
          `• Máximo: 500 caracteres`,
        ].join('\n')
      );
    }
  } catch (error) {
    logger.error('❌ Erro no step descrição:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

// ==========================================
// MOSTRAR RESUMO
// ==========================================

async function mostrarResumo(ctx: Context) {
  try {
    const user = ctx.from;

    if (!user) {
      return;
    }

    const sessao = await sessionManager.obterSessao(user.id);

    if (!sessao || !sessao.dados) {
      return;
    }

    const { dados } = sessao;

    const resumo = [
      `📋 *RESUMO DA SOLICITAÇÃO*`,
      ``,
      `🏢 *Empresa:* ${dados.empresa || 'N/A'}`,
      `📱 *Instagram:* @${dados.instagram || 'N/A'}`,
      `📧 *E-mail:* ${dados.email || 'N/A'}`,
      `📞 *Telefone:* ${dados.telefone || 'N/A'}`,
      `📱 *Formato:* ${dados.formatoNome || 'N/A'}`,
      `📅 *Data:* ${dados.data || 'N/A'}`,
      `📝 *Descrição:* ${dados.descricao || 'N/A'}`,
    ].join('\n');

    await ctx.reply(resumo, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ ENVIAR', callback_data: 'envio:confirmar' },
            { text: '✏️ EDITAR', callback_data: 'envio:editar' },
          ],
          [
            { text: '❌ CANCELAR', callback_data: 'publicidade:cancelar' },
          ],
        ],
      },
    });
  } catch (error) {
    logger.error('❌ Erro ao mostrar resumo:', error);
  }
}

export default descricaoStep;
