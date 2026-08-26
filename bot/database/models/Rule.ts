// ==========================================
// FOFOCA BOT - Modelo Rule
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type Rule = {
  id: number;
  nome: string;
  condicao: string;
  peso: number;
  ativo: boolean;
  created_at: Date;
  updated_at: Date;
};

// ==========================================
// MODELO RULE
// ==========================================

export const RuleModel = {
  async obterTodas(): Promise<Rule[]> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM rules WHERE ativo = true'
      );
      return resultado.rows;
    } catch (error) {
      console.error('❌ Erro ao obter regras:', error);
      return [];
    }
  },

  async obterPorId(id: number): Promise<Rule | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM rules WHERE id = $1',
        [id]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter regra:', error);
      return null;
    }
  },

  async criar(dados: Partial<Rule>): Promise<Rule | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO rules (nome, condicao, peso) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [dados.nome, dados.condicao, dados.peso || 0]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar regra:', error);
      return null;
    }
  },

  async atualizar(id: number, dados: Partial<Rule>): Promise<boolean> {
    try {
      await database.postgres.query(
        `UPDATE rules SET 
         nome = COALESCE($2, nome), 
         condicao = COALESCE($3, condicao), 
         peso = COALESCE($4, peso), 
         updated_at = NOW() 
         WHERE id = $1`,
        [id, dados.nome, dados.condicao, dados.peso]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar regra:', error);
      return false;
    }
  },

  async toggleAtivo(id: number, ativo: boolean): Promise<boolean> {
    try {
      await database.postgres.query(
        'UPDATE rules SET ativo = $2 WHERE id = $1',
        [id, ativo]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao alternar regra:', error);
      return false;
    }
  },
};

export default RuleModel;
