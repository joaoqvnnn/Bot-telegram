// ==========================================
// FOFOCA BOT - Serviço de Notificações Telegram
// ==========================================

import { Telegraf } from 'telegraf';
import { logger } from '../config/logger';
import { bot } from '../bot/bot';

// ==========================================
// TIPOS
// ==========================================

type Notificacao = {
  userId: number;
  mensagem: string;
  parseMode?: 'Markdown' | 'HTML';
  teclado?: any;
};

// ==========================================
// CLASSE TELEGRAM SERVICE
// ==========================================

export class TelegramService {
  // ==========================================
  // ENVIAR NOTIFICAÇÃO
  // ==========================================

  async enviar(notificacao: Notificacao): Promise<boolean> {
    try {
      await bot.telegram.sendMessage(
        notificacao.userId,
        notificacao.mensagem,
        {
          parse_mode: notificacao.parseMode || 'Markdown',
          reply_markup: notificacao.teclado,
        }
      );

      return true;
    } catch (error) {
      logger.error('❌ Erro ao enviar notificação:', error);
      return false;
    }
  }

  // ==========================================
  // NOTIFICAR APROVAÇÃO
  // ==========================================

  async notificarAprovacao(userId: number, dados: any) {
    const mensagem = [
      `✅ *SOLICITAÇÃO APROVADA!*`,
      ``,
      `Sua solicitação foi aprovada!`,
      ``,
      `📋 *Detalhes:*`,
      `• Empresa: ${dados.empresa}`,
      `• Formato: ${dados.formatoNome}`,
      `• Data: ${dados.data}`,
      ``,
      `Para confirmar, realize o pagamento:`,
    ].join('\n');

    return this.enviar({ userId, mensagem });
  }

  // ==========================================
  // NOTIFICAR REJEIÇÃO
  // ==========================================

  async notificarRejeicao(userId: number, motivo: string) {
    const mensagem = [
      `❌ *SOLICITAÇÃO RECUSADA*`,
      ``,
      `Infelizmente sua solicitação foi recusada.`,
      ``,
      `*Motivo:* ${motivo}`,
      ``,
      `Você pode tentar novamente com dados diferentes.`,
    ].join('\n');

    return this.enviar({ userId, mensagem });
  }

  // ==========================================
  // NOTIFICAR REVISÃO
  // ==========================================

  async notificarRevisao(userId: number) {
    const mensagem = [
      `🟡 *EM REVISÃO*`,
      ``,
      `Sua solicitação está em revisão manual.`,
      ``,
      `Um administrador irá analisar e você será notificado.`,
    ].join('\n');

    return this.enviar({ userId, mensagem });
  }

  // ==========================================
  // NOTIFICAR PAGAMENTO PENDENTE
  // ==========================================

  async notificarPagamentoPendente(userId: number, valor: number) {
    const mensagem = [
      `⏳ *PAGAMENTO PENDENTE*`,
      ``,
      `Valor: R$ ${valor.toFixed(2)}`,
      ``,
      `Realize o pagamento para confirmar sua publicidade.`,
    ].join('\n');

    return this.enviar({ userId, mensagem });
  }

  // ==========================================
  // NOTIFICAR PAGAMENTO CONFIRMADO
  // ==========================================

  async notificarPagamentoConfirmado(userId: number, dados: any) {
    const mensagem = [
      `🎉 *PAGAMENTO CONFIRMADO!*`,
      ``,
      `Sua publicidade está confirmada!`,
      ``,
      `📋 *Detalhes:*`,
      `• Empresa: ${dados.empresa}`,
      `• Formato: ${dados.formatoNome}`,
      `• Data: ${dados.data}`,
      ``,
      `Obrigado por anunciar conosco!`,
    ].join('\n');

    return this.enviar({ userId, mensagem });
  }
}

export const telegramService = new TelegramService();
export default telegramService;
