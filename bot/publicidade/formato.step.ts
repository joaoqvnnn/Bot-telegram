// ==========================================
// FOFOCA BOT - Step: Formato
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { sessionManager } from '../../flows/session-manager';

// ==========================================
// FORMATOS DISPONÍVEIS
// ==========================================

const FORMATOS = {
  story: {
    nome: '📱 Story',
    preco: 0,
    descricao: 'Publicação nos stories por 24 horas',
  },
  feed: {
    nome: '📝 Feed',
    preco: 0,
    descricao: 'Publicação no feed principal',
  },
  reels: {
    nome: '🎥 Reels',
    preco: 0,
    descricao: 'Vídeo no formato Reels',
  },
  pacote: {
    nome: '📦 Pacote',
    preco: 0,
    descricao: 'Story + Feed + Reels',
  },
};

// ==========================================
// STEP: FORMATO
// ==========================================

export const formatoStep = async (ctx: Context, dados?: any) => {
  try {
    const user = ctx.from;

    if (!user) {
      return;
    }

    // Se veio formato selecionado
    if (dados?.valor) {
      const formato = dados.valor;
      const formatoInfo = FORMATOS[formato as keyof typeof FORMATOS];

      if (!formatoInfo) {
        await ctx.reply('❌ Formato inválido. Escolha novamente:');
        await mostrarFormatos(ctx);
        return;
      }

      // Salvar na sessão
      await sessionManager.atualizarDados(user.id, {
        formato: formato,
        formatoNome: formatoInfo.nome,
        formatoPreco: formatoInfo.preco,
      });

      logger.info(`✅ Formato salvo: ${formato}`);

      // Enviar confirmação
      await ctx.reply(
        [
          `✅ *Formato:* ${formatoInfo.nome}`,
          `📝 *Descrição:* ${formatoInfo.descricao}`,
          `💰 *Preço:* R$ ${formatoInfo.preco.toFixed(2)}`,
        ].join('\n'),
        { parse_mode: 'Markdown' }
      );

      // Avançar para próximo step (data)
      await ctx.reply('📅 Agora, escolha a data desejada:');
      await sessionManager.atualizarSessao(user.id, { stepAtual: 'data' });

      // Mostrar datas disponíveis
      await mostrarDatas(ctx);
    } else {
      // Mostrar formatos
      await mostrarFormatos(ctx);
    }
  } catch (error) {
    logger.error('❌ Erro no step formato:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

// ==========================================
// MOSTRAR FORMATOS
// ==========================================

async function mostrarFormatos(ctx: Context) {
  await ctx.reply(
    [
      `Escolha o formato de publicidade:`,
      ``,
      `📱 *STORY* - R$ ${FORMATOS.story.preco.toFixed(2)}`,
      `📝 *FEED* - R$ ${FORMATOS.feed.preco.toFixed(2)}`,
      `🎥 *REELS* - R$ ${FORMATOS.reels.preco.toFixed(2)}`,
      `📦 *PACOTE* - R$ ${FORMATOS.pacote.preco.toFixed(2)}`,
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
          [
            { text: '⬅️ VOLTAR', callback_data: 'menu:principal' },
          ],
        ],
      },
    }
  );
}

// ==========================================
// MOSTRAR DATAS
// ==========================================

async function mostrarDatas(ctx: Context) {
  await ctx.reply(
    [
      `Escolha a data desejada:`,
      ``,
      `📅 Hoje`,
      `📅 Amanhã`,
      `📅 Esta semana`,
    ].join('\n'),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📅 HOJE', callback_data: 'data:hoje' },
            { text: '📅 AMANHÃ', callback_data: 'data:amanha' },
          ],
          [
            { text: '📅 ESTA SEMANA', callback_data: 'data:semana' },
          ],
          [
            { text: '⬅️ VOLTAR', callback_data: 'menu:principal' },
          ],
        ],
      },
    }
  );
}

export default formatoStep;
