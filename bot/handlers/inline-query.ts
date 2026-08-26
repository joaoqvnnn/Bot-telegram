// ==========================================
// FOFOCA BOT - Handler de Inline Query
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';

// ==========================================
// HANDLER DE INLINE QUERY
// ==========================================

export const inlineQueryHandler = async (ctx: Context) => {
  try {
    const inlineQuery = (ctx.inlineQuery as any);
    const query = inlineQuery?.query || '';
    const user = ctx.from;

    if (!user) {
      return;
    }

    logger.info(`🔍 Inline Query: "${query}" - Usuário: ${user.id}`);

    // Resultados para a inline query
    const resultados = [
      {
        type: 'article',
        id: 'anunciar',
        title: '📢 QUERO ANUNCIAR',
        description: 'Anunciar sua empresa no Fofoca Bot',
        input_message_content: {
          message_text: '📢 QUERO ANUNCIAR',
          parse_mode: 'Markdown',
        },
      },
      {
        type: 'article',
        id: 'valores',
        title: '💰 VALORES',
        description: 'Ver valores dos formatos de publicidade',
        input_message_content: {
          message_text: '💰 VALORES',
          parse_mode: 'Markdown',
        },
      },
      {
        type: 'article',
        id: 'pedidos',
        title: '📋 MEUS PEDIDOS',
        description: 'Acompanhar seus pedidos',
        input_message_content: {
          message_text: '📋 MEUS PEDIDOS',
          parse_mode: 'Markdown',
        },
      },
    ];

    // Filtrar resultados se houver query
    const resultadosFiltrados = query
      ? resultados.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        )
      : resultados;

    await ctx.answerInlineQuery(resultadosFiltrados, {
      cache_time: 30,
    });

    logger.info(`✅ Inline Query respondida para ${user.id}`);
  } catch (error) {
    logger.error('❌ Erro no handler de inline query:', error);
  }
};

// ==========================================
// HANDLER DE INLINE QUERY VAZIA
// ==========================================

export const inlineQueryVaziaHandler = async (ctx: Context) => {
  try {
    const user = ctx.from;

    if (!user) {
      return;
    }

    logger.info(`🔍 Inline Query vazia - Usuário: ${user.id}`);

    await ctx.answerInlineQuery([], {
      switch_pm_text: 'Abrir Fofoca Bot',
      switch_pm_parameter: 'start',
      cache_time: 30,
    });
  } catch (error) {
    logger.error('❌ Erro no handler de inline query vazia:', error);
  }
};
