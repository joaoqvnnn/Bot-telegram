// ==========================================
// FOFOCA BOT - Log de Auditoria
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// TIPOS
// ==========================================

type EventoAuditoria = {
  tipo: string;
  userId?: number;
  dados?: any;
  ip?: string;
};

// ==========================================
// CLASSE AUDIT LOG
// ==========================================

export class AuditLog {
  // ==========================================
  // REGISTRAR EVENTO
  // ==========================================

  async registrar(tipo: string, userId?: number, dados?: any, ip?: string) {
    try {
      const evento: EventoAuditoria = {
        tipo,
        userId,
        dados,
        ip,
      };

      // Log no console
      logger.info(`📝 AUDIT: ${tipo} - User: ${userId || 'N/A'}`);

      // Salvar no banco
      await database.postgres.query(
        `INSERT INTO audit_logs (tipo, user_id, dados, ip, created_at) 
         VALUES ($1, $2, $3, $4, NOW())`,
        [tipo, userId, JSON.stringify(dados || {}), ip || null]
      );
    } catch (error) {
      logger.error('❌ Erro ao registrar auditoria:', error);
    }
  }

  // ==========================================
  // OBTER EVENTOS
  // ==========================================

  async obterEventos(limite: number = 100, offset: number = 0) {
    try {
      const resultado = await database.postgres.query(
        `SELECT * FROM audit_logs 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limite, offset]
      );

      return resultado.rows;
    } catch (error) {
      logger.error('❌ Erro ao obter eventos:', error);
      return [];
    }
  }

  // ==========================================
  // OBTER EVENTOS POR USUÁRIO
  // ==========================================

  async obterEventosPorUsuario(userId: number, limite: number = 100) {
    try {
      const resultado = await database.postgres.query(
        `SELECT * FROM audit_logs 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2`,
        [userId, limite]
      );

      return resultado.rows;
    } catch (error) {
      logger.error('❌ Erro ao obter eventos do usuário:', error);
      return [];
    }
  }

  // ==========================================
  // LIMPAR EVENTOS ANTIGOS
  // ==========================================

  async limparAntigos(dias: number = 30) {
    try {
      await database.postgres.query(
        `DELETE FROM audit_logs 
         WHERE created_at < NOW() - INTERVAL '${dias} days'`
      );
    } catch (error) {
      logger.error('❌ Erro ao limpar eventos antigos:', error);
    }
  }
}

export const auditLog = new AuditLog();
export default auditLog;
