// ==========================================
// FOFOCA BOT - Serviço de Inventário
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// CLASSE INVENTORY SERVICE
// ==========================================

export class InventoryService {
  // ==========================================
  // OBTER VAGAS DISPONÍVEIS
  // ==========================================

  async obterVagasDisponiveis(data: string): Promise<number> {
    try {
      const resultado = await database.postgres.query(
        `SELECT COUNT(*) as total FROM campaigns 
         WHERE data = $1 AND status IN ('ATIVA', 'AGENDADA')`,
        [data]
      );

      const total = parseInt(resultado.rows[0]?.total || '0');
      const limiteDiario = 10;

      return Math.max(0, limiteDiario - total);
    } catch (error) {
      logger.error('❌ Erro ao obter vagas:', error);
      return 0;
    }
  }

  // ==========================================
  // RESERVAR VAGA
  // ==========================================

  async reservarVaga(campanhaId: number, data: string): Promise<boolean> {
    try {
      const vagas = await this.obterVagasDisponiveis(data);

      if (vagas <= 0) {
        return false;
      }

      await database.postgres.query(
        'UPDATE campaigns SET status = $2 WHERE id = $1',
        [campanhaId, 'RESERVADA']
      );
      return true;
    } catch (error) {
      logger.error('❌ Erro ao reservar vaga:', error);
      return false;
    }
  }

  // ==========================================
  // LIBERAR VAGA
  // ==========================================

  async liberarVaga(campanhaId: number): Promise<boolean> {
    try {
      await database.postgres.query(
        'UPDATE campaigns SET status = $2 WHERE id = $1',
        [campanhaId, 'CANCELADA']
      );
      return true;
    } catch (error) {
      logger.error('❌ Erro ao liberar vaga:', error);
      return false;
    }
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;
