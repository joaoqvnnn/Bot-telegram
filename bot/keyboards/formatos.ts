// ==========================================
// FOFOCA BOT - Teclado de Formatos
// ==========================================

import { Markup } from 'telegraf';

// ==========================================
// TECLADO DE FORMATOS
// ==========================================

export const formatosKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('📱 STORY', 'formato:story'),
    Markup.button.callback('📝 FEED', 'formato:feed'),
  ],
  [
    Markup.button.callback('🎥 REELS', 'formato:reels'),
    Markup.button.callback('📦 PACOTE', 'formato:pacote'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'menu:principal'),
  ],
]);

// ==========================================
// TECLADO DE CONFIRMAÇÃO DE FORMATO
// ==========================================

export const confirmarFormatoKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('✅ CONFIRMAR FORMATO', 'formato:confirmar'),
  ],
  [
    Markup.button.callback('🔄 TROCAR FORMATO', 'formato:trocar'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'menu:principal'),
  ],
]);

// ==========================================
// TECLADO DE DETALHES
// ==========================================

export const detalhesFormatoKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('💳 ESCOLHER ESTE', 'formato:escolher'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'formato:voltar'),
  ],
]);

// ==========================================
// EXPORTAÇÃO
// ==========================================

export default {
  formatosKeyboard,
  confirmarFormatoKeyboard,
  detalhesFormatoKeyboard,
};
