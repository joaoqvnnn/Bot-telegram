// ==========================================
// FOFOCA BOT - Obter Pagamento Mercado Pago
// ==========================================

import { logger } from '../config/logger';
import { mercadopagoClient } from './client';

export async function getPayment(paymentId: string) {
  try {
    logger.info(`🔍 Buscando pagamento ${paymentId}`);

    const detalhes = await mercadopagoClient.obterDetalhes(paymentId);

    if (!detalhes) {
      return { sucesso: false, erro: 'Pagamento não encontrado' };
    }

    return { sucesso: true, pagamento: detalhes };
  } catch (error) {
    logger.error('❌ Erro ao buscar pagamento:', error);
    return { sucesso: false, erro: 'Erro ao buscar pagamento' };
  }
}

export default getPayment;
