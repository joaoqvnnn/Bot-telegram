// ==========================================
// FOFOCA BOT - Modelo SecurityEvent
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type SecurityEvent = {
  id: number;
  user_id: number | null;
  tipo: string;
  dados: any;
  ip: string | null;
  created_at: Date;
};

// ==========================================
// MODELO SECURITY EVENT
// ==========================================

export const SecurityEventModel = {
  async criar(dados: Partial<SecurityEvent>): Promise<SecurityEvent | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO security_events (user_id, tipo, dados, ip) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [dados.user_id, dados.tipo, JSON.stringify(dados.dados || {}), dados.ip]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar evento de segurança:', error);
      return null;
    }
  },

  async obterPorUser(userId: number): Promise<SecurityEvent[]> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM security_events WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return resultado.rows;
    } catch (error) {
      console.error('❌ Erro ao obter eventos de segurança:', error);
      return [];
    }
  },
};

export default SecurityEventModel;
