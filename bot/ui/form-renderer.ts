// ==========================================
// FOFOCA BOT - Renderizador de Formulários
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { messageEditor } from './message-editor';
import { keyboardBuilder } from './keyboard-builder';

// ==========================================
// TIPOS DO FORMULÁRIO
// ==========================================

type FormField = {
  nome: string;
  valor: string | null;
  preenchido: boolean;
  valido: boolean;
};

type FormState = {
  titulo: string;
  campos: FormField[];
  status: string;
};

// ==========================================
// CLASSE FORM RENDERER
// ==========================================

export class FormRenderer {
  private form: FormState | null = null;

  // ==========================================
  // INICIALIZAR FORMULÁRIO
  // ==========================================

  iniciar(titulo: string, campos: string[]) {
    this.form = {
      titulo,
      campos: campos.map((campo) => ({
        nome: campo,
        valor: null,
        preenchido: false,
        valido: false,
      })),
      status: '🟡 Preenchendo',
    };
    return this;
  }

  // ==========================================
  // ATUALIZAR CAMPO
  // ==========================================

  atualizarCampo(nome: string, valor: string, valido: boolean = true) {
    if (!this.form) {
      throw new Error('Formulário não inicializado');
    }

    const campo = this.form.campos.find((c) => c.nome === nome);
    if (campo) {
      campo.valor = valor;
      campo.preenchido = !!valor;
      campo.valido = valido;
    }
    return this;
  }

  // ==========================================
  // ATUALIZAR STATUS
  // ==========================================

  atualizarStatus(status: string) {
    if (!this.form) {
      throw new Error('Formulário não inicializado');
    }
    this.form.status = status;
    return this;
  }

  // ==========================================
  // RENDERIZAR FORMULÁRIO
  // ==========================================

  async renderizar(ctx: Context, messageId?: number) {
    if (!this.form) {
      throw new Error('Formulário não inicializado');
    }

    const linhas = [
      `📋 *${this.form.titulo}*`,
      ``,
    ];

    for (const campo of this.form.campos) {
      const status = campo.preenchido
        ? campo.valido
          ? '✅'
          : '❌'
        : '⬜';
      const valor = campo.valor || '_Não preenchido_';
      linhas.push(`${status} *${campo.nome}:* ${valor}`);
    }

    linhas.push(``);
    linhas.push(`*Status:* ${this.form.status}`);
    linhas.push(``);
    linhas.push(`[✏️ Editar] [✅ Enviar]`);

    const texto = linhas.join('\n');

    const teclado = keyboardBuilder
      .addDoisBotoes(
        { texto: '✏️ EDITAR', callback: 'form:editar' },
        { texto: '✅ ENVIAR', callback: 'form:enviar' }
      )
      .construir();

    try {
      if (messageId) {
        await ctx.telegram.editMessageText(
          ctx.chat?.id || 0,
          messageId,
          undefined,
          texto,
          { parse_mode: 'Markdown', reply_markup: teclado }
        );
      } else {
        await ctx.reply(texto, {
          parse_mode: 'Markdown',
          reply_markup: teclado,
        });
      }
    } catch (error) {
      logger.error('❌ Erro ao renderizar formulário:', error);
      throw error;
    }
  }

  // ==========================================
  // OBTER FORMULÁRIO
  // ==========================================

  obterForm() {
    return this.form;
  }

  // ==========================================
  // LIMPAR FORMULÁRIO
  // ==========================================

  limpar() {
    this.form = null;
    return this;
  }
}

// ==========================================
// INSTÂNCIA ÚNICA
// ==========================================

export const formRenderer = new FormRenderer();

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

export async function renderizarProgresso(ctx: Context, step: number, total: number) {
  const porcentagem = Math.round((step / total) * 100);
  const barra = '█'.repeat(Math.round(porcentagem / 10)) + '░'.repeat(10 - Math.round(porcentagem / 10));

  const texto = [
    `📊 *PROGRESSO*`,
    ``,
    `[${barra}] ${porcentagem}%`,
    ``,
    `Etapa ${step} de ${total}`,
  ].join('\n');

  await ctx.reply(texto, { parse_mode: 'Markdown' });
}

export default formRenderer;
