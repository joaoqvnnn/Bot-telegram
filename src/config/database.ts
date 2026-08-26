// ==========================================
// FOFOCA BOT - Configuração do Banco de Dados
// ==========================================

import { Pool } from 'pg';
import { createClient } from 'redis';
import { env } from './env';

// ==========================================
// POSTGRESQL
// ==========================================

const postgresPool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ==========================================
// REDIS
// ==========================================

const redisClient = createClient({
  url: env.REDIS_URL,
  password: env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (error) => {
  console.error('❌ Erro no Redis:', error);
});

redisClient.on('connect', () => {
  console.log('✅ Redis conectado');
});

// ==========================================
// FUNÇÕES DE CONEXÃO
// ==========================================

async function conectarPostgres() {
  try {
    await postgresPool.connect();
    console.log('✅ PostgreSQL conectado');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar no PostgreSQL:', error);
    return false;
  }
}

async function conectarRedis() {
  try {
    await redisClient.connect();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar no Redis:', error);
    return false;
  }
}

async function desconectarPostgres() {
  try {
    await postgresPool.end();
    console.log('✅ PostgreSQL desconectado');
  } catch (error) {
    console.error('❌ Erro ao desconectar do PostgreSQL:', error);
  }
}

async function desconectarRedis() {
  try {
    await redisClient.quit();
    console.log('✅ Redis desconectado');
  } catch (error) {
    console.error('❌ Erro ao desconectar do Redis:', error);
  }
}

// ==========================================
// EXPORTAÇÃO
// ==========================================

export const database = {
  postgres: postgresPool,
  redis: redisClient,
  conectar: async () => {
    await conectarPostgres();
    await conectarRedis();
  },
  desconectar: async () => {
    await desconectarPostgres();
    await desconectarRedis();
  },
};
