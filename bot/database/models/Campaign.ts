// ==========================================
// FOFOCA BOT - Modelo Campaign
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type Campaign = {
  id: number;
  application_id: number;
  anunciante: string;
  instagram: string;
  formato: string;
  data: string;
  status: string;
  valor: number;
  created_at: Date;
  updated_at: Date;
};

// ==========================================
// MODELO CAMPAIGN
// ==========================================

export const CampaignModel = {
  async criar(dados: Partial<Campaign>): Promise<Campaign | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO campaigns (application_id, anunciante, instagram, formato, data, status, valor) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [dados.application_id, dados.anunciante, dados.instagram, dados.formato, dados.data, dados.status || 'ATIVA', dados.valor || 0]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar campanha:', error);
      return null;
    }
  },

  async obterPorId(id: number): Promise<Campaign | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM campaigns WHERE id = $1',
        [id]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter campanha:', error);
      return null;
    }
  },

  async obterPorApplication(applicationId: number): Promise<Campaign | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM campaigns WHERE application_id = $1',
        [applicationId]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter campanha:', error);
      return null;
    }
  },

  async atualizarStatus(id: number, status: string): Promise<boolean> {
    try {
      await database.postgres.query(
        'UPDATE campaigns SET status = $2, updated_at = NOW() WHERE id = $1',
        [id, status]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar status da campanha:', error);
      return false;
    }
  },
};

export default CampaignModel;
