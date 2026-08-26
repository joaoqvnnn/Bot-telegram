// ==========================================
// FOFOCA BOT - Rota Health
// ==========================================

import express from 'express';
import { database } from '../../config/database';

const router = express.Router();

// ==========================================
// VERIFICAÇÃO DE SAÚDE
// ==========================================

router.get('/', async (req, res) => {
  try {
    const status = {
      app: 'Fofoca Bot',
      versao: '1.0.0',
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({
      status: 'erro',
      mensagem: 'Erro ao verificar saúde',
    });
  }
});

// ==========================================
// VERIFICAÇÃO DO BANCO
// ==========================================

router.get('/banco', async (req, res) => {
  try {
    await database.postgres.query('SELECT 1');
    res.status(200).json({ banco: 'ok' });
  } catch (error) {
    res.status(500).json({ banco: 'erro' });
  }
});

// ==========================================
// VERIFICAÇÃO DO REDIS
// ==========================================

router.get('/redis', async (req, res) => {
  try {
    await database.redis.ping();
    res.status(200).json({ redis: 'ok' });
  } catch (error) {
    res.status(500).json({ redis: 'erro' });
  }
});

export default router;
