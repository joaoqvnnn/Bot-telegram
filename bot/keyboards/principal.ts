// ==========================================
// FOFOCA BOT - Teclado Principal
// ==========================================

import { Markup } from 'telegraf';

// ==========================================
// TECLADO PRINCIPAL
// ==========================================

export const principalKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('📢 QUERO ANUNCIAR', 'menu:anunciar'),
  ],
  [
    Markup.button.callback('📋 MEUS PEDIDOS', 'menu:pedidos'),
    Markup.button.callback('💰 VALORES', 'menu:valores'),
  ],
  [
    Markup.button.callback('👤 MINHA CONTA', 'menu:conta'),
    Markup.button.callback('🆘 SUPORTE', 'menu:suporte'),
  ],
]);

// ==========================================
// TECLADO DE RETORNO
// ==========================================

export const voltarKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('⬅️ VOLTAR AO MENU', 'menu:principal'),
  ],
]);

// ==========================================
// TECLADO DE CONFIRMAÇÃO
// ==========================================

export const confirmacaoKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('✅ CONFIRMAR', 'confirmar:sim'),
    Markup.button.callback('❌ CANCELAR', 'confirmar:nao'),
  ],
]);

// ==========================================
// TECLADO DE CONTINUAÇÃO
// ==========================================

export const continuarKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('▶️ CONTINUAR', 'continuar'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'voltar'),
  ],
]);

// ==========================================
// EXPORTAÇÃO
// ==========================================

export default {
  principalKeyboard,
  voltarKeyboard,
  confirmacaoKeyboard,
  continuarKeyboard,
};
