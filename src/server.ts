// ==========================================
// FOFOCA BOT - Servidor Principal
// ==========================================

import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

import app from './app';
import { env } from './config/env';
import { database } from './config/database';
import { logger } from './config/logger';
import { telegramBot } from './bot/bot';

// ==========================================
// CONFIGURAÇÃO DO SERVIDOR
// ==========================================

const PORT = env.PORT || 3000;

// Criar servidor HTTP
const server = http.createServer(app);

// Configurar HTTPS se certificados existirem
let finalServer: http.Server | https.Server = server;

try {
  const certPath = path.join(__dirname, '..', 'certificados');
  const privateKey = fs.readFileSync(path.join(certPath, 'privkey.pem'));
  const certificate = fs.readFileSync(path.join(certPath, 'cert.pem'));
  const ca = fs.readFileSync(path.join(certPath, 'chain.pem'));

  const httpsServer = https.createServer(
    {
      key: privateKey,
      cert: certificate,
      ca: ca,
    },
    app
  );

  finalServer = httpsServer;
  logger.info('🔒 HTTPS habilitado');
} catch (error) {
  logger.info('ℹ️ HTTPS não configurado, usando HTTP');
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

async function iniciar() {
  try {
    logger.info('========================================');
    logger.info('🚀 Iniciando Fofoca Bot...');
    logger.info('========================================');

    // Conectar ao banco de dados
    await database.conectar();
    logger.info('✅ Banco de dados conectado');

    // Iniciar bot do Telegram
    await telegramBot.iniciar();
    logger.info('✅ Bot do Telegram iniciado');

    // Iniciar servidor HTTP
    finalServer.listen(PORT, () => {
      logger.info(`📡 Servidor rodando na porta ${PORT}`);
      logger.info(`🌐 Ambiente: ${env.NODE_ENV}`);
      logger.info(`📅 Data: ${new Date().toISOString()}`);
      logger.info('========================================');
    });
  } catch (error) {
    logger.error('❌ Erro ao iniciar aplicação:', error);
    process.exit(1);
  }
}

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

// Erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('❌ Erro não capturado:', error);
  process.exit(1);
});

// Promessas rejeitadas
process.on('unhandledRejection', (reason) => {
  logger.error('❌ Promessa rejeitada:', reason);
});

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

async function shutdown(signal: string) {
  logger.info(`🛑 Recebido ${signal}, encerrando...`);

  finalServer.close(async () => {
    logger.info('✅ Servidor HTTP encerrado');

    try {
      // Parar bot do Telegram
      await telegramBot.parar();
      logger.info('✅ Bot do Telegram encerrado');

      // Desconectar do banco
      await database.desconectar();
      logger.info('✅ Banco de dados desconectado');

      logger.info('👋 Aplicação encerrada com sucesso');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Erro ao encerrar:', error);
      process.exit(1);
    }
  });

  // Forçar encerramento após 10 segundos
  setTimeout(() => {
    logger.error('❌ Forçando encerramento após timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ==========================================
// INICIAR
// ==========================================

iniciar();

export default finalServer;
