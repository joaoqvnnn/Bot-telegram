// ==========================================
// FOFOCA BOT - Criar Pagamento Mercado Pago
// ==========================================

import { logger } from '../config/logger';
import { mercadopagoClient } from './client';

export async function createPayment(amount: number, dados?: any) {
  try {
    logger.info(`💳 Criando pagamento de R$ ${amount.toFixed(2)}`);

    const pagamento = await mercadopagoClient.criarPagamento(amount);

    if (!pagamento) {
      return { sucesso: false, erro: 'Erro ao criar pagamento' };
    }

    return { sucesso: true, id: pagamento.id, url: pagamento.url };
  } catch (error) {
    logger.error('❌ Erro ao criar pagamento:', error);
    return { sucesso: false, erro: 'Erro ao criar pagamento' };
  }
}

export default createPayment;
