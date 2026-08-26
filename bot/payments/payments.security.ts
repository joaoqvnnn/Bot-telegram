// ==========================================
// FOFOCA BOT - Segurança de Pagamento
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// CLASSE PAYMENT SECURITY
// ==========================================

export class PaymentSecurity {
  // ==========================================
  // VERIFICAR SE PODE PAGAR
  // ==========================================

  async podePagar(applicationId: number): Promise<boolean> {
    try {
      // Verificar se application está aprovada
      const application = await database.postgres.query(
        'SELECT * FROM applications WHERE id = $1 AND approval_status = $2',
        [applicationId, 'APROVADO']
      );

      if (application.rows.length === 0) {
        return false;
      }

      // Verificar se já existe pagamento ativo
      const pagamento = await database.postgres.query(
        "SELECT * FROM payments WHERE application_id = $1 AND status IN ('PENDENTE', 'APROVADO')",
        [applicationId]
      );

      if (pagamento.rows.length > 0) {
        return false;
      }

      return true;
    } catch (error) {
      logger.error('❌ Erro ao verificar pagamento:', error);
      return false;
    }
  }

  // ==========================================
  // VERIFICAR VALOR
  // ==========================================

  async verificarValor(applicationId: number, valor: number): Promise<boolean> {
    try {
      const application = await database.postgres.query(
        'SELECT amount FROM applications WHERE id = $1',
        [applicationId]
      );

      const valorEsperado = application.rows[0]?.amount;

      return valor === valorEsperado;
    } catch (error) {
      logger.error('❌ Erro ao verificar valor:', error);
      return false;
    }
  }
}

export const paymentSecurity = new PaymentSecurity();
export default paymentSecurity;
