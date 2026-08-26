import { Pool } from 'pg';
import { env } from './env';

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

export const database = {
  postgres: pool,
  redis: null,
  conectar: async () => {
    try {
      await pool.query('SELECT 1');
      console.log('✅ Banco conectado');
    } catch (error) {
      console.error('❌ Erro banco:', error);
    }
  },
  desconectar: async () => {
    await pool.end();
  },
};
