// ==========================================
// FOFOCA BOT - Step: Telefone
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { sessionManager } from '../../flows/session-manager';
import { validarTelefone } from '../../validation/phone.validator';
import { validarDuplicado } from '../../validation/duplicate.validator';

// ==========================================
// STEP: TELEFONE
// ==========================================

export const telefoneStep = async (ctx: Context, dados?: any) => {
  try {
    const user = ctx.from;

    if (!user) {
      return;
    }

    // Se veio valor da mensagem
    if (dados?.valor) {
      const telefone = dados.valor.trim();

      // Validar formato do telefone
      const valido = validarTelefone(telefone);

      if (!valido) {
        await ctx.reply('❌ Telefone inválido. Use o formato (11) 99999-9999. Digite novamente:');
        return;
      }

      // Verificar duplicidade
      const duplicado = await validarDuplicado('telefone', telefone);

      if (duplicado) {
        await ctx.reply('🔄 Este telefone já possui uma solicitação ativa. Use outro:');
        return;
      }

      // Normalizar telefone (remover formatação)
      const telefoneNormalizado = telefone.replace(/\D/g, '');

      // Salvar na sessão
      await sessionManager.atualizarDados(user.id, {
        telefone: telefoneNormalizado,
      });

      logger.info(`✅ Telefone salvo: ${telefoneNormalizado}`);

      // Enviar confirmação
      await ctx.reply(`✅ *Telefone:* ${telefone}`, { parse_mode: 'Markdown' });

      // Avançar para próximo step (formato)
      await ctx.reply('📱 Agora, escolha o formato de publicidade:');
      await sessionManager.atualizarSessao(user.id, { stepAtual: 'formato' });

      // Mostrar formatos disponíveis
      await mostrarFormatos(ctx);
    } else {
      // Perguntar telefone
      await ctx.reply('📞 Qual o telefone para contato? (Ex: (11) 99999-9999)');
    }
  } catch (error) {
    logger.error('❌ Erro no step telefone:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

// ==========================================
// MOSTRAR FORMATOS
// ==========================================

async function mostrarFormatos(ctx: Context) {
  await ctx.reply(
    [
      `📱 *STORY* - R$ XX,XX`,
      `📝 *FEED* - R$ XX,XX`,
      `🎥 *REELS* - R$ XX,XX`,
      `📦 *PACOTE* - R$ XX,XX`,
    ].join('\n'),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📱 STORY', callback_data: 'formato:story' },
            { text: '📝 FEED', callback_data: 'formato:feed' },
          ],
          [
            { text: '🎥 REELS', callback_data: 'formato:reels' },
            { text: '📦 PACOTE', callback_data: 'formato:pacote' },
          ],
        ],
      },
    }
  );
}

export default telefoneStep;
