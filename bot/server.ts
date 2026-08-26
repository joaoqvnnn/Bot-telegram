// ==========================================
// FOFOCA BOT - Servidor Principal (Render)
// ==========================================

import http from 'http';
import express from 'express';
import { Telegraf } from 'telegraf';
import { Pool } from 'pg';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// ==========================================
// CONFIGURAÇÃO
// ==========================================

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

// ==========================================
// BANCO DE DADOS
// ==========================================

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Para Render PostgreSQL
  },
});

// ==========================================
// REDIS (OPCIONAL - PODE FALHAR SEM PROBLEMA)
// ==========================================

let redisClient: any = null;

try {
  if (process.env.REDIS_URL) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    
    redisClient.on('error', (err: any) => {
      console.log('⚠️ Redis indisponível, continuando sem cache');
    });
    
    redisClient.connect();
  }
} catch (error) {
  console.log('⚠️ Redis não configurado');
}

// ==========================================
// EXPRESS
// ==========================================

const app = express();
app.use(express.json());

// ==========================================
// ROTA DE SAÚDE
// ==========================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// BOT TELEGRAM
// ==========================================

if (TELEGRAM_BOT_TOKEN) {
  const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

  // Comando start
  bot.start((ctx) => {
    ctx.reply('👋 Bem-vindo ao Fofoca Bot!');
  });

  // Configurar webhook se em produção
  if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
    const webhookUrl = `${process.env.RENDER_EXTERNAL_URL}/webhook/telegram`;
    
    app.post('/webhook/telegram', (req, res) => {
      bot.handleUpdate(req.body);
      res.sendStatus(200);
    });

    bot.telegram.setWebhook(webhookUrl);
    console.log(`✅ Webhook configurado: ${webhookUrl}`);
  } else {
    // Polling para desenvolvimento
    bot.launch();
    console.log('✅ Bot em modo polling');
  }
}

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log(`🚀 Fofoca Bot rodando na porta ${PORT}`);
});

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

process.on('SIGTERM', async () => {
  console.log('🛑 Encerrando...');
  await pool.end();
  process.exit(0);
});
