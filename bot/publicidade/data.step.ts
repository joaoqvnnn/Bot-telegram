// ==========================================
// FOFOCA BOT - Step: Data
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { sessionManager } from '../../flows/session-manager';
import { validarData } from '../../validation/date.validator';
import { verificarDisponibilidade } from '../../advertising/availability.service';

// ==========================================
// STEP: DATA
// ==========================================

export const dataStep = async (ctx: Context, dados?: any) => {
  try {
    const user = ctx.from;

    if (!user) {
      return;
    }

    // Se veio data selecionada
    if (dados?.valor) {
      const dataSelecionada = dados.valor;

      // Validar data
      const valido = validarData(dataSelecionada);

      if (!valido) {
        await ctx.reply('❌ Data inválida. Escolha novamente:');
        await mostrarDatas(ctx);
        return;
      }

      // Verificar disponibilidade
      const disponivel = await verificarDisponibilidade(dataSelecionada);

      if (!disponivel) {
        await ctx.reply('❌ Esta data não está disponível. Escolha outra:');
        await mostrarDatas(ctx);
        return;
      }

      // Salvar na sessão
      await sessionManager.atualizarDados(user.id, {
        data: dataSelecionada,
      });

      logger.info(`✅ Data salva: ${dataSelecionada}`);

      // Enviar confirmação
      await ctx.reply(`✅ *Data:* ${dataSelecionada}`, { parse_mode: 'Markdown' });

      // Avançar para próximo step (descrição)
      await ctx.reply('📝 Agora, descreva brevemente o que será divulgado:');
      await sessionManager.atualizarSessao(user.id, { stepAtual: 'descricao' });
    } else {
      // Mostrar datas disponíveis
      await mostrarDatas(ctx);
    }
  } catch (error) {
    logger.error('❌ Erro no step data:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

// ==========================================
// MOSTRAR DATAS
// ==========================================

async function mostrarDatas(ctx: Context) {
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const hojeFormatado = formatarData(hoje);
  const amanhaFormatado = formatarData(amanha);

  await ctx.reply(
    [
      `📅 Escolha a data desejada:`,
      ``,
      `1️⃣ Hoje (${hojeFormatado})`,
      `2️⃣ Amanhã (${amanhaFormatado})`,
      ``,
      `Ou escolha uma data específica:`,
    ].join('\n'),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: `📅 HOJE (${hojeFormatado})`, callback_data: `data:${hojeFormatado}` },
          ],
          [
            { text: `📅 AMANHÃ (${amanhaFormatado})`, callback_data: `data:${amanhaFormatado}` },
          ],
          [
            { text: '📅 ESCOLHER OUTRA DATA', callback_data: 'data:escolher' },
          ],
          [
            { text: '⬅️ VOLTAR', callback_data: 'menu:principal' },
          ],
        ],
      },
    }
  );
}

export default dataStep;
