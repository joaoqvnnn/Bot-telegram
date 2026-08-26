// ==========================================
// FOFOCA BOT - Teclado de Pagamento
// ==========================================

import { Markup } from 'telegraf';

// ==========================================
// TECLADO DE PAGAMENTO
// ==========================================

export const pagamentoKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('💳 PAGAR COM MERCADO PAGO', 'pagamento:iniciar'),
  ],
  [
    Markup.button.callback('📋 VER DETALHES DO PEDIDO', 'pagamento:detalhes'),
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
    Markup.button.callback('✅ JÁ PAGUEI', 'pagamento:confirmar'),
  ],
  [
    Markup.button.callback('🔄 TENTAR NOVAMENTE', 'pagamento:tentar'),
  ],
  [
    Markup.button.callback('❌ CANCELAR PEDIDO', 'pagamento:cancelar'),
  ],
]);

// ==========================================
// TECLADO DE STATUS DE PAGAMENTO
// ==========================================

export const statusPagamentoKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🔄 VERIFICAR STATUS', 'pagamento:status'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'menu:principal'),
  ],
]);

// ==========================================
// TECLADO DE PAGAMENTO APROVADO
// ==========================================

export const pagamentoAprovadoKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🎉 VER CONFIRMAÇÃO', 'pagamento:aprovado'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR AO MENU', 'menu:principal'),
  ],
]);

// ==========================================
// TECLADO DE PAGAMENTO RECUSADO
// ==========================================

export const pagamentoRecusadoKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🔄 TENTAR NOVAMENTE', 'pagamento:tentar'),
  ],
  [
    Markup.button.callback('💳 OUTRO MÉTODO', 'pagamento:metodo'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'menu:principal'),
  ],
]);

// ==========================================
// EXPORTAÇÃO
// ==========================================

export default {
  pagamentoKeyboard,
  confirmarPagamentoKeyboard,
  statusPagamentoKeyboard,
  pagamentoAprovadoKeyboard,
  pagamentoRecusadoKeyboard,
};
