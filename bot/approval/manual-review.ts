// ==========================================
// FOFOCA BOT - Revisão Manual
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// TIPOS
// ==========================================

type DadosRevisao = {
  instagram?: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  formato?: string;
  data?: string;
  descricao?: string;
};

type ResultadoRevisao = {
  criado: boolean;
  revisaoId?: number;
  erro?: string;
};

// ==========================================
// CLASSE MANUAL REVIEW
// ==========================================

export class ManualReview {
  // ==========================================
  // CRIAR REVISÃO MANUAL
  // ==========================================

  async criar(dados: DadosRevisao, pontuacao: number): Promise<ResultadoRevisao> {
    try {
      logger.info('🟡 Criando revisão manual...');

      const resultado = await database.postgres.query(
        `INSERT INTO reviews (dados, pontuacao, status, created_at) 
         VALUES ($1, $2, 'PENDENTE', NOW()) 
         RETURNING id`,
        [JSON.stringify(dados), pontuacao]
      );

      const revisaoId = resultado.rows[0]?.id;

      logger.info(`✅ Revisão manual criada: #${revisaoId}`);

      return {
        criado: true,
        revisaoId,
      };
    } catch (error) {
      logger.error('❌ Erro ao criar revisão manual:', error);
      return {
        criado: false,
        erro: 'Erro ao criar revisão',
      };
    }
  }

  // ==========================================
  // OBTER REVISÕES PENDENTES
  // ==========================================

  async obterPendentes(limite: number = 50) {
    try {
      const resultado = await database.postgres.query(
        `SELECT * FROM reviews 
         WHERE status = 'PENDENTE' 
         ORDER BY created_at ASC 
         LIMIT $1`,
        [limite]
      );

      return resultado.rows;
    } catch (error) {
      logger.error('❌ Erro ao obter revisões pendentes:', error);
      return [];
    }
  }

  // ==========================================
  // APROVAR REVISÃO
  // ==========================================

  async aprovar(revisaoId: number, adminId: number) {
    try {
      await database.postgres.query(
        `UPDATE reviews 
         SET status = 'APROVADA', 
             admin_id = $2, 
             decidido_em = NOW() 
         WHERE id = $1`,
        [revisaoId, adminId]
      );

      logger.info(`✅ Revisão #${revisaoId} aprovada`);
      return true;
    } catch (error) {
      logger.error('❌ Erro ao aprovar revisão:', error);
      return false;
    }
  }

  // ==========================================
  // RECUSAR REVISÃO
  // ==========================================

  async recusar(revisaoId: number, adminId: number, motivo: string) {
    try {
      await database.postgres.query(
        `UPDATE reviews 
         SET status = 'RECUSADA', 
             admin_id = $2, 
             motivo = $3, 
             decidido_em = NOW() 
         WHERE id = $1`,
        [revisaoId, adminId, motivo]
      );

      logger.info(`❌ Revisão #${revisaoId} recusada`);
      return true;
    } catch (error) {
      logger.error('❌ Erro ao recusar revisão:', error);
      return false;
    }
  }

  // ==========================================
  // OBTER REVISÃO POR ID
  // ==========================================

  async obterPorId(revisaoId: number) {
    try {
      const resultado = await database.postgres.query(
        `SELECT * FROM reviews WHERE id = $1`,
        [revisaoId]
      );

      return resultado.rows[0] || null;
    } catch (error) {
      logger.error('❌ Erro ao obter revisão:', error);
      return null;
    }
  }
}

export const manualReview = new ManualReview();
export default manualReview;
