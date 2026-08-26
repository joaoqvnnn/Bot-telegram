// ==========================================
// FOFOCA BOT - Status de Pagamento
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// STATUS DE PAGAMENTO
// ==========================================

export enum StatusPagamento {
  PENDENTE = 'PENDENTE',
  APROVADO = 'APROVADO',
  RECUSADO = 'RECUSADO',
  CANCELADO = 'CANCELADO',
  REEMBOLSADO = 'REEMBOLSADO',
}

// ==========================================
// CLASSE PAYMENT STATUS
// ==========================================

export class PaymentStatus {
  // ==========================================
  // MAPEAR STATUS DO MERCADO PAGO
  // ==========================================

  mapear(statusMP: string): StatusPagamento {
    const mapa: Record<string, StatusPagamento> = {
      approved: StatusPagamento.APROVADO,
      pending: StatusPagamento.PENDENTE,
      rejected: StatusPagamento.RECUSADO,
      cancelled: StatusPagamento.CANCELADO,
      refunded: StatusPagamento.REEMBOLSADO,
    };

    return mapa[statusMP] || StatusPagamento.PENDENTE;
  }

  // ==========================================
  // VERIFICAR SE ESTÁ PAGO
  // ==========================================

  estaPago(status: string): boolean {
    return status === StatusPagamento.APROVADO;
  }

  // ==========================================
  // OBTER EMOJI DO STATUS
  // ==========================================

  obterEmoji(status: string): string {
    const emojis: Record<string, string> = {
      [StatusPagamento.PENDENTE]: '⏳',
      [StatusPagamento.APROVADO]: '✅',
      [StatusPagamento.RECUSADO]: '❌',
      [StatusPagamento.CANCELADO]: '🚫',
      [StatusPagamento.REEMBOLSADO]: '💸',
    };

    return emojis[status] || 'ℹ️';
  }
}

export const paymentStatus = new PaymentStatus();
export default paymentStatus;
