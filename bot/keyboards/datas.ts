// ==========================================
// FOFOCA BOT - Teclado de Datas
// ==========================================

import { Markup } from 'telegraf';

// ==========================================
// TECLADO DE DATAS
// ==========================================

export const datasKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('📅 HOJE', 'data:hoje'),
    Markup.button.callback('📅 AMANHÃ', 'data:amanha'),
  ],
  [
    Markup.button.callback('📅 ESTA SEMANA', 'data:semana'),
  ],
  [
    Markup.button.callback('📅 ESCOLHER DATA', 'data:escolher'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'menu:principal'),
  ],
]);

// ==========================================
// TECLADO DE CONFIRMAÇÃO DE DATA
// ==========================================

export const confirmarDataKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('✅ CONFIRMAR DATA', 'data:confirmar'),
  ],
  [
    Markup.button.callback('🔄 TROCAR DATA', 'data:trocar'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'menu:principal'),
  ],
]);

// ==========================================
// TECLADO DE DIAS DISPONÍVEIS
// ==========================================

export const diasDisponiveisKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('15/09 - Segunda', 'data:15-09'),
    Markup.button.callback('16/09 - Terça', 'data:16-09'),
  ],
  [
    Markup.button.callback('17/09 - Quarta', 'data:17-09'),
    Markup.button.callback('18/09 - Quinta', 'data:18-09'),
  ],
  [
    Markup.button.callback('19/09 - Sexta', 'data:19-09'),
    Markup.button.callback('20/09 - Sábado', 'data:20-09'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'data:voltar'),
  ],
]);

// ==========================================
// EXPORTAÇÃO
// ==========================================

export default {
  datasKeyboard,
  confirmarDataKeyboard,
  diasDisponiveisKeyboard,
};
