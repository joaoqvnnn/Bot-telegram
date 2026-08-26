// ==========================================
// FOFOCA BOT - Webhook do Telegram
// ==========================================

import { Telegraf } from 'telegraf';
import express from 'express';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { bot } from './bot';

// ==========================================
// CONFIGURAÇÃO DO WEBHOOK
// ==========================================

const webhookRouter = express.Router();

// ==========================================
// VERIFICAÇÃO DO WEBHOOK (GET)
// ==========================================

webhookRouter.get('/', (req, res) => {
  const secret = req.query.secret;
  
  if (secret === env.TELEGRAM_WEBHOOK_SECRET) {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  } else {
    res.status(403).json({ erro: 'Acesso negado' });
  }
});

// ==========================================
// RECEBIMENTO DE EVENTOS (POST)
// ==========================================

webhookRouter.post('/', async (req, res) => {
  try {
    const { body } = req;
    
    // Verificar se é uma atualização válida
    if (body.update_id && (body.message || body.callback_query || body.edited_message || body.inline_query)) {
      await bot.handleUpdate(body);
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    logger.error('❌ Erro no webhook do Telegram:', error);
    res.sendStatus(500);
  }
});

// ==========================================
// ROTA DE STATUS DO WEBHOOK
// ==========================================

webhookRouter.get('/status', async (req, res) => {
  try {
    const webhookInfo = await bot.telegram.getWebhookInfo();
    res.status(200).json({
      sucesso: true,
      webhook: webhookInfo,
    });
  } catch (error) {
    logger.error('❌ Erro ao verificar status do webhook:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao verificar status do webhook',
    });
  }
});

// ==========================================
// ROTA DE RECONFIGURAÇÃO
// ==========================================

webhookRouter.post('/reconfigurar', async (req, res) => {
  try {
    // Remover webhook atual
    await bot.telegram.deleteWebhook();
    
    // Configurar novo webhook
    const webhookUrl = `${env.TELEGRAM_WEBHOOK_URL}`;
    await bot.telegram.setWebhook(webhookUrl);
    
    logger.info('✅ Webhook reconfigurado com sucesso');
    
    res.status(200).json({
      sucesso: true,
      mensagem: 'Webhook reconfigurado',
      url: webhookUrl,
    });
  } catch (error) {
    logger.error('❌ Erro ao reconfigurar webhook:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao reconfigurar webhook',
    });
  }
});

export { webhookRouter };
