// ==========================================
// FOFOCA BOT - Modelo Session
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type Session = {
  id: number;
  user_id: number;
  chat_id: number;
  flow_atual: string;
  step_atual: string;
  dados: any;
  created_at: Date;
  updated_at: Date;
};

// ==========================================
// MODELO SESSION
// ==========================================

export const SessionModel = {
  async criar(dados: Partial<Session>): Promise<Session | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO sessions (user_id, chat_id, flow_atual, step_atual, dados) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [dados.user_id, dados.chat_id, dados.flow_atual, dados.step_atual, JSON.stringify(dados.dados || {})]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar sessão:', error);
      return null;
    }
  },

  async obterPorUser(userId: number): Promise<Session | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM sessions WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
        [userId]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter sessão:', error);
      return null;
    }
  },

  async atualizar(id: number, dados: Partial<Session>): Promise<boolean> {
    try {
      await database.postgres.query(
        `UPDATE sessions SET 
         step_atual = COALESCE($2, step_atual), 
         dados = COALESCE($3, dados), 
         updated_at = NOW() 
         WHERE id = $1`,
        [id, dados.step_atual, JSON.stringify(dados.dados || {})]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar sessão:', error);
      return false;
    }
  },

  async excluir(id: number): Promise<boolean> {
    try {
      await database.postgres.query('DELETE FROM sessions WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('❌ Erro ao excluir sessão:', error);
      return false;
    }
  },
};

export default SessionModel;
