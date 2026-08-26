// ==========================================
// FOFOCA BOT - Serviço de Agendamento
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// CLASSE SCHEDULING SERVICE
// ==========================================

export class SchedulingService {
  // ==========================================
  // AGENDAR CAMPANHA
  // ==========================================

  async agendar(campanhaId: number, data: string): Promise<boolean> {
    try {
      await database.postgres.query(
        'UPDATE campaigns SET data = $2, status = $3 WHERE id = $1',
        [campanhaId, data, 'AGENDADA']
      );
      return true;
    } catch (error) {
      logger.error('❌ Erro ao agendar campanha:', error);
      return false;
    }
  }

  // ==========================================
  // OBTER CAMPANHAS DO DIA
  // ==========================================

  async obterDoDia(data: string) {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM campaigns WHERE data = $1',
        [data]
      );
      return resultado.rows;
    } catch (error) {
      logger.error('❌ Erro ao obter campanhas do dia:', error);
      return [];
    }
  }
}

export const schedulingService = new SchedulingService();
export default schedulingService;
