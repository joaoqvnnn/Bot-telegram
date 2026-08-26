// ==========================================
// FOFOCA BOT - Serviço de Formatos
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// TIPOS
// ==========================================

type Formato = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  ativo: boolean;
};

// ==========================================
// CLASSE FORMATS SERVICE
// ==========================================

export class FormatsService {
  // ==========================================
  // OBTER TODOS FORMATOS
  // ==========================================

  async obterTodos(): Promise<Formato[]> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM advertising_formats WHERE ativo = true'
      );
      return resultado.rows;
    } catch (error) {
      logger.error('❌ Erro ao obter formatos:', error);
      return [];
    }
  }

  // ==========================================
  // OBTER FORMATO POR ID
  // ==========================================

  async obterPorId(id: string): Promise<Formato | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM advertising_formats WHERE id = $1',
        [id]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      logger.error('❌ Erro ao obter formato:', error);
      return null;
    }
  }

  // ==========================================
  // CRIAR FORMATO
  // ==========================================

  async criar(formato: Partial<Formato>): Promise<Formato | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO advertising_formats (id, nome, descricao, preco, ativo) 
         VALUES ($1, $2, $3, $4, true) 
         RETURNING *`,
        [formato.id, formato.nome, formato.descricao, formato.preco]
      );
      return resultado.rows[0];
    } catch (error) {
      logger.error('❌ Erro ao criar formato:', error);
      return null;
    }
  }

  // ==========================================
  // ATUALIZAR FORMATO
  // ==========================================

  async atualizar(id: string, dados: Partial<Formato>): Promise<boolean> {
    try {
      await database.postgres.query(
        'UPDATE advertising_formats SET nome = $2, descricao = $3, preco = $4 WHERE id = $1',
        [id, dados.nome, dados.descricao, dados.preco]
      );
      return true;
    } catch (error) {
      logger.error('❌ Erro ao atualizar formato:', error);
      return false;
    }
  }

  // ==========================================
  // ATIVAR/DESATIVAR FORMATO
  // ==========================================

  async toggleAtivo(id: string, ativo: boolean): Promise<boolean> {
    try {
      await database.postgres.query(
        'UPDATE advertising_formats SET ativo = $2 WHERE id = $1',
        [id, ativo]
      );
      return true;
    } catch (error) {
      logger.error('❌ Erro ao alternar formato:', error);
      return false;
    }
  }
}

export const formatsService = new FormatsService();
export default formatsService;
