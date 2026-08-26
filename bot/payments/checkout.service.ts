// ==========================================
// FOFOCA BOT - Serviço de Checkout
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';
import { mercadopagoClient } from './mercadopago/client';

// ==========================================
// CLASSE CHECKOUT SERVICE
// ==========================================

export class CheckoutService {
  // ==========================================
  // CRIAR CHECKOUT
  // ==========================================

  async criarCheckout(applicationId: number, amount: number) {
    try {
      // Verificar se application está aprovada
      const application = await database.postgres.query(
        'SELECT * FROM applications WHERE id = $1 AND approval_status = $2',
        [applicationId, 'APROVADO']
      );

      if (application.rows.length === 0) {
        return null;
      }

      // Criar link de pagamento
      const link = await mercadopagoClient.criarLinkPagamento(amount);

      return link;
    } catch (error) {
      logger.error('❌ Erro ao criar checkout:', error);
      return null;
    }
  }

  // ==========================================
  // OBTER URL DE PAGAMENTO
  // ==========================================

  async obterUrlPagamento(pagamentoId: number): Promise<string> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM payments WHERE id = $1',
        [pagamentoId]
      );

      const pagamento = resultado.rows[0];

      if (!pagamento) {
        return '';
      }

      return pagamento.payment_url || '';
    } catch (error) {
      logger.error('❌ Erro ao obter URL de pagamento:', error);
      return '';
    }
  }
}

export const checkoutService = new CheckoutService();
export default checkoutService;
