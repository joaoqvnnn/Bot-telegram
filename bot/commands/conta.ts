// ==========================================
// FOFOCA BOT - Comando Conta
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { contaKeyboard } from '../keyboards/conta';

// ==========================================
// HANDLER DO COMANDO /conta
// ==========================================

export const contaCommand = async (ctx: Context) => {
  try {
    const user = ctx.from;

    logger.info(`📝 /conta - Usuário: ${user?.id}`);

    const firstName = user?.first_name || 'Anunciante';
    const username = user?.username || 'Não definido';

    const mensagem = [
      `👤 *MINHA CONTA*`,
      ``,
      `📋 *Seus dados:*`,
      ``,
      `• Nome: ${firstName}`,
      `• Username: @${username}`,
      `• ID: ${user?.id}`,
      ``,
      `Escolha uma opção abaixo:`,
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
      reply_markup: contaKeyboard,
    });

    logger.info(`✅ /conta enviado para ${user?.id}`);
  } catch (error) {
    logger.error('❌ Erro no comando /conta:', error);
    
    await ctx.reply('❌ Ocorreu um erro ao exibir sua conta. Tente novamente.');
  }
};

// ==========================================
// HANDLER DE DADOS PESSOAIS
// ==========================================

export const dadosPessoais = async (ctx: Context) => {
  try {
    const user = ctx.from;

    const mensagem = [
      `📋 *DADOS PESSOAIS*`,
      ``,
      `• Nome: ${user?.first_name || 'Não informado'}`,
      `• Sobrenome: ${user?.last_name || 'Não informado'}`,
      `• Username: @${user?.username || 'Não definido'}`,
      `• ID: ${user?.id}`,
      `• Idioma: ${user?.language_code || 'Não informado'}`,
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
    });
  } catch (error) {
    logger.error('❌ Erro ao exibir dados pessoais:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

// ==========================================
// HANDLER DE CONFIGURAÇÕES
// ==========================================

export const configuracoesConta = async (ctx: Context) => {
  try {
    const mensagem = [
      `⚙️ *CONFIGURAÇÕES DA CONTA*`,
      ``,
      `• Notificações: Ativadas`,
      `• E-mail: Não cadastrado`,
      `• Telefone: Não cadastrado`,
      ``,
      `Para atualizar seus dados, use os comandos abaixo:`,
    ].join('\n');

    await ctx.reply(mensagem, {
      parse_mode: 'Markdown',
    });
  } catch (error) {
    logger.error('❌ Erro ao exibir configurações:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};
