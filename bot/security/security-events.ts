// ==========================================
// FOFOCA BOT - Eventos de Segurança
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// TIPOS DE EVENTOS
// ==========================================

export enum TipoEventoSeguranca {
  LOGIN = 'LOGIN',
  LOGIN_FALHO = 'LOGIN_FALHO',
  LOGOUT = 'LOGOUT',
  CADASTRO = 'CADASTRO',
  TENTATIVA_FRAUDE = 'TENTATIVA_FRAUDE',
  RATE_LIMIT_EXCEDIDO = 'RATE_LIMIT_EXCEDIDO',
  DUPLICIDADE = 'DUPLICIDADE',
  BLOQUEIO = 'BLOQUEIO',
  DESBLOQUEIO = 'DESBLOQUEIO',
  IP_BLOQUEADO = 'IP_BLOQUEADO',
  TOKEN_INVALIDO = 'TOKEN_INVALIDO',
  ACESSO_NEGADO = 'ACESSO_NEGADO',
}

// ==========================================
// CLASSE SECURITY EVENTS
// ==========================================

export class SecurityEvents {
  // ==========================================
  // REGISTRAR EVENTO
  // ==========================================

  async registrar(tipo: TipoEventoSeguranca, userId?: number, dados?: any, ip?: string) {
    try {
      const evento = {
        tipo,
        userId,
        dados,
        ip,
        timestamp: new Date().toISOString(),
      };

      // Log
      logger.warn(`🔒 SECURITY EVENT: ${tipo} - User: ${userId || 'N/A'}`);

      // Salvar no banco
      await database.postgres.query(
        `INSERT INTO security_events (tipo, user_id, dados, ip, created_at) 
         VALUES ($1, $2, $3, $4, NOW())`,
        [tipo, userId, JSON.stringify(dados || {}), ip || null]
      );
    } catch (error) {
      logger.error('❌ Erro ao registrar evento de segurança:', error);
    }
  }

  // ==========================================
  // OBTER EVENTOS
  // ==========================================

  async obterEventos(limite: number = 100) {
    try {
      const resultado = await database.postgres.query(
        `SELECT * FROM security_events 
         ORDER BY created_at DESC 
         LIMIT $1`,
        [limite]
      );

      return resultado.rows;
    } catch (error) {
      logger.error('❌ Erro ao obter eventos:', error);
      return [];
    }
  }

  // ==========================================
  // VERIFICAR IP BLOQUEADO
  // ==========================================

  async ipBloqueado(ip: string): Promise<boolean> {
    try {
      const resultado = await database.postgres.query(
        `SELECT COUNT(*) as total FROM security_events 
         WHERE ip = $1 
         AND tipo = 'IP_BLOQUEADO' 
         AND created_at > NOW() - INTERVAL '24 hours'`,
        [ip]
      );

      const total = parseInt(resultado.rows[0]?.total || '0');
      return total > 0;
    } catch (error) {
      logger.error('❌ Erro ao verificar IP bloqueado:', error);
      return false;
    }
  }

  // ==========================================
  // LIMPAR EVENTOS ANTIGOS
  // ==========================================

  async limparAntigos(dias: number = 7) {
    try {
      await database.postgres.query(
        `DELETE FROM security_events 
         WHERE created_at < NOW() - INTERVAL '${dias} days'`
      );
    } catch (error) {
      logger.error('❌ Erro ao limpar eventos antigos:', error);
    }
  }
}

export const securityEvents = new SecurityEvents();
export default securityEvents;
