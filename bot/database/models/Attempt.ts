// ==========================================
// FOFOCA BOT - Modelo Attempt
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type Attempt = {
  id: number;
  user_id: number;
  tipo: string;
  dados: any;
  created_at: Date;
};

// ==========================================
// MODELO ATTEMPT
// ==========================================

export const AttemptModel = {
  async criar(dados: Partial<Attempt>): Promise<Attempt | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO attempts (user_id, tipo, dados) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [dados.user_id, dados.tipo, JSON.stringify(dados.dados || {})]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar tentativa:', error);
      return null;
    }
  },

  async obterPorUser(userId: number): Promise<Attempt[]> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM attempts WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return resultado.rows;
    } catch (error) {
      console.error('❌ Erro ao obter tentativas:', error);
      return [];
    }
  },

  async contarPorUser(userId: number): Promise<number> {
    try {
      const resultado = await database.postgres.query(
        'SELECT COUNT(*) as total FROM attempts WHERE user_id = $1',
        [userId]
      );
      return parseInt(resultado.rows[0]?.total || '0');
    } catch (error) {
      console.error('❌ Erro ao contar tentativas:', error);
      return 0;
    }
  },
};

export default AttemptModel;
