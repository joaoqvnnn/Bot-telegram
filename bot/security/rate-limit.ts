// ==========================================
// FOFOCA BOT - Rate Limit
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// TIPOS
// ==========================================

type RateLimitConfig = {
  janelaMs: number;
  maxTentativas: number;
};

// ==========================================
// CLASSE RATE LIMIT
// ==========================================

export class RateLimit {
  private readonly PREFIXO = 'rate_limit:';
  private readonly JANELA_PADRAO = 15 * 60 * 1000; // 15 minutos
  private readonly MAX_PADRAO = 100;

  // ==========================================
  // VERIFICAR LIMITE
  // ==========================================

  async verificar(chave: string, config?: Partial<RateLimitConfig>): Promise<boolean> {
    try {
      const janela = config?.janelaMs || this.JANELA_PADRAO;
      const max = config?.maxTentativas || this.MAX_PADRAO;

      const chaveRedis = `${this.PREFIXO}${chave}`;
      const atual = await database.redis.get(chaveRedis);

      if (!atual) {
        await database.redis.set(chaveRedis, '1', { EX: Math.floor(janela / 1000) });
        return true;
      }

      const tentativas = parseInt(atual);

      if (tentativas >= max) {
        return false;
      }

      await database.redis.incr(chaveRedis);
      return true;
    } catch (error) {
      logger.error('❌ Erro ao verificar rate limit:', error);
      return true;
    }
  }

  // ==========================================
  // OBTER TENTATIVAS RESTANTES
  // ==========================================

  async obterRestantes(chave: string, config?: Partial<RateLimitConfig>): Promise<number> {
    try {
      const max = config?.maxTentativas || this.MAX_PADRAO;
      const chaveRedis = `${this.PREFIXO}${chave}`;
      const atual = await database.redis.get(chaveRedis);

      if (!atual) {
        return max;
      }

      const usadas = parseInt(atual);
      return Math.max(0, max - usadas);
    } catch (error) {
      logger.error('❌ Erro ao obter restantes:', error);
      return 0;
    }
  }

  // ==========================================
  // LIMPAR CHAVE
  // ==========================================

  async limpar(chave: string) {
    try {
      const chaveRedis = `${this.PREFIXO}${chave}`;
      await database.redis.del(chaveRedis);
    } catch (error) {
      logger.error('❌ Erro ao limpar rate limit:', error);
    }
  }
}

export const rateLimit = new RateLimit();
export default rateLimit;
