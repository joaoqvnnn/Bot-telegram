// ==========================================
// FOFOCA BOT - Editor de Mensagens
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';

// ==========================================
// CLASSE MESSAGE EDITOR
// ==========================================

export class MessageEditor {
  private messageId: number | null = null;
  private chatId: number | null = null;
  private ctx: Context | null = null;

  // ==========================================
  // INICIALIZAR EDITOR
  // ==========================================

  iniciar(ctx: Context) {
    this.ctx = ctx;
    this.chatId = ctx.chat?.id || null;
    this.messageId = null;
  }

  // ==========================================
  // ENVIAR NOVA MENSAGEM
  // ==========================================

  async enviar(texto: string, options?: any) {
    try {
      if (!this.ctx) {
        throw new Error('Editor não inicializado');
      }

      const mensagem = await this.ctx.reply(texto, options);
      this.messageId = mensagem.message_id;
      this.chatId = mensagem.chat.id;

      return mensagem;
    } catch (error) {
      logger.error('❌ Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  // ==========================================
  // EDITAR MENSAGEM EXISTENTE
  // ==========================================

  async editar(texto: string, options?: any) {
    try {
      if (!this.ctx || !this.messageId || !this.chatId) {
        throw new Error('Nenhuma mensagem para editar');
      }

      const mensagem = await this.ctx.telegram.editMessageText(
        this.chatId,
        this.messageId,
        undefined,
        texto,
        options
      );

      return mensagem;
    } catch (error) {
      logger.error('❌ Erro ao editar mensagem:', error);
      throw error;
    }
  }

  // ==========================================
  // EDITAR OU ENVIAR
  // ==========================================

  async editarOuEnviar(texto: string, options?: any) {
    try {
      if (this.messageId && this.chatId) {
        return await this.editar(texto, options);
      } else {
        return await this.enviar(texto, options);
      }
    } catch (error) {
      logger.error('❌ Erro ao editar ou enviar:', error);
      throw error;
    }
  }

  // ==========================================
  // ATUALIZAR TECLADO
  // ==========================================

  async atualizarTeclado(keyboard: any) {
    try {
      if (!this.ctx || !this.messageId || !this.chatId) {
        throw new Error('Nenhuma mensagem para atualizar teclado');
      }

      await this.ctx.telegram.editMessageReplyMarkup(
        this.chatId,
        this.messageId,
        undefined,
        keyboard
      );
    } catch (error) {
      logger.error('❌ Erro ao atualizar teclado:', error);
      throw error;
    }
  }

  // ==========================================
  // EXCLUIR MENSAGEM
  // ==========================================

  async excluir() {
    try {
      if (!this.ctx || !this.messageId || !this.chatId) {
        throw new Error('Nenhuma mensagem para excluir');
      }

      await this.ctx.telegram.deleteMessage(this.chatId, this.messageId);
      this.messageId = null;
    } catch (error) {
      logger.error('❌ Erro ao excluir mensagem:', error);
      throw error;
    }
  }

  // ==========================================
  // LIMPAR EDITOR
  // ==========================================

  limpar() {
    this.messageId = null;
    this.chatId = null;
    this.ctx = null;
  }

  // ==========================================
  // OBTER ID DA MENSAGEM
  // ==========================================

  obterMessageId(): number | null {
    return this.messageId;
  }

  // ==========================================
  // OBTER CHAT ID
  // ==========================================

  obterChatId(): number | null {
    return this.chatId;
  }
}

// ==========================================
// INSTÂNCIA ÚNICA
// ==========================================

export const messageEditor = new MessageEditor();

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

export async function editarMensagem(ctx: Context, messageId: number, texto: string, options?: any) {
  try {
    return await ctx.telegram.editMessageText(
      ctx.chat?.id || 0,
      messageId,
      undefined,
      texto,
      options
    );
  } catch (error) {
    logger.error('❌ Erro ao editar mensagem:', error);
    throw error;
  }
}

export async function excluirMensagem(ctx: Context, messageId: number) {
  try {
    await ctx.telegram.deleteMessage(ctx.chat?.id || 0, messageId);
  } catch (error) {
    logger.error('❌ Erro ao excluir mensagem:', error);
    throw error;
  }
}

export default messageEditor;
