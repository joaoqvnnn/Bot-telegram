// ==========================================
// FOFOCA BOT - Renderizador de Status
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';

// ==========================================
// TIPOS DE STATUS
// ==========================================

export enum Status {
  PREENCHENDO = 'PREENCHENDO',
  VALIDANDO = 'VALIDANDO',
  ANALISANDO = 'ANALISANDO',
  APROVADO = 'APROVADO',
  RECUSADO = 'RECUSADO',
  REVISAO = 'REVISAO',
  PAGAMENTO_PENDENTE = 'PAGAMENTO_PENDENTE',
  PAGAMENTO_APROVADO = 'PAGAMENTO_APROVADO',
  PAGAMENTO_RECUSADO = 'PAGAMENTO_RECUSADO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
  ERRO = 'ERRO',
}

// ==========================================
// MAPA DE STATUS
// ==========================================

const statusMap = {
  [Status.PREENCHENDO]: {
    emoji: '🟡',
    texto: 'Preenchendo',
  },
  [Status.VALIDANDO]: {
    emoji: '🔍',
    texto: 'Validando',
  },
  [Status.ANALISANDO]: {
    emoji: '🤖',
    texto: 'Analisando',
  },
  [Status.APROVADO]: {
    emoji: '✅',
    texto: 'Aprovado',
  },
  [Status.RECUSADO]: {
    emoji: '❌',
    texto: 'Recusado',
  },
  [Status.REVISAO]: {
    emoji: '🟡',
    texto: 'Em revisão',
  },
  [Status.PAGAMENTO_PENDENTE]: {
    emoji: '⏳',
    texto: 'Pagamento pendente',
  },
  [Status.PAGAMENTO_APROVADO]: {
    emoji: '💳',
    texto: 'Pagamento aprovado',
  },
  [Status.PAGAMENTO_RECUSADO]: {
    emoji: '❌',
    texto: 'Pagamento recusado',
  },
  [Status.CONCLUIDO]: {
    emoji: '🎉',
    texto: 'Concluído',
  },
  [Status.CANCELADO]: {
    emoji: '🚫',
    texto: 'Cancelado',
  },
  [Status.ERRO]: {
    emoji: '⚠️',
    texto: 'Erro',
  },
};

// ==========================================
// CLASSE STATUS RENDERER
// ==========================================

export class StatusRenderer {
  private messageId: number | null = null;

  // ==========================================
  // RENDERIZAR STATUS
  // ==========================================

  async renderizar(ctx: Context, status: Status, detalhes?: string) {
    const info = statusMap[status];
    const emoji = info?.emoji || 'ℹ️';
    const texto = info?.texto || 'Status';

    const linhas = [
      `${emoji} *${texto.toUpperCase()}*`,
    ];

    if (detalhes) {
      linhas.push(``);
      linhas.push(detalhes);
    }

    const mensagem = linhas.join('\n');

    try {
      if (this.messageId) {
        await ctx.telegram.editMessageText(
          ctx.chat?.id || 0,
          this.messageId,
          undefined,
          mensagem,
          { parse_mode: 'Markdown' }
        );
      } else {
        const enviada = await ctx.reply(mensagem, { parse_mode: 'Markdown' });
        this.messageId = enviada.message_id;
      }
    } catch (error) {
      logger.error('❌ Erro ao renderizar status:', error);
    }

    return this;
  }

  // ==========================================
  // ATUALIZAR STATUS
  // ==========================================

  async atualizar(ctx: Context, status: Status, detalhes?: string) {
    return this.renderizar(ctx, status, detalhes);
  }

  // ==========================================
  // LIMPAR
  // ==========================================

  limpar() {
    this.messageId = null;
    return this;
  }
}

// ==========================================
// INSTÂNCIA ÚNICA
// ==========================================

export const statusRenderer = new StatusRenderer();

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

export async function enviarStatus(ctx: Context, status: Status, detalhes?: string) {
  const info = statusMap[status];
  const emoji = info?.emoji || 'ℹ️';
  const texto = info?.texto || 'Status';

  const mensagem = `${emoji} *${texto.toUpperCase()}*\n\n${detalhes || ''}`;

  await ctx.reply(mensagem, { parse_mode: 'Markdown' });
}

export default statusRenderer;
