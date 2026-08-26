// ==========================================
// FOFOCA BOT - Handler de Comandos
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';

// ==========================================
// HANDLER DE COMANDOS NÃO RECONHECIDOS
// ==========================================

export const commandHandler = async (ctx: Context) => {
  try {
    const message = (ctx.message as any)?.text;
    const user = ctx.from;

    if (!message || !message.startsWith('/') || !user) {
      return;
    }

    logger.info(`🔍 Comando não reconhecido: ${message} - Usuário: ${user.id}`);

    // Remover o "/" do comando
    const comando = message.split(' ')[0].replace('/', '');

    // Lista de comandos conhecidos
    const comandosConhecidos = [
      'start',
      'ajuda',
      'help',
      'anunciar',
      'pedidos',
      'valores',
      'conta',
      'suporte',
    ];

    // Verificar se é um comando conhecido
    if (!comandosConhecidos.includes(comando)) {
      await ctx.reply(
        `❓ Comando não reconhecido: /${comando}\n\n` +
        `Use /start para ver o menu principal ou /ajuda para ver todos os comandos.`
      );
    }
  } catch (error) {
    logger.error('❌ Erro no handler de comandos:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

// ==========================================
// HANDLER DE COMANDOS ADMIN
// ==========================================

export const adminCommandHandler = async (ctx: Context) => {
  try {
    const message = (ctx.message as any)?.text;
    const user = ctx.from;

    if (!message || !user) {
      return;
    }

    // Comandos admin
    const comandosAdmin = [
      '/admin',
      '/config',
      '/precos',
      '/regras',
      '/formatos',
      '/usuarios',
      '/logs',
    ];

    if (comandosAdmin.includes(message.toLowerCase())) {
      logger.info(`🔐 Comando admin: ${message} - Usuário: ${user.id}`);
      
      await ctx.reply(
        `🔐 *COMANDO ADMIN*\n\n` +
        `Este comando é restrito a administradores.\n\n` +
        `Se você é um admin, acesse o painel administrativo.`,
        { parse_mode: 'Markdown' }
      );
    }
  } catch (error) {
    logger.error('❌ Erro no handler de comandos admin:', error);
  }
};

// ==========================================
// HANDLER DE COMANDOS DE DIAGNÓSTICO
// ==========================================

export const diagnosticoCommandHandler = async (ctx: Context) => {
  try {
    const user = ctx.from;

    if (!user) {
      return;
    }

    logger.info(`📊 Diagnóstico solicitado por ${user.id}`);

    const informacoes = [
      `📊 *DIAGNÓSTICO*`,
      ``,
      `• ID: ${user.id}`,
      `• Username: @${user.username || 'N/A'}`,
      `• Nome: ${user.first_name || 'N/A'}`,
      `• Idioma: ${user.language_code || 'N/A'}`,
    ].join('\n');

    await ctx.reply(informacoes, { parse_mode: 'Markdown' });
  } catch (error) {
    logger.error('❌ Erro no handler de diagnóstico:', error);
  }
};
