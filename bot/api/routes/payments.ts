// ==========================================
// FOFOCA BOT - Rotas de Payments
// ==========================================

import express from 'express';
import { PaymentModel } from '../../database/models/Payment';
import { createPayment } from '../../mercadopago/create-payment';
import { getPayment } from '../../mercadopago/get-payment';

const router = express.Router();

// ==========================================
// LISTAR PAGAMENTOS
// ==========================================

router.get('/', async (req, res) => {
  try {
    const payments = await PaymentModel.obterTodos();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar pagamentos' });
  }
});

// ==========================================
// OBTER PAGAMENTO
// ==========================================

router.get('/:id', async (req, res) => {
  try {
    const payment = await PaymentModel.obterPorId(parseInt(req.params.id));

    if (!payment) {
      return res.status(404).json({ erro: 'Pagamento não encontrado' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao obter pagamento' });
  }
});

// ==========================================
// CRIAR PAGAMENTO
// ==========================================

router.post('/', async (req, res) => {
  try {
    const { application_id, amount } = req.body;

    const resultado = await createPayment(amount);

    if (!resultado.sucesso) {
      return res.status(400).json({ erro: 'Erro ao criar pagamento' });
    }

    const payment = await PaymentModel.criar({
      application_id,
      provider: 'MERCADO_PAGO',
      external_payment_id: resultado.id,
      amount,
    });

    res.status(201).json({
      payment,
      url: resultado.url,
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar pagamento' });
  }
});

export default router;
