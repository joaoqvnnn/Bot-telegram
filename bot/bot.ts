// ==========================================
// FOFOCA BOT - Configuração Principal do Bot
// ==========================================

import { Telegraf } from 'telegraf';
import { env } from '../config/env';
import { telegramConfig } from '../config/telegram';
import { logger } from '../config/logger';

// ==========================================
// IMPORTAÇÃO DE COMMANDS
// ==========================================

import { startCommand } from './commands/start';
import { ajudaCommand } from './commands/ajuda';
import { anunciarCommand } from './commands/anunciar';
import { pedidosCommand } from './commands/pedidos';
import { valoresCommand } from './commands/valores';
import { contaCommand } from './commands/conta';
import { suporteCommand } from './commands/suporte';

// ==========================================
// IMPORTAÇÃO DE HANDLERS
// ==========================================

import { callbackQueryHandler } from './handlers/callback-query';
import { textMessageHandler } from './handlers/text-message';
import { commandHandler } from './handlers/command';
import { inlineQueryHandler } from './handlers/inline-query';
import { errorHandler } from './handlers/error-handler';

// ==========================================
// INICIALIZAÇÃO DO BOT
// ==========================================

const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN || '');

// ==========================================
// CONFIGURAÇÃO DE COMMANDS
// ==========================================

const commands = [
  { command: 'start', description: '🚀 Iniciar o bot' },
  { command: 'ajuda', description: '❓ Como funciona' },
  { command: 'anunciar', description: '📢 Quero anunciar' },
  { command: 'pedidos', description: '📋 Meus pedidos' },
  { command: 'valores', description: '💰 Valores' },
  { command: 'conta', description: '👤 Minha conta' },
  { command: 'suporte', description: '🆘 Suporte' },
];

// ==========================================
// REGISTRO DE COMMANDS
// ==========================================

bot.start(startCommand);
bot.help(ajudaCommand);
bot.command('anunciar', anunciarCommand);
bot.command('pedidos', pedidosCommand);
bot.command('valores', valoresCommand);
bot.command('conta', contaCommand);
bot.command('suporte', suporteCommand);

// ==========================================
// REGISTRO DE HANDLERS
// ==========================================

// Callback Query (botões inline)
bot.on('callback_query', callbackQueryHandler);

// Mensagens de texto
bot.on('text', textMessageHandler);

// Comandos não reconhecidos
bot.on('text', commandHandler);

// Inline Query (modo inline)
bot.on('inline_query', inlineQueryHandler);

// ==========================================
// CONFIGURAÇÃO DE ERROS
// ==========================================

bot.catch(errorHandler);

// ==========================================
// FUNÇÕES DO BOT
// ==========================================

async function iniciar() {
  try {
    if (env.NODE_ENV === 'production' && env.TELEGRAM_WEBHOOK_URL) {
      // Modo webhook (produção)
      await bot.telegram.setWebhook(env.TELEGRAM_WEBHOOK_URL);
      await bot.telegram.setMyCommands(commands);
      logger.info('✅ Bot configurado em modo webhook');
    } else {
      // Modo polling (desenvolvimento)
      await bot.telegram.setMyCommands(commands);
      await bot.launch();
      logger.info('✅ Bot configurado em modo polling');
    }
  } catch (error) {
    logger.error('❌ Erro ao iniciar bot:', error);
    throw error;
  }
}

async function parar() {
  try {
    bot.stop();
    logger.info('✅ Bot parado');
  } catch (error) {
    logger.error('❌ Erro ao parar bot:', error);
  }
}

// ==========================================
// EXPORTAÇÃO
// ==========================================

const telegramBot = {
  bot,
  iniciar,
  parar,
};

export { bot, telegramBot };
