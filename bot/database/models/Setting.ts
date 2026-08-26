// ==========================================
// FOFOCA BOT - Modelo Setting
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type Setting = {
  id: number;
  chave: string;
  valor: string;
  descricao: string | null;
  created_at: Date;
  updated_at: Date;
};

// ==========================================
// MODELO SETTING
// ==========================================

export const SettingModel = {
  async obterPorChave(chave: string): Promise<Setting | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM settings WHERE chave = $1',
        [chave]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter configuração:', error);
      return null;
    }
  },

  async obterTodas(): Promise<Setting[]> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM settings ORDER BY chave'
      );
      return resultado.rows;
    } catch (error) {
      console.error('❌ Erro ao obter configurações:', error);
      return [];
    }
  },

  async criar(dados: Partial<Setting>): Promise<Setting | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO settings (chave, valor, descricao) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (chave) DO UPDATE SET valor = $2, updated_at = NOW()
         RETURNING *`,
        [dados.chave, dados.valor, dados.descricao]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar configuração:', error);
      return null;
    }
  },

  async atualizar(chave: string, valor: string): Promise<boolean> {
    try {
      await database.postgres.query(
        'UPDATE settings SET valor = $2, updated_at = NOW() WHERE chave = $1',
        [chave, valor]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar configuração:', error);
      return false;
    }
  },
};

export default SettingModel;
