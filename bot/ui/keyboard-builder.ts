// ==========================================
// FOFOCA BOT - Construtor de Teclados
// ==========================================

import { Markup } from 'telegraf';
import { logger } from '../../config/logger';

// ==========================================
// TIPOS DE BOTÕES
// ==========================================

type Botao = {
  texto: string;
  callback?: string;
  url?: string;
};

type Linha = Botao[];

// ==========================================
// CLASSE KEYBOARD BUILDER
// ==========================================

export class KeyboardBuilder {
  private botoes: Linha[] = [];
  private colunas: number = 2;

  // ==========================================
  // DEFINIR QUANTIDADE DE COLUNAS
  // ==========================================

  setColunas(colunas: number) {
    this.colunas = colunas;
    return this;
  }

  // ==========================================
  // ADICIONAR BOTÃO
  // ==========================================

  addBotao(texto: string, callback: string) {
    const botao: Botao = { texto, callback };
    this.botoes.push([botao]);
    return this;
  }

  // ==========================================
  // ADICIONAR BOTÃO DE URL
  // ==========================================

  addBotaoUrl(texto: string, url: string) {
    const botao: Botao = { texto, url };
    this.botoes.push([botao]);
    return this;
  }

  // ==========================================
  // ADICIONAR LINHA COMPLETA
  // ==========================================

  addLinha(botoes: Botao[]) {
    this.botoes.push(botoes);
    return this;
  }

  // ==========================================
  // ADICIONAR LINHA COM DOIS BOTÕES
  // ==========================================

  addDoisBotoes(botao1: Botao, botao2: Botao) {
    this.botoes.push([botao1, botao2]);
    return this;
  }

  // ==========================================
  // ADICIONAR BOTÃO DE VOLTAR
  // ==========================================

  addVoltar(callback: string = 'menu:principal') {
    return this.addBotao('⬅️ VOLTAR', callback);
  }

  // ==========================================
  // ADICIONAR BOTÃO DE MENU
  // ==========================================

  addMenu() {
    return this.addBotao('🏠 MENU', 'menu:principal');
  }

  // ==========================================
  // CONSTRUIR TECLADO
  // ==========================================

  construir() {
    const botoesFormatados = this.botoes.map((linha) =>
      linha.map((botao) => {
        if (botao.url) {
          return Markup.button.url(botao.texto, botao.url);
        }
        return Markup.button.callback(botao.texto, botao.callback || '');
      })
    );

    this.botoes = [];
    return Markup.inlineKeyboard(botoesFormatados);
  }

  // ==========================================
  // LIMPAR BUILDER
  // ==========================================

  limpar() {
    this.botoes = [];
    this.colunas = 2;
    return this;
  }
}

// ==========================================
// INSTÂNCIA ÚNICA
// ==========================================

export const keyboardBuilder = new KeyboardBuilder();

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

export function criarTecladoSimples(botoes: { texto: string; callback: string }[]) {
  try {
    const teclado = botoes.map((botao) =>
      Markup.button.callback(botao.texto, botao.callback)
    );

    return Markup.inlineKeyboard([teclado]);
  } catch (error) {
    logger.error('❌ Erro ao criar teclado:', error);
    throw error;
  }
}

export function criarTecladoEmGrade(
  botoes: { texto: string; callback: string }[],
  colunas: number = 2
) {
  try {
    const linhas = [];
    for (let i = 0; i < botoes.length; i += colunas) {
      const linha = botoes
        .slice(i, i + colunas)
        .map((botao) => Markup.button.callback(botao.texto, botao.callback));
      linhas.push(linha);
    }

    return Markup.inlineKeyboard(linhas);
  } catch (error) {
    logger.error('❌ Erro ao criar teclado em grade:', error);
    throw error;
  }
}

export default keyboardBuilder;
