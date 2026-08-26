// ==========================================
// FOFOCA BOT - Modelo Review
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type Review = {
  id: number;
  application_id: number;
  reviewed_by: number | null;
  decision: string | null;
  decided_at: Date | null;
  created_at: Date;
};

// ==========================================
// MODELO REVIEW
// ==========================================

export const ReviewModel = {
  async criar(dados: Partial<Review>): Promise<Review | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO reviews (application_id) 
         VALUES ($1) 
         RETURNING *`,
        [dados.application_id]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar revisão:', error);
      return null;
    }
  },

  async decidir(id: number, decision: string, reviewedBy: number): Promise<boolean> {
    try {
      await database.postgres.query(
        `UPDATE reviews SET decision = $2, reviewed_by = $3, decided_at = NOW() WHERE id = $1`,
        [id, decision, reviewedBy]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao decidir revisão:', error);
      return false;
    }
  },

  async obterPendentes(): Promise<Review[]> {
    try {
      const resultado = await database.postgres.query(
        "SELECT * FROM reviews WHERE decision IS NULL ORDER BY created_at ASC"
      );
      return resultado.rows;
    } catch (error) {
      console.error('❌ Erro ao obter revisões pendentes:', error);
      return [];
    }
  },
};

export default ReviewModel;
