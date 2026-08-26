// ==========================================
// FOFOCA BOT - Serviço de Campanhas
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// TIPOS
// ==========================================

type Campanha = {
  id: number;
  applicationId: number;
  anunciante: string;
  instagram: string;
  formato: string;
  data: string;
  status: string;
  valor: number;
};

// ==========================================
// CLASSE CAMPAIGN SERVICE
// ==========================================

export class CampaignService {
  // ==========================================
  // CRIAR CAMPANHA
  // ==========================================

  async criar(dados: any): Promise<Campanha | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO campaigns (application_id, anunciante, instagram, formato, data, status, valor) 
         VALUES ($1, $2, $3, $4, $5, 'ATIVA', $6) 
         RETURNING *`,
        [dados.applicationId, dados.empresa, dados.instagram, dados.formato, dados.data, dados.valor]
      );

      logger.info(`✅ Campanha criada: #${resultado.rows[0].id}`);
      return resultado.rows[0];
    } catch (error) {
      logger.error('❌ Erro ao criar campanha:', error);
      return null;
    }
  }

  // ==========================================
  // OBTER TODAS CAMPANHAS
  // ==========================================

  async obterTodas(): Promise<Campanha[]> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM campaigns ORDER BY created_at DESC'
      );
      return resultado.rows;
    } catch (error) {
      logger.error('❌ Erro ao obter campanhas:', error);
      return [];
    }
  }

  // ==========================================
  // OBTER CAMPANHA POR ID
  // ==========================================

  async obterPorId(id: number): Promise<Campanha | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM campaigns WHERE id = $1',
        [id]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      logger.error('❌ Erro ao obter campanha:', error);
      return null;
    }
  }

  // ==========================================
  // ATUALIZAR STATUS
  // ==========================================

  async atualizarStatus(id: number, status: string): Promise<boolean> {
    try {
      await database.postgres.query(
        'UPDATE campaigns SET status = $2, updated_at = NOW() WHERE id = $1',
        [id, status]
      );
      return true;
    } catch (error) {
      logger.error('❌ Erro ao atualizar status:', error);
      return false;
    }
  }

  // ==========================================
  // OBTER CAMPANHAS ATIVAS
  // ==========================================

  async obterAtivas(): Promise<Campanha[]> {
    try {
      const resultado = await database.postgres.query(
        "SELECT * FROM campaigns WHERE status = 'ATIVA'"
      );
      return resultado.rows;
    } catch (error) {
      logger.error('❌ Erro ao obter campanhas ativas:', error);
      return [];
    }
  }
}

export const campaignService = new CampaignService();
export default campaignService;
