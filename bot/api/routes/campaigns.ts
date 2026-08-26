// ==========================================
// FOFOCA BOT - Rotas de Campaigns
// ==========================================

import express from 'express';
import { CampaignModel } from '../../database/models/Campaign';

const router = express.Router();

// ==========================================
// LISTAR CAMPANHAS
// ==========================================

router.get('/', async (req, res) => {
  try {
    const campaigns = await CampaignModel.obterTodas();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar campanhas' });
  }
});

// ==========================================
// OBTER CAMPANHA
// ==========================================

router.get('/:id', async (req, res) => {
  try {
    const campaign = await CampaignModel.obterPorId(parseInt(req.params.id));

    if (!campaign) {
      return res.status(404).json({ erro: 'Campanha não encontrada' });
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter campanha' });
  }
});

// ==========================================
// CRIAR CAMPANHA
// ==========================================

router.post('/', async (req, res) => {
  try {
    const campaign = await CampaignModel.criar(req.body);

    if (!campaign) {
      return res.status(400).json({ erro: 'Erro ao criar campanha' });
    }

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar campanha' });
  }
});

// ==========================================
// ATUALIZAR STATUS
// ==========================================

router.patch('/:id/status', async (req, res) => {
  try {
    const sucesso = await CampaignModel.atualizarStatus(parseInt(req.params.id), req.body.status);

    if (!sucesso) {
      return res.status(400).json({ erro: 'Erro ao atualizar status' });
    }

    res.json({ sucesso: true });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar status' });
  }
});

export default router;
