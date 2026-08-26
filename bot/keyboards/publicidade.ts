// ==========================================
// FOFOCA BOT - Teclado de Publicidade
// ==========================================

import { Markup } from 'telegraf';

// ==========================================
// TECLADO DE PUBLICIDADE
// ==========================================

export const publicidadeKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('📢 INICIAR ANÚNCIO', 'publicidade:iniciar'),
  ],
  [
    Markup.button.callback('📋 VER FORMATOS', 'publicidade:formatos'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'menu:principal'),
  ],
]);

// ==========================================
// TECLADO DE CONFIRMAÇÃO DE INÍCIO
// ==========================================

export const iniciarPublicidadeKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('✅ COMEÇAR AGORA', 'publicidade:comecar'),
    Markup.button.callback('❌ AGORA NÃO', 'menu:principal'),
  ],
]);

// ==========================================
// TECLADO DE SELEÇÃO DE FORMATO
// ==========================================

export const formatosKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('📱 STORY', 'formato:story'),
  ],
  [
    Markup.button.callback('📝 FEED', 'formato:feed'),
  ],
  [
    Markup.button.callback('🎥 REELS', 'formato:reels'),
  ],
  [
    Markup.button.callback('📦 PACOTE', 'formato:pacote'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'publicidade:voltar'),
  ],
]);

// ==========================================
// EXPORTAÇÃO
// ==========================================

export default {
  publicidadeKeyboard,
  iniciarPublicidadeKeyboard,
  formatosKeyboard,
};
