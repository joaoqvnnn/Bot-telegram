// ==========================================
// FOFOCA BOT - Rotas de Applications
// ==========================================

import express from 'express';
import { ApplicationModel } from '../../database/models/Application';

const router = express.Router();

// ==========================================
// LISTAR SOLICITAÇÕES
// ==========================================

router.get('/', async (req, res) => {
  try {
    const applications = await ApplicationModel.obterTodas();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar solicitações' });
  }
});

// ==========================================
// OBTER SOLICITAÇÃO
// ==========================================

router.get('/:id', async (req, res) => {
  try {
    const application = await ApplicationModel.obterPorId(parseInt(req.params.id));

    if (!application) {
      return res.status(404).json({ erro: 'Solicitação não encontrada' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter solicitação' });
  }
});

// ==========================================
// CRIAR SOLICITAÇÃO
// ==========================================

router.post('/', async (req, res) => {
  try {
    const application = await ApplicationModel.criar(req.body);

    if (!application) {
      return res.status(400).json({ erro: 'Erro ao criar solicitação' });
    }

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar solicitação' });
  }
});

// ==========================================
// ATUALIZAR STATUS
// ==========================================

router.patch('/:id/status', async (req, res) => {
  try {
    const sucesso = await ApplicationModel.atualizarStatus(parseInt(req.params.id), req.body.status);

    if (!sucesso) {
      return res.status(400).json({ erro: 'Erro ao atualizar status' });
    }

    res.json({ sucesso: true });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar status' });
  }
});

export default router;
