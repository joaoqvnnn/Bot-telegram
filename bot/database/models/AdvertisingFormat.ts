// ==========================================
// FOFOCA BOT - Modelo AdvertisingFormat
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type AdvertisingFormat = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  ativo: boolean;
  created_at: Date;
  updated_at: Date;
};

// ==========================================
// MODELO ADVERTISING FORMAT
// ==========================================

export const AdvertisingFormatModel = {
  async obterTodos(): Promise<AdvertisingFormat[]> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM advertising_formats WHERE ativo = true'
      );
      return resultado.rows;
    } catch (error) {
      console.error('❌ Erro ao obter formatos:', error);
      return [];
    }
  },

  async obterPorId(id: string): Promise<AdvertisingFormat | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM advertising_formats WHERE id = $1',
        [id]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter formato:', error);
      return null;
    }
  },

  async criar(dados: Partial<AdvertisingFormat>): Promise<AdvertisingFormat | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO advertising_formats (id, nome, descricao, preco) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [dados.id, dados.nome, dados.descricao, dados.preco]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar formato:', error);
      return null;
    }
  },

  async atualizar(id: string, dados: Partial<AdvertisingFormat>): Promise<boolean> {
    try {
      await database.postgres.query(
        `UPDATE advertising_formats SET 
         nome = COALESCE($2, nome), 
         descricao = COALESCE($3, descricao), 
         preco = COALESCE($4, preco), 
         updated_at = NOW() 
         WHERE id = $1`,
        [id, dados.nome, dados.descricao, dados.preco]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar formato:', error);
      return false;
    }
  },

  async toggleAtivo(id: string, ativo: boolean): Promise<boolean> {
    try {
      await database.postgres.query(
        'UPDATE advertising_formats SET ativo = $2 WHERE id = $1',
        [id, ativo]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao alternar formato:', error);
      return false;
    }
  },
};

export default AdvertisingFormatModel;
