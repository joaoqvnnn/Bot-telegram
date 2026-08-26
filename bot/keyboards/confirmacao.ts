// ==========================================
// FOFOCA BOT - Teclado de Confirmação
// ==========================================

import { Markup } from 'telegraf';

// ==========================================
// TECLADO DE CONFIRMAÇÃO GERAL
// ==========================================

export const confirmacaoKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('✅ CONFIRMAR', 'confirmar:sim'),
    Markup.button.callback('❌ CANCELAR', 'confirmar:nao'),
  ],
]);

// ==========================================
// TECLADO DE CONFIRMAÇÃO DE ENVIO
// ==========================================

export const confirmarEnvioKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('📤 ENVIAR SOLICITAÇÃO', 'envio:confirmar'),
  ],
  [
    Markup.button.callback('✏️ EDITAR DADOS', 'envio:editar'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'menu:principal'),
  ],
]);

// ==========================================
// TECLADO DE CONFIRMAÇÃO DE PAGAMENTO
// ==========================================

export const confirmarPagamentoKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('💳 PAGAR AGORA', 'pagamento:iniciar'),
  ],
  [
    Markup.button.callback('⏰ PAGAR DEPOIS', 'pagamento:depois'),
  ],
  [
    Markup.button.callback('❌ CANCELAR PEDIDO', 'pagamento:cancelar'),
  ],
]);

// ==========================================
// TECLADO DE CONFIRMAÇÃO FINAL
// ==========================================

export const confirmarFinalKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🎉 CONCLUIR', 'final:concluir'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR AO MENU', 'menu:principal'),
  ],
]);

// ==========================================
// EXPORTAÇÃO
// ==========================================

export default {
  confirmacaoKeyboard,
  confirmarEnvioKeyboard,
  confirmarPagamentoKeyboard,
  confirmarFinalKeyboard,
};
