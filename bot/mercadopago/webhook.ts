// ==========================================
// FOFOCA BOT - Webhook Mercado Pago
// ==========================================

import express from 'express';
import { logger } from '../config/logger';
import { mercadopagoClient } from './client';

const webhookRouter = express.Router();

webhookRouter.post('/', async (req, res) => {
  try {
    const { body } = req;

    logger.info('📩 Webhook Mercado Pago recebido:', body);

    if (body.type === 'payment') {
      const paymentId = body.data.id;
      const detalhes = await mercadopagoClient.obterDetalhes(paymentId);

      if (detalhes) {
        logger.info(`✅ Pagamento ${paymentId} processado via webhook`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    logger.error('❌ Erro no webhook do Mercado Pago:', error);
    res.sendStatus(500);
  }
});

webhookRouter.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export { webhookRouter };
