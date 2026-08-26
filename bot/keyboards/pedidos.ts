// ==========================================
// FOFOCA BOT - Teclado de Pedidos
// ==========================================

import { Markup } from 'telegraf';

// ==========================================
// TECLADO DE PEDIDOS
// ==========================================

export const pedidosKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('📋 PEDIDOS ATIVOS', 'pedidos:ativos'),
    Markup.button.callback('📜 HISTÓRICO', 'pedidos:historico'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'menu:principal'),
  ],
]);

// ==========================================
// TECLADO DE AÇÕES DO PEDIDO
// ==========================================

export const acoesPedidoKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('💳 PAGAR', 'pedido:pagar'),
    Markup.button.callback('📋 DETALHES', 'pedido:detalhes'),
  ],
  [
    Markup.button.callback('❌ CANCELAR', 'pedido:cancelar'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'pedidos:voltar'),
  ],
]);

// ==========================================
// TECLADO DE DETALHES DO PEDIDO
// ==========================================

export const detalhesPedidoKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🔄 ATUALIZAR STATUS', 'pedido:atualizar'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'pedidos:voltar'),
  ],
]);

// ==========================================
// TECLADO DE CANCELAMENTO
// ==========================================

export const cancelarPedidoKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('✅ SIM, CANCELAR', 'pedido:confirmar-cancelar'),
  ],
  [
    Markup.button.callback('❌ NÃO, MANTER', 'pedido:manter'),
  ],
]);

// ==========================================
// EXPORTAÇÃO
// ==========================================

export default {
  pedidosKeyboard,
  acoesPedidoKeyboard,
  detalhesPedidoKeyboard,
  cancelarPedidoKeyboard,
};
