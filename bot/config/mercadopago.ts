import { env } from './env';

export const mercadopagoConfig = {
  accessToken: env.MERCADO_PAGO_ACCESS_TOKEN,
  publicKey: env.MERCADO_PAGO_PUBLIC_KEY,
  payment: {
    backUrls: {
      success: 'https://seu-bot.onrender.com/sucesso',
      failure: 'https://seu-bot.onrender.com/falha',
      pending: 'https://seu-bot.onrender.com/pendente',
    },
    notificationUrl: 'https://seu-bot.onrender.com/webhook/mercadopago',
  },
};
