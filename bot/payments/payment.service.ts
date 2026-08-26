// ==========================================
// FOFOCA BOT - Serviço de Pagamento
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';
import { mercadopagoClient } from './mercadopago/client';
import { paymentStatus } from './payment-status';

// ==========================================
// TIPOS
// ==========================================

type Pagamento = {
  id: number;
  applicationId: number;
  externalPaymentId: string;
  status: string;
  amount: number;
  paidAt: Date | null;
};

// ==========================================
// CLASSE PAYMENT SERVICE
// ==========================================

export class PaymentService {
  // ==========================================
  // CRIAR PAGAMENTO
  // ==========================================

  async criar(applicationId: number, amount: number): Promise<Pagamento | null> {
    try {
      // Criar pagamento no Mercado Pago
      const pagamentoMP = await mercadopagoClient.criarPagamento(amount);

      if (!pagamentoMP) {
        return null;
      }

      // Salvar no banco
      const resultado = await database.postgres.query(
        `INSERT INTO payments (application_id, provider, external_payment_id, status, amount) 
         VALUES ($1, 'MERCADO_PAGO', $2, 'PENDENTE', $3) 
         RETURNING *`,
        [applicationId, pagamentoMP.id, amount]
      );

      logger.info(`✅ Pagamento criado: #${resultado.rows[0].id}`);
      return resultado.rows[0];
    } catch (error) {
      logger.error('❌ Erro ao criar pagamento:', error);
      return null;
    }
  }

  // ==========================================
  // OBTER PAGAMENTO POR ID
  // ==========================================

  async obterPorId(id: number): Promise<Pagamento | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM payments WHERE id = $1',
        [id]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      logger.error('❌ Erro ao obter pagamento:', error);
      return null;
    }
  }

  // ==========================================
  // OBTER PAGAMENTO POR APPLICATION
  // ==========================================

  async obterPorApplication(applicationId: number): Promise<Pagamento | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM payments WHERE application_id = $1 ORDER BY created_at DESC LIMIT 1',
        [applicationId]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      logger.error('❌ Erro ao obter pagamento:', error);
      return null;
    }
  }

  // ==========================================
  // ATUALIZAR STATUS
  // ==========================================

  async atualizarStatus(id: number, status: string): Promise<boolean> {
    try {
      await database.postgres.query(
        'UPDATE payments SET status = $2, updated_at = NOW() WHERE id = $1',
        [id, status]
      );
      return true;
    } catch (error) {
      logger.error('❌ Erro ao atualizar status do pagamento:', error);
      return false;
    }
  }

  // ==========================================
  // CONFIRMAR PAGAMENTO (WEBHOOK)
  // ==========================================

  async confirmarPagamento(externalPaymentId: string): Promise<boolean> {
    try {
      // Verificar status no Mercado Pago
      const statusMP = await mercadopagoClient.obterStatus(externalPaymentId);

      if (!statusMP) {
        return false;
      }

      // Mapear status
      const status = paymentStatus.mapear(statusMP);

      // Atualizar no banco
      const resultado = await database.postgres.query(
        `UPDATE payments 
         SET status = $2, paid_at = CASE WHEN $2 = 'APROVADO' THEN NOW() ELSE paid_at END 
         WHERE external_payment_id = $1 
         RETURNING *`,
        [externalPaymentId, status]
      );

      return resultado.rows.length > 0;
    } catch (error) {
      logger.error('❌ Erro ao confirmar pagamento:', error);
      return false;
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
