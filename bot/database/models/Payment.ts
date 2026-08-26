// ==========================================
// FOFOCA BOT - Modelo Payment
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type Payment = {
  id: number;
  application_id: number;
  provider: string;
  external_payment_id: string;
  status: string;
  amount: number;
  paid_at: Date | null;
  created_at: Date;
};

// ==========================================
// MODELO PAYMENT
// ==========================================

export const PaymentModel = {
  async criar(dados: Partial<Payment>): Promise<Payment | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO payments (application_id, provider, external_payment_id, status, amount) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [dados.application_id, dados.provider, dados.external_payment_id, dados.status || 'PENDENTE', dados.amount]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar pagamento:', error);
      return null;
    }
  },

  async obterPorId(id: number): Promise<Payment | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM payments WHERE id = $1',
        [id]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter pagamento:', error);
      return null;
    }
  },

  async obterPorExternalId(externalId: string): Promise<Payment | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM payments WHERE external_payment_id = $1',
        [externalId]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter pagamento:', error);
      return null;
    }
  },

  async atualizarStatus(id: number, status: string): Promise<boolean> {
    try {
      await database.postgres.query(
        `UPDATE payments SET 
         status = $2, 
         paid_at = CASE WHEN $2 = 'APROVADO' THEN NOW() ELSE paid_at END 
         WHERE id = $1`,
        [id, status]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar status do pagamento:', error);
      return false;
    }
  },
};

export default PaymentModel;
