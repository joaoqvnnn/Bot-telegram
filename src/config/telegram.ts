// ==========================================
// FOFOCA BOT - Configuração do Telegram
// ==========================================

import { Telegraf } from 'telegraf';
import { env } from './env';

// ==========================================
// INICIALIZAÇÃO DO BOT
// ==========================================

const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN || '');

// ==========================================
// CONFIGURAÇÕES DO BOT
// ==========================================

const telegramConfig = {
  // Token do bot
  token: env.TELEGRAM_BOT_TOKEN,

  // Webhook
  webhookUrl: env.TELEGRAM_WEBHOOK_URL,
  webhookSecret: env.TELEGRAM_WEBHOOK_SECRET,

  // Configurações de polling
  polling: {
    timeout: 30,
    limit: 100,
  },

  // Configurações de mensagens
  messages: {
    // Mensagens de erro
    erroGenerico: '❌ Ocorreu um erro. Tente novamente.',
    erroPermissao: '⚠️ Você não tem permissão para isso.',
    erroSessao: '⏰ Sua sessão expirou. Use /start para recomeçar.',
    erroFormato: '📝 Formato inválido. Verifique e tente novamente.',
    erroDuplicado: '🔄 Você já possui uma solicitação em andamento.',

    // Mensagens de sucesso
    sucessoCadastro: '✅ Cadastro realizado com sucesso!',
    sucessoEnvio: '✅ Solicitação enviada com sucesso!',
    sucessoPagamento: '🎉 Pagamento confirmado!',

    // Mensagens de status
    statusPreenchendo: '🟡 Preenchendo formulário...',
    statusValidando: '🔍 Validando dados...',
    statusAnalisando: '🤖 Analisando regras...',
    statusAprovado: '✅ Aprovado!',
    statusRecusado: '❌ Recusado.',
    statusRevisao: '🟡 Em revisão manual.',
  },

  // Configurações de UI
  ui: {
    // Botões principais
    botaoAnunciar: '📢 QUERO ANUNCIAR',
    botaoPedidos: '📋 MEUS PEDIDOS',
    botaoValores: '💰 VALORES',
    botaoConta: '👤 MINHA CONTA',
    botaoSuporte: '🆘 SUPORTE',
    botaoEditar: '✏️ Editar',
    botaoEnviar: '✅ Enviar',
    botaoConfirmar: '✅ CONFIRMAR',
    botaoCancelar: '❌ CANCELAR',
    botaoPagar: '💳 PAGAR COM MERCADO PAGO',
  },
};

export { bot, telegramConfig };
