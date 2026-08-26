// ==========================================
// FOFOCA BOT - Step: Empresa
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { sessionManager } from '../../flows/session-manager';
import { validarObrigatorio } from '../../validation/required.validator';
import { validarDuplicado } from '../../validation/duplicate.validator';

// ==========================================
// STEP: EMPRESA
// ==========================================

export const empresaStep = async (ctx: Context, dados?: any) => {
  try {
    const user = ctx.from;

    if (!user) {
      return;
    }

    // Se veio valor da mensagem
    if (dados?.valor) {
      const nomeEmpresa = dados.valor.trim();

      // Validar campo obrigatório
      const valido = validarObrigatorio(nomeEmpresa);

      if (!valido) {
        await ctx.reply('❌ O nome da empresa é obrigatório. Digite novamente:');
        return;
      }

      // Verificar duplicidade
      const duplicado = await validarDuplicado('empresa', nomeEmpresa);

      if (duplicado) {
        await ctx.reply('🔄 Este nome de empresa já possui uma solicitação ativa. Use outro nome:');
        return;
      }

      // Salvar na sessão
      await sessionManager.atualizarDados(user.id, { empresa: nomeEmpresa });

      logger.info(`✅ Empresa salva: ${nomeEmpresa}`);

      // Enviar confirmação
      await ctx.reply(`✅ *Empresa:* ${nomeEmpresa}`, { parse_mode: 'Markdown' });

      // Avançar para próximo step
      await ctx.reply('📱 Agora, digite o Instagram da empresa:');
      await sessionManager.atualizarSessao(user.id, { stepAtual: 'instagram' });
    } else {
      // Perguntar empresa
      await ctx.reply('🏢 Qual o nome da sua empresa?');
    }
  } catch (error) {
    logger.error('❌ Erro no step empresa:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

export default empresaStep;
