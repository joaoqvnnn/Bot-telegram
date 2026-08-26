// ==========================================
// FOFOCA BOT - Modelo PaymentEvent
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type PaymentEvent = {
  id: number;
  payment_id: number;
  event_type: string;
  event_data: any;
  created_at: Date;
};

// ==========================================
// MODELO PAYMENT EVENT
// ==========================================

export const PaymentEventModel = {
  async criar(dados: Partial<PaymentEvent>): Promise<PaymentEvent | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO payment_events (payment_id, event_type, event_data) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [dados.payment_id, dados.event_type, JSON.stringify(dados.event_data || {})]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar evento de pagamento:', error);
      return null;
    }
  },

  async obterPorPayment(paymentId: number): Promise<PaymentEvent[]> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM payment_events WHERE payment_id = $1 ORDER BY created_at DESC',
        [paymentId]
      );
      return resultado.rows;
    } catch (error) {
      console.error('❌ Erro ao obter eventos:', error);
      return [];
    }
  },
};

export default PaymentEventModel;
