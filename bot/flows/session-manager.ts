// ==========================================
// FOFOCA BOT - Gerenciador de Sessões
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// TIPOS DE SESSÃO
// ==========================================

export type SessionData = {
  userId: number;
  flowAtual: string;
  stepAtual: string;
  dados: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};

// ==========================================
// CLASSE SESSION MANAGER
// ==========================================

export class SessionManager {
  private sessoes: Map<number, SessionData> = new Map();
  private readonly TEMPO_EXPIRACAO = 30 * 60 * 1000; // 30 minutos

  // ==========================================
  // CRIAR SESSÃO
  // ==========================================

  async criarSessao(userId: number, flowAtual: string, stepAtual: string): Promise<SessionData> {
    const sessao: SessionData = {
      userId,
      flowAtual,
      stepAtual,
      dados: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessoes.set(userId, sessao);

    // Salvar no Redis
    try {
      await database.redis.set(
        `sessao:${userId}`,
        JSON.stringify(sessao),
        { EX: Math.floor(this.TEMPO_EXPIRACAO / 1000) }
      );
    } catch (error) {
      logger.error('❌ Erro ao salvar sessão no Redis:', error);
    }

    logger.info(`✅ Sessão criada para ${userId}`);
    return sessao;
  }

  // ==========================================
  // OBTER SESSÃO
  // ==========================================

  async obterSessao(userId: number): Promise<SessionData | null> {
    // Verificar em memória primeiro
    const sessaoMemoria = this.sessoes.get(userId);
    if (sessaoMemoria) {
      return sessaoMemoria;
    }

    // Buscar no Redis
    try {
      const sessaoRedis = await database.redis.get(`sessao:${userId}`);
      if (sessaoRedis) {
        const sessao = JSON.parse(sessaoRedis);
        this.sessoes.set(userId, sessao);
        return sessao;
      }
    } catch (error) {
      logger.error('❌ Erro ao buscar sessão no Redis:', error);
    }

    return null;
  }

  // ==========================================
  // ATUALIZAR SESSÃO
  // ==========================================

  async atualizarSessao(userId: number, dados: Partial<SessionData>): Promise<SessionData | null> {
    const sessao = await this.obterSessao(userId);

    if (!sessao) {
      return null;
    }

    const sessaoAtualizada: SessionData = {
      ...sessao,
      ...dados,
      updatedAt: new Date(),
    };

    this.sessoes.set(userId, sessaoAtualizada);

    try {
      await database.redis.set(
        `sessao:${userId}`,
        JSON.stringify(sessaoAtualizada),
        { EX: Math.floor(this.TEMPO_EXPIRACAO / 1000) }
      );
    } catch (error) {
      logger.error('❌ Erro ao atualizar sessão no Redis:', error);
    }

    return sessaoAtualizada;
  }

  // ==========================================
  // ATUALIZAR DADOS DA SESSÃO
  // ==========================================

  async atualizarDados(userId: number, dados: Record<string, any>): Promise<SessionData | null> {
    const sessao = await this.obterSessao(userId);

    if (!sessao) {
      return null;
    }

    sessao.dados = {
      ...sessao.dados,
      ...dados,
    };
    sessao.updatedAt = new Date();

    this.sessoes.set(userId, sessao);

    try {
      await database.redis.set(
        `sessao:${userId}`,
        JSON.stringify(sessao),
        { EX: Math.floor(this.TEMPO_EXPIRACAO / 1000) }
      );
    } catch (error) {
      logger.error('❌ Erro ao atualizar dados da sessão:', error);
    }

    return sessao;
  }

  // ==========================================
  // LIMPAR SESSÃO
  // ==========================================

  async limparSessao(userId: number): Promise<boolean> {
    this.sessoes.delete(userId);

    try {
      await database.redis.del(`sessao:${userId}`);
    } catch (error) {
      logger.error('❌ Erro ao limpar sessão do Redis:', error);
    }

    logger.info(`🗑️ Sessão limpa para ${userId}`);
    return true;
  }

  // ==========================================
  // VERIFICAR SE SESSÃO EXISTE
  // ==========================================

  async sessaoExiste(userId: number): Promise<boolean> {
    const sessao = await this.obterSessao(userId);
    return !!sessao;
  }

  // ==========================================
  // VERIFICAR SE SESSÃO EXPIRou
  // ==========================================

  async sessaoExpirada(userId: number): Promise<boolean> {
    const sessao = await this.obterSessao(userId);

    if (!sessao) {
      return true;
    }

    const agora = new Date().getTime();
    const ultimaAtualizacao = sessao.updatedAt.getTime();

    return agora - ultimaAtualizacao > this.TEMPO_EXPIRACAO;
  }

  // ==========================================
  // LIMPAR SESSÕES EXPIRADAS
  // ==========================================

  async limparSessoesExpiradas(): Promise<number> {
    let limpas = 0;

    for (const [userId, sessao] of this.sessoes.entries()) {
      const agora = new Date().getTime();
      const ultimaAtualizacao = sessao.updatedAt.getTime();

      if (agora - ultimaAtualizacao > this.TEMPO_EXPIRACAO) {
        this.sessoes.delete(userId);
        limpas++;
      }
    }

    if (limpas > 0) {
      logger.info(`🧹 ${limpas} sessões expiradas limpas`);
    }

    return limpas;
  }

  // ==========================================
  // OBTER TOTAL DE SESSÕES ATIVAS
  // ==========================================

  obterTotalSessoes(): number {
    return this.sessoes.size;
  }
}

// ==========================================
// INSTÂNCIA ÚNICA
// ==========================================

export const sessionManager = new SessionManager();

export default sessionManager;
