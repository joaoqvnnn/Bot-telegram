// ==========================================
// FOFOCA BOT - Modelo Rejection
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type Rejection = {
  id: number;
  application_id: number;
  reason: string;
  rejected_by: number | null;
  rejected_at: Date;
  created_at: Date;
};

// ==========================================
// MODELO REJECTION
// ==========================================

export const RejectionModel = {
  async criar(dados: Partial<Rejection>): Promise<Rejection | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO rejections (application_id, reason, rejected_by) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [dados.application_id, dados.reason, dados.rejected_by || null]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar rejeição:', error);
      return null;
    }
  },

  async obterPorApplication(applicationId: number): Promise<Rejection | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM rejections WHERE application_id = $1',
        [applicationId]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter rejeição:', error);
      return null;
    }
  },
};

export default RejectionModel;
