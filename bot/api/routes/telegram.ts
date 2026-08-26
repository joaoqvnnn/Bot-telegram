// ==========================================
// FOFOCA BOT - Rotas Telegram
// ==========================================

import express from 'express';
import { bot } from '../../bot/bot';

const router = express.Router();

// ==========================================
// WEBHOOK DO TELEGRAM
// ==========================================

router.post('/webhook', async (req, res) => {
  try {
    const { body } = req;

    if (body.update_id && (body.message || body.callback_query)) {
      await bot.handleUpdate(body);
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.sendStatus(500);
  }
});

// ==========================================
// STATUS DO BOT
// ==========================================

router.get('/status', async (req, res) => {
  try {
    const info = await bot.telegram.getMe();
    const webhook = await bot.telegram.getWebhookInfo();

    res.json({
      bot: info,
      webhook,
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter status' });
  }
});

export default router;
