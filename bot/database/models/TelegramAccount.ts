// ==========================================
// FOFOCA BOT - Modelo TelegramAccount
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type TelegramAccount = {
  id: number;
  user_id: number;
  telegram_user_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  language_code: string | null;
  created_at: Date;
  updated_at: Date;
};

// ==========================================
// MODELO TELEGRAM ACCOUNT
// ==========================================

export const TelegramAccountModel = {
  async criar(dados: Partial<TelegramAccount>): Promise<TelegramAccount | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO telegram_accounts (user_id, telegram_user_id, username, first_name, last_name, language_code) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [dados.user_id, dados.telegram_user_id, dados.username, dados.first_name, dados.last_name, dados.language_code]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar conta Telegram:', error);
      return null;
    }
  },

  async obterPorUserId(userId: number): Promise<TelegramAccount | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM telegram_accounts WHERE user_id = $1',
        [userId]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter conta Telegram:', error);
      return null;
    }
  },

  async atualizar(id: number, dados: Partial<TelegramAccount>): Promise<boolean> {
    try {
      await database.postgres.query(
        `UPDATE telegram_accounts SET 
         username = COALESCE($2, username), 
         first_name = COALESCE($3, first_name), 
         last_name = COALESCE($4, last_name), 
         updated_at = NOW() 
         WHERE id = $1`,
        [id, dados.username, dados.first_name, dados.last_name]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar conta Telegram:', error);
      return false;
    }
  },
};

export default TelegramAccountModel;
