// ==========================================
// FOFOCA BOT - Handler de Callback Query
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';

// ==========================================
// IMPORTAÇÃO DE FLUXOS
// ==========================================

import { publicidadeFlow } from '../../flows/publicidade/publicidade.flow';
import { suporteFlow } from '../../flows/suporte/suporte.flow';

// ==========================================
// IMPORTAÇÃO DE SERVIÇOS
// ==========================================

import { sessionManager } from '../../flows/session-manager';

// ==========================================
// HANDLER PRINCIPAL DE CALLBACK QUERY
// ==========================================

export const callbackQueryHandler = async (ctx: Context) => {
  try {
    const callbackData = (ctx.callbackQuery as any)?.data;
    
    if (!callbackData) {
      await ctx.answerCbQuery();
      return;
    }

    const user = ctx.from;
    logger.info(`🔘 Callback: ${callbackData} - Usuário: ${user?.id}`);

    // Separar o callback em partes
    const [prefix, action] = callbackData.split(':');

    // Responder ao callback
    await ctx.answerCbQuery();

    // Roteamento por prefixo
    switch (prefix) {
      case 'menu':
        await handleMenuCallback(ctx, action);
        break;

      case 'publicidade':
        await publicidadeFlow.handleCallback(ctx, action);
        break;

      case 'formato':
        await publicidadeFlow.handleFormato(ctx, action);
        break;

      case 'data':
        await publicidadeFlow.handleData(ctx, action);
        break;

      case 'pagamento':
        await handlePagamentoCallback(ctx, action);
        break;

      case 'pedidos':
        await handlePedidosCallback(ctx, action);
        break;

      case 'pedido':
        await handlePedidoCallback(ctx, action);
        break;

      case 'conta':
        await handleContaCallback(ctx, action);
        break;

      case 'config':
        await handleConfigCallback(ctx, action);
        break;

      case 'notificacoes':
        await handleNotificacoesCallback(ctx, action);
        break;

      case 'suporte':
        await suporteFlow.handleCallback(ctx, action);
        break;

      case 'confirmar':
        await handleConfirmarCallback(ctx, action);
        break;

      case 'envio':
        await handleEnvioCallback(ctx, action);
        break;

      case 'final':
        await handleFinalCallback(ctx, action);
        break;

      default:
        logger.warn(`⚠️ Callback não reconhecido: ${callbackData}`);
        await ctx.reply('❌ Ação não reconhecida.');
        break;
    }
  } catch (error) {
    logger.error('❌ Erro no callback query:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

// ==========================================
// HANDLER DE MENU
// ==========================================

async function handleMenuCallback(ctx: Context, action: string) {
  switch (action) {
    case 'anunciar':
      await ctx.reply('📢 Vamos começar seu anúncio!');
      await publicidadeFlow.iniciar(ctx);
      break;

    case 'pedidos':
      await ctx.reply('📋 Seus pedidos:');
      await ctx.reply('Use os botões abaixo:');
      break;

    case 'valores':
      await ctx.reply('💰 Valores dos formatos:');
      await ctx.reply('📱 Story - R$ XX\n📝 Feed - R$ XX\n🎥 Reels - R$ XX\n📦 Pacote - R$ XX');
      break;

    case 'conta':
      await ctx.reply('👤 Sua conta:');
      break;

    case 'suporte':
      await ctx.reply('🆘 Suporte:');
      break;

    case 'principal':
      await ctx.reply('🏠 Menu principal:');
      break;

    default:
      logger.warn(`⚠️ Menu não reconhecido: ${action}`);
      break;
  }
}

// ==========================================
// HANDLER DE PAGAMENTO
// ==========================================

async function handlePagamentoCallback(ctx: Context, action: string) {
  switch (action) {
    case 'iniciar':
      await ctx.reply('💳 Iniciando pagamento...');
      break;

    case 'detalhes':
      await ctx.reply('📋 Detalhes do pedido:');
      break;

    case 'confirmar':
      await ctx.reply('🔄 Verificando pagamento...');
      break;

    case 'tentar':
      await ctx.reply('🔄 Tentando novamente...');
      break;

    case 'cancelar':
      await ctx.reply('❌ Pedido cancelado.');
      break;

    case 'status':
      await ctx.reply('🔄 Verificando status...');
      break;

    case 'aprovado':
      await ctx.reply('🎉 Pagamento aprovado!');
      break;

    case 'metodo':
      await ctx.reply('💳 Escolha outro método:');
      break;

    default:
      logger.warn(`⚠️ Pagamento não reconhecido: ${action}`);
      break;
  }
}

// ==========================================
// HANDLER DE PEDIDOS
// ==========================================

async function handlePedidosCallback(ctx: Context, action: string) {
  switch (action) {
    case 'ativos':
      await ctx.reply('📋 Pedidos ativos:');
      break;

    case 'historico':
      await ctx.reply('📜 Histórico de pedidos:');
      break;

    case 'voltar':
      await ctx.reply('⬅️ Voltando...');
      break;

    default:
      logger.warn(`⚠️ Pedidos não reconhecido: ${action}`);
      break;
  }
}

// ==========================================
// HANDLER DE PEDIDO
// ==========================================

async function handlePedidoCallback(ctx: Context, action: string) {
  switch (action) {
    case 'pagar':
      await ctx.reply('💳 Iniciando pagamento...');
      break;

    case 'detalhes':
      await ctx.reply('📋 Detalhes do pedido:');
      break;

    case 'cancelar':
      await ctx.reply('❌ Cancelar pedido:');
      break;

    case 'atualizar':
      await ctx.reply('🔄 Atualizando status...');
      break;

    case 'confirmar-cancelar':
      await ctx.reply('✅ Pedido cancelado com sucesso.');
      break;

    case 'manter':
      await ctx.reply('✅ Pedido mantido.');
      break;

    default:
      logger.warn(`⚠️ Pedido não reconhecido: ${action}`);
      break;
  }
}

// ==========================================
// HANDLER DE CONTA
// ==========================================

async function handleContaCallback(ctx: Context, action: string) {
  switch (action) {
    case 'dados':
      await ctx.reply('📋 Seus dados:');
      break;

    case 'estatisticas':
      await ctx.reply('📊 Suas estatísticas:');
      break;

    case 'configuracoes':
      await ctx.reply('⚙️ Configurações:');
      break;

    case 'voltar':
      await ctx.reply('⬅️ Voltando...');
      break;

    default:
      logger.warn(`⚠️ Conta não reconhecida: ${action}`);
      break;
  }
}

// ==========================================
// HANDLER DE CONFIGURAÇÕES
// ==========================================

async function handleConfigCallback(ctx: Context, action: string) {
  switch (action) {
    case 'notificacoes':
      await ctx.reply('🔔 Configurações de notificações:');
      break;

    case 'editar':
      await ctx.reply('✏️ Editar dados:');
      break;

    case 'voltar':
      await ctx.reply('⬅️ Voltando...');
      break;

    default:
      logger.warn(`⚠️ Configuração não reconhecida: ${action}`);
      break;
  }
}

// ==========================================
// HANDLER DE NOTIFICAÇÕES
// ==========================================

async function handleNotificacoesCallback(ctx: Context, action: string) {
  switch (action) {
    case 'ativar':
      await ctx.reply('🔔 Notificações ativadas.');
      break;

    case 'desativar':
      await ctx.reply('🔕 Notificações desativadas.');
      break;

    default:
      logger.warn(`⚠️ Notificação não reconhecida: ${action}`);
      break;
  }
}

// ==========================================
// HANDLER DE CONFIRMAÇÃO
// ==========================================

async function handleConfirmarCallback(ctx: Context, action: string) {
  switch (action) {
    case 'sim':
      await ctx.reply('✅ Confirmado!');
      break;

    case 'nao':
      await ctx.reply('❌ Cancelado.');
      break;

    default:
      logger.warn(`⚠️ Confirmação não reconhecida: ${action}`);
      break;
  }
}

// ==========================================
// HANDLER DE ENVIO
// ==========================================

async function handleEnvioCallback(ctx: Context, action: string) {
  switch (action) {
    case 'confirmar':
      await ctx.reply('📤 Enviando solicitação...');
      break;

    case 'editar':
      await ctx.reply('✏️ Editar dados:');
      break;

    default:
      logger.warn(`⚠️ Envio não reconhecido: ${action}`);
      break;
  }
}

// ==========================================
// HANDLER DE FINALIZAÇÃO
// ==========================================

async function handleFinalCallback(ctx: Context, action: string) {
  switch (action) {
    case 'concluir':
      await ctx.reply('🎉 Concluído!');
      break;

    default:
      logger.warn(`⚠️ Final não reconhecido: ${action}`);
      break;
  }
}
