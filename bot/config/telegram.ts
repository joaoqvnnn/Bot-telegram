import { Telegraf } from 'telegraf';
import { env } from './env';

const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

export const telegramConfig = {
  token: env.TELEGRAM_BOT_TOKEN,
  messages: {
    erroGenerico: '❌ Ocorreu um erro. Tente novamente.',
    sucessoEnvio: '✅ Solicitação enviada!',
  },
};

export { bot };
