// ==========================================
// FOFOCA BOT - Rotas Admin
// ==========================================

import express from 'express';
import { ApplicationModel } from '../../database/models/Application';
import { CampaignModel } from '../../database/models/Campaign';
import { PaymentModel } from '../../database/models/Payment';
import { RuleModel } from '../../database/models/Rule';
import { SettingModel } from '../../database/models/Setting';
import { AuditLogModel } from '../../database/models/AuditLog';

const router = express.Router();

// ==========================================
// DASHBOARD
// ==========================================

router.get('/dashboard', async (req, res) => {
  try {
    const totalApplications = await ApplicationModel.contarTodas();
    const totalCampaigns = await CampaignModel.contarTodas();
    const totalPayments = await PaymentModel.contarTodos();

    res.json({
      totalApplications,
      totalCampaigns,
      totalPayments,
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter dashboard' });
  }
});

// ==========================================
// SOLICITAÇÕES PENDENTES
// ==========================================

router.get('/applications/pendentes', async (req, res) => {
  try {
    const pendentes = await ApplicationModel.obterPendentes();
    res.json(pendentes);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter pendentes' });
  }
});

// ==========================================
// APROVAR SOLICITAÇÃO
// ==========================================

router.post('/applications/:id/aprovar', async (req, res) => {
  try {
    const sucesso = await ApplicationModel.aprovar(parseInt(req.params.id));

    if (!sucesso) {
      return res.status(400).json({ erro: 'Erro ao aprovar' });
    }

    res.json({ sucesso: true });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao aprovar' });
  }
});

// ==========================================
// RECUSAR SOLICITAÇÃO
// ==========================================

router.post('/applications/:id/recusar', async (req, res) => {
  try {
    const sucesso = await ApplicationModel.recusar(
      parseInt(req.params.id),
      req.body.motivo
    );

    if (!sucesso) {
      return res.status(400).json({ erro: 'Erro ao recusar' });
    }

    res.json({ sucesso: true });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao recusar' });
  }
});

// ==========================================
// GERENCIAR REGRAS
// ==========================================

router.get('/regras', async (req, res) => {
  try {
    const regras = await RuleModel.obterTodas();
    res.json(regras);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter regras' });
  }
});

router.post('/regras', async (req, res) => {
  try {
    const regra = await RuleModel.criar(req.body);

    if (!regra) {
      return res.status(400).json({ erro: 'Erro ao criar regra' });
    }

    res.status(201).json(regra);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar regra' });
  }
});

// ==========================================
// GERENCIAR CONFIGURAÇÕES
// ==========================================

router.get('/settings', async (req, res) => {
  try {
    const settings = await SettingModel.obterTodas();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter configurações' });
  }
});

router.post('/settings', async (req, res) => {
  try {
    const setting = await SettingModel.criar(req.body);

    if (!setting) {
      return res.status(400).json({ erro: 'Erro ao criar configuração' });
    }

    res.status(201).json(setting);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar configuração' });
  }
});

// ==========================================
// LOGS DE AUDITORIA
// ==========================================

router.get('/logs', async (req, res) => {
  try {
    const logs = await AuditLogModel.obterTodos();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter logs' });
  }
});

export default router;
