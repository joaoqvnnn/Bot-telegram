// ==========================================
// FOFOCA BOT - Renderizador de Progresso
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';

// ==========================================
// CLASSE PROGRESS RENDERER
// ==========================================

export class ProgressRenderer {
  private messageId: number | null = null;

  // ==========================================
  // INICIAR PROGRESSO
  // ==========================================

  async iniciar(ctx: Context, totalEtapas: number) {
    const texto = this.gerarBarra(0, totalEtapas);
    const mensagem = await ctx.reply(texto, { parse_mode: 'Markdown' });
    this.messageId = mensagem.message_id;
    return this;
  }

  // ==========================================
  // ATUALIZAR PROGRESSO
  // ==========================================

  async atualizar(ctx: Context, etapaAtual: number, totalEtapas: number, mensagem?: string) {
    if (!this.messageId) {
      return this.iniciar(ctx, totalEtapas);
    }

    const texto = this.gerarBarra(etapaAtual, totalEtapas, mensagem);

    try {
      await ctx.telegram.editMessageText(
        ctx.chat?.id || 0,
        this.messageId,
        undefined,
        texto,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      logger.error('❌ Erro ao atualizar progresso:', error);
    }

    return this;
  }

  // ==========================================
  // CONCLUIR PROGRESSO
  // ==========================================

  async concluir(ctx: Context, totalEtapas: number) {
    if (this.messageId) {
      const texto = [
        `✅ *CONCLUÍDO!*`,
        ``,
        `[██████████] 100%`,
        ``,
        `Todas as etapas foram concluídas.`,
      ].join('\n');

      try {
        await ctx.telegram.editMessageText(
          ctx.chat?.id || 0,
          this.messageId,
          undefined,
          texto,
          { parse_mode: 'Markdown' }
        );
      } catch (error) {
        logger.error('❌ Erro ao concluir progresso:', error);
      }
    }

    this.messageId = null;
    return this;
  }

  // ==========================================
  // GERAR BARRA DE PROGRESSO
  // ==========================================

  private gerarBarra(etapaAtual: number, totalEtapas: number, mensagem?: string) {
    const porcentagem = Math.round((etapaAtual / totalEtapas) * 100);
    const blocosPreenchidos = Math.round(porcentagem / 10);
    const blocosVazios = 10 - blocosPreenchidos;
    const barra = '█'.repeat(blocosPreenchidos) + '░'.repeat(blocosVazios);

    const linhas = [
      `📊 *PROGRESSO*`,
      ``,
      `[${barra}] ${porcentagem}%`,
      ``,
      `Etapa ${etapaAtual} de ${totalEtapas}`,
    ];

    if (mensagem) {
      linhas.push(``);
      linhas.push(mensagem);
    }

    return linhas.join('\n');
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

export const progressRenderer = new ProgressRenderer();

export default progressRenderer;
