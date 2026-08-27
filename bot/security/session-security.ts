// ==========================================
// FOFOCA BOT - Segurança de Sessão
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// TIPOS
// ==========================================

type SessionInfo = {
  userId: number;
  chatId: number;
  startedAt: Date;
  lastActivity: Date;
};

// ==========================================
// CLASSE SESSION SECURITY
// ==========================================

export class SessionSecurity {
  private readonly TEMPO_EXPIRACAO = 30 * 60 * 1000; // 30 minutos
  private readonly MAX_SESSOES = 5;

  // ==========================================
  // VALIDAR SESSÃO
  // ==========================================

  async validarSessao(userId: number): Promise<boolean> {
    try {
      const sessao = await this.obterSessao(userId);

      if (!sessao) {
        return false;
      }

      // Verificar expiração
      const agora = new Date().getTime();
      const ultimaAtividade = new Date(sessao.lastActivity).getTime();

      if (agora - ultimaAtividade > this.TEMPO_EXPIRACAO) {
        await this.limparSessao(userId);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('❌ Erro ao validar sessão:', error);
      return false;
    }
  }

  // ==========================================
  // OBTER SESSÃO
  // ==========================================

  private async obterSessao(userId: number): Promise<SessionInfo | null> {
    try {
      const chave = `sessao_seguranca:${userId}`;
      const valor = await database.redis.get(chave);

      if (!valor) {
        return null;
      }

      return JSON.parse(valor);
    } catch (error) {
      logger.error('❌ Erro ao obter sessão:', error);
      return null;
    }
  }

  // ==========================================
  // CRIAR SESSÃO
  // ==========================================

  async criarSessao(userId: number, chatId: number): Promise<boolean> {
    try {
      // Verificar limite de sessões
      const totalSessoes = await this.obterTotalSessoes(userId);

      if (totalSessoes >= this.MAX_SESSOES) {
        // Remover sessão mais antiga
        await this.limparSessaoMaisAntiga(userId);
      }

      const sessao: SessionInfo = {
        userId,
        chatId,
        startedAt: new Date(),
        lastActivity: new Date(),
      };

      const chave = `sessao_seguranca:${userId}`;
      await database.redis.set(chave, JSON.stringify(sessao));

      return true;
    } catch (error) {
      logger.error('❌ Erro ao criar sessão:', error);
      return false;
    }
  }

  // ==========================================
  // ATUALIZAR ATIVIDADE
  // ==========================================

  async atualizarAtividade(userId: number): Promise<boolean> {
    try {
      const sessao = await this.obterSessao(userId);

      if (!sessao) {
        return false;
      }

      sessao.lastActivity = new Date();

      const chave = `sessao_seguranca:${userId}`;
      await database.redis.set(chave, JSON.stringify(sessao));

      return true;
    } catch (error) {
      logger.error('❌ Erro ao atualizar atividade:', error);
      return false;
    }
  }

  // ==========================================
  // LIMPAR SESSÃO
  // ==========================================

  async limparSessao(userId: number): Promise<boolean> {
    try {
      const chave = `sessao_seguranca:${userId}`;
      await database.redis.del(chave);
      return true;
    } catch (error) {
      logger.error('❌ Erro ao limpar sessão:', error);
      return false;
    }
  }

  // ==========================================
  // OBTER TOTAL DE SESSÕES
  // ==========================================

  private async obterTotalSessoes(userId: number): Promise<number> {
    try {
      const chaves = await database.redis.keys(`sessao_seguranca:${userId}:*`);
      return chaves.length;
    } catch (error) {
      logger.error('❌ Erro ao obter total de sessões:', error);
      return 0;
    }
  }

  // ==========================================
  // LIMPAR SESSÃO MAIS ANTIGA
  // ==========================================

  private async limparSessaoMaisAntiga(userId: number): Promise<void> {
    try {
      const chaves = await database.redis.keys(`sessao_seguranca:${userId}:*`);
      
      if (chaves.length === 0) {
        return;
      }

      // Remover primeira sessão
      await database.redis.del(chaves[0]);
    } catch (error) {
      logger.error('❌ Erro ao limpar sessão antiga:', error);
    }
  }
}

export const sessionSecurity = new SessionSecurity();
export default sessionSecurity;
