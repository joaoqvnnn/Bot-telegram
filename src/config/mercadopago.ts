// ==========================================
// FOFOCA BOT - Configuração do Mercado Pago
// ==========================================

import mercadopago from 'mercadopago';
import { env } from './env';

// ==========================================
// CONFIGURAÇÃO DO MERCADO PAGO
// ==========================================

mercadopago.configure({
  access_token: env.MERCADO_PAGO_ACCESS_TOKEN || '',
});

// ==========================================
// CONFIGURAÇÕES DO MERCADO PAGO
// ==========================================

const mercadopagoConfig = {
  accessToken: env.MERCADO_PAGO_ACCESS_TOKEN,
  publicKey: env.MERCADO_PAGO_PUBLIC_KEY,
  webhookSecret: env.MERCADO_PAGO_WEBHOOK_SECRET,

  // Configurações de pagamento
  payment: {
    // Métodos de pagamento aceitos
    paymentMethods: {
      excluded: [
        { id: 'bolbradesco' },
        { id: 'pec' },
      ],
    },

    // Parcelamento
    installments: 1,

    // URL de retorno
    backUrls: {
      success: `${env.APP_URL}/pagamento/sucesso`,
      failure: `${env.APP_URL}/pagamento/falha`,
      pending: `${env.APP_URL}/pagamento/pendente`,
    },

    // Notificação
    notificationUrl: `${env.APP_URL}/webhook/mercadopago`,
  },

  // Status de pagamento
  statusMap: {
    APPROVED: 'approved',
    PENDING: 'pending',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
  } as const,
};

export { mercadopago, mercadopagoConfig };
