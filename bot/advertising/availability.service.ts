// ==========================================
// FOFOCA BOT - Serviço de Disponibilidade
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// CLASSE AVAILABILITY SERVICE
// ==========================================

export class AvailabilityService {
  // ==========================================
  // VERIFICAR DISPONIBILIDADE
  // ==========================================

  async verificar(data: string, formato: string): Promise<boolean> {
    try {
      // Verificar se a data está disponível
      const resultado = await database.postgres.query(
        `SELECT COUNT(*) as total FROM campaigns 
         WHERE data = $1 AND formato = $2 AND status = 'ATIVA'`,
        [data, formato]
      );

      const total = parseInt(resultado.rows[0]?.total || '0');

      // Limite por dia (ex: 10 campanhas por dia)
      const limiteDiario = 10;

      return total < limiteDiario;
    } catch (error) {
      logger.error('❌ Erro ao verificar disponibilidade:', error);
      return false;
    }
  }

  // ==========================================
  // OBTER DATAS DISPONÍVEIS
  // ==========================================

  async obterDatasDisponiveis(formato: string, dias: number = 7): Promise<string[]> {
    const datas: string[] = [];
    const hoje = new Date();

    for (let i = 0; i < dias; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() + i);

      const dataFormatada = data.toISOString().split('T')[0];
      const disponivel = await this.verificar(dataFormatada, formato);

      if (disponivel) {
        datas.push(dataFormatada);
      }
    }

    return datas;
  }
}

export const availabilityService = new AvailabilityService();
export default availabilityService;
