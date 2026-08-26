// ==========================================
// FOFOCA BOT - Teclado de Conta
// ==========================================

import { Markup } from 'telegraf';

// ==========================================
// TECLADO DE CONTA
// ==========================================

export const contaKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('📋 DADOS PESSOAIS', 'conta:dados'),
  ],
  [
    Markup.button.callback('📊 MINHAS ESTATÍSTICAS', 'conta:estatisticas'),
  ],
  [
    Markup.button.callback('⚙️ CONFIGURAÇÕES', 'conta:configuracoes'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'menu:principal'),
  ],
]);

// ==========================================
// TECLADO DE CONFIGURAÇÕES
// ==========================================

export const configuracoesContaKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🔔 NOTIFICAÇÕES', 'config:notificacoes'),
  ],
  [
    Markup.button.callback('✏️ EDITAR DADOS', 'config:editar'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'conta:voltar'),
  ],
]);

// ==========================================
// TECLADO DE NOTIFICAÇÕES
// ==========================================

export const notificacoesKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('🔔 ATIVAR', 'notificacoes:ativar'),
    Markup.button.callback('🔕 DESATIVAR', 'notificacoes:desativar'),
  ],
  [
    Markup.button.callback('⬅️ VOLTAR', 'config:voltar'),
  ],
]);

// ==========================================
// TECLADO DE ESTATÍSTICAS
// ==========================================

export const estatisticasKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('⬅️ VOLTAR', 'conta:voltar'),
  ],
]);

// ==========================================
// EXPORTAÇÃO
// ==========================================

export default {
  contaKeyboard,
  configuracoesContaKeyboard,
  notificacoesKeyboard,
  estatisticasKeyboard,
};
