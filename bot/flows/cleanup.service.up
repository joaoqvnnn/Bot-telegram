// ==========================================
// FOFOCA BOT - Serviço de Limpeza
// ==========================================

import { logger } from '../config/logger';
import { sessionManager } from './session-manager';
import { database } from '../config/database';

// ==========================================
// SERVIÇO DE LIMPEZA
// ==========================================

export class CleanupService {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly INTERVALO_LIMPEZA = 15 * 60 * 1000; // 15 minutos

  // ==========================================
  // INICIAR LIMPEZA AUTOMÁTICA
  // ==========================================

  iniciar() {
    if (this.intervalId) {
      logger.warn('⚠️ Limpeza automática já está ativa');
      return;
    }

    this.intervalId = setInterval(async () => {
      await this.executarLimpeza();
    }, this.INTERVALO_LIMPEZA);

    logger.info('🔄 Limpeza automática iniciada');
  }

  // ==========================================
  // PARAR LIMPEZA AUTOMÁTICA
  // ==========================================

  parar() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info('🛑 Limpeza automática parada');
    }
  }

  // ==========================================
  // EXECUTAR LIMPEZA COMPLETA
  // ==========================================

  async executarLimpeza() {
    try {
      logger.info('🧹 Iniciando limpeza...');

      const inicio = new Date();

      // Limpar sessões expiradas
      const sessoesLimpas = await sessionManager.limparSessoesExpiradas();
      logger.info(`📝 Sessões limpas: ${sessoesLimpas}`);

      // Limpar cache Redis
      const cacheLimpo = await this.limparCacheRedis();
      logger.info(`📝 Cache limpo: ${cacheLimpo}`);

      // Limpar arquivos temporários
      const arquivosLimpados = await this.limparArquivosTemporarios();
      logger.info(`📝 Arquivos temporários limpos: ${arquivosLimpados}`);

      const fim = new Date();
      const duracao = fim.getTime() - inicio.getTime();

      logger.info(`✅ Limpeza concluída em ${duracao}ms`);
    } catch (error) {
      logger.error('❌ Erro ao executar limpeza:', error);
    }
  }

  // ==========================================
  // LIMPAR CACHE REDIS
  // ==========================================

  private async limparCacheRedis(): Promise<number> {
    try {
      const chaves = await database.redis.keys('sessao:*');
      
      if (chaves.length === 0) {
        return 0;
      }

      const agora = new Date().getTime();
      let removidas = 0;

      for (const chave of chaves) {
        const valor = await database.redis.get(chave);
        
        if (valor) {
          try {
            const sessao = JSON.parse(valor);
            const ultimaAtualizacao = new Date(sessao.updatedAt).getTime();
            
            if (agora - ultimaAtualizacao > 30 * 60 * 1000) {
              await database.redis.del(chave);
              removidas++;
            }
          } catch (error) {
            // Chave inválida, remover
            await database.redis.del(chave);
            removidas++;
          }
        } else {
          // Chave sem valor, remover
          await database.redis.del(chave);
          removidas++;
        }
      }

      return removidas;
    } catch (error) {
      logger.error('❌ Erro ao limpar cache Redis:', error);
      return 0;
    }
  }

  // ==========================================
  // LIMPAR ARQUIVOS TEMPORÁRIOS
  // ==========================================

  private async limparArquivosTemporarios(): Promise<number> {
    try {
      // Aqui você pode limpar arquivos temporários
      // Ex: uploads antigos, logs antigos, etc.
      return 0;
    } catch (error) {
      logger.error('❌ Erro ao limpar arquivos temporários:', error);
      return 0;
    }
  }

  // ==========================================
  // LIMPAR DADOS ANTIGOS DO BANCO
  // ==========================================

  async limparDadosAntigos() {
    try {
      // Limpar logs antigos (mais de 30 dias)
      await database.postgres.query(
        'DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL \'30 days\''
      );

      // Limpar tentativas antigas (mais de 7 dias)
      await database.postgres.query(
        'DELETE FROM attempts WHERE created_at < NOW() - INTERVAL \'7 days\''
      );

      logger.info('✅ Dados antigos limpos do banco');
    } catch (error) {
      logger.error('❌ Erro ao limpar dados antigos:', error);
    }
  }
}

// ==========================================
// INSTÂNCIA ÚNICA
// ==========================================

export const cleanupService = new CleanupService();

export default cleanupService;
