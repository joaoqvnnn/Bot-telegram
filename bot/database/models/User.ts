// ==========================================
// FOFOCA BOT - Modelo User
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type User = {
  id: number;
  telegram_user_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: Date;
  updated_at: Date;
};

// ==========================================
// MODELO USER
// ==========================================

export const UserModel = {
  // ==========================================
  // CRIAR OU ATUALIZAR USUÁRIO
  // ==========================================

  async criarOuAtualizar(dados: Partial<User>): Promise<User | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO users (telegram_user_id, username, first_name, last_name) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (telegram_user_id) DO UPDATE 
         SET username = $2, first_name = $3, last_name = $4, updated_at = NOW()
         RETURNING *`,
        [dados.telegram_user_id, dados.username, dados.first_name, dados.last_name]
      );

      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      return null;
    }
  },

  // ==========================================
  // OBTER POR TELEGRAM ID
  // ==========================================

  async obterPorTelegramId(telegramUserId: number): Promise<User | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM users WHERE telegram_user_id = $1',
        [telegramUserId]
      );

      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter usuário:', error);
      return null;
    }
  },

  // ==========================================
  // OBTER POR ID
  // ==========================================

  async obterPorId(id: number): Promise<User | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );

      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter usuário:', error);
      return null;
    }
  },

  // ==========================================
  // ATUALIZAR USUÁRIO
  // ==========================================

  async atualizar(id: number, dados: Partial<User>): Promise<boolean> {
    try {
      await database.postgres.query(
        `UPDATE users SET 
         username = COALESCE($2, username), 
         first_name = COALESCE($3, first_name), 
         last_name = COALESCE($4, last_name), 
         updated_at = NOW() 
         WHERE id = $1`,
        [id, dados.username, dados.first_name, dados.last_name]
      );

      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      return false;
    }
  },

  // ==========================================
  // EXCLUIR USUÁRIO
  // ==========================================

  async excluir(id: number): Promise<boolean> {
    try {
      await database.postgres.query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('❌ Erro ao excluir usuário:', error);
      return false;
    }
  },
};

export default UserModel;
