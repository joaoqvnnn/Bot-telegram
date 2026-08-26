// ==========================================
// FOFOCA BOT - Status Pagamento Mercado Pago
// ==========================================

import { logger } from '../config/logger';
import { mercadopagoClient } from './client';

export const MP_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  IN_PROCESS: 'in_process',
  IN_MEDIATION: 'in_mediation',
  CHARGED_BACK: 'charged_back',
};

export async function checkPaymentStatus(paymentId: string) {
  try {
    const status = await mercadopagoClient.obterStatus(paymentId);

    if (!status) {
      return { sucesso: false, status: null };
    }

    return { sucesso: true, status };
  } catch (error) {
    logger.error('❌ Erro ao verificar status:', error);
    return { sucesso: false, status: null };
  }
}

export default checkPaymentStatus;
