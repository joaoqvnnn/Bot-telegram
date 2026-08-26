// ==========================================
// FOFOCA BOT - Modelo AuditLog
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type AuditLog = {
  id: number;
  tipo: string;
  user_id: number | null;
  dados: any;
  ip: string | null;
  created_at: Date;
};

// ==========================================
// MODELO AUDIT LOG
// ==========================================

export const AuditLogModel = {
  async criar(dados: Partial<AuditLog>): Promise<AuditLog | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO audit_logs (tipo, user_id, dados, ip) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [dados.tipo, dados.user_id, JSON.stringify(dados.dados || {}), dados.ip]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar log de auditoria:', error);
      return null;
    }
  },

  async obterTodos(limite: number = 100): Promise<AuditLog[]> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1',
        [limite]
      );
      return resultado.rows;
    } catch (error) {
      console.error('❌ Erro ao obter logs:', error);
      return [];
    }
  },

  async obterPorUser(userId: number, limite: number = 50): Promise<AuditLog[]> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
        [userId, limite]
      );
      return resultado.rows;
    } catch (error) {
      console.error('❌ Erro ao obter logs do usuário:', error);
      return [];
    }
  },

  async obterPorTipo(tipo: string, limite: number = 50): Promise<AuditLog[]> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM audit_logs WHERE tipo = $1 ORDER BY created_at DESC LIMIT $2',
        [tipo, limite]
      );
      return resultado.rows;
    } catch (error) {
      console.error('❌ Erro ao obter logs por tipo:', error);
      return [];
    }
  },

  async limparAntigos(dias: number = 30): Promise<boolean> {
    try {
      await database.postgres.query(
        `DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '${dias} days'`
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar logs antigos:', error);
      return false;
    }
  },
};

export default AuditLogModel;
