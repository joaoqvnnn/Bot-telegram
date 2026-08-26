// ==========================================
// FOFOCA BOT - Step: Confirmação
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { sessionManager } from '../../flows/session-manager';

// ==========================================
// IMPORTAÇÃO DOS SERVIÇOS
// ==========================================

import { approvalEngine } from '../../approval/approval-engine';
import { antiFraud } from '../../security/anti-fraud';
import { duplicateDetection } from '../../security/duplicate-detection';
import { auditLog } from '../../security/audit-log';

// ==========================================
// STEP: CONFIRMAÇÃO
// ==========================================

export const confirmacaoStep = async (ctx: Context, dados?: any) => {
  try {
    const user = ctx.from;

    if (!user) {
      return;
    }

    // Se veio confirmação
    if (dados?.valor === 'sim' || dados?.acao === 'confirmar') {
      await processarEnvio(ctx);
    } else if (dados?.valor === 'nao' || dados?.acao === 'cancelar') {
      await cancelarSolicitacao(ctx);
    } else {
      // Mostrar resumo
      await mostrarResumo(ctx);
    }
  } catch (error) {
    logger.error('❌ Erro no step confirmação:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
};

// ==========================================
// PROCESSAR ENVIO
// ==========================================

async function processarEnvio(ctx: Context) {
  try {
    const user = ctx.from;

    if (!user) {
      return;
    }

    // Obter sessão
    const sessao = await sessionManager.obterSessao(user.id);

    if (!sessao || !sessao.dados) {
      await ctx.reply('❌ Sessão expirada. Use /start para recomeçar.');
      return;
    }

    const { dados } = sessao;

    // Verificar se todos os campos estão preenchidos
    const camposObrigatorios = [
      'empresa',
      'instagram',
      'email',
      'telefone',
      'formato',
      'data',
      'descricao',
    ];

    const camposFaltando = camposObrigatorios.filter((campo) => !dados[campo]);

    if (camposFaltando.length > 0) {
      await ctx.reply('❌ Dados incompletos. Verifique e preencha todos os campos.');
      return;
    }

    // Verificar duplicidade
    await ctx.reply('🔍 Verificando duplicidade...');

    const duplicado = await duplicateDetection.verificar(dados);

    if (duplicado) {
      await ctx.reply('❌ Já existe uma solicitação ativa com estes dados.');
      await sessionManager.limparSessao(user.id);
      return;
    }

    // Verificar anti-fraude
    await ctx.reply('🛡️ Verificando segurança...');

    const fraude = await antiFraud.verificar(user.id, dados);

    if (fraude) {
      await ctx.reply('❌ Solicitação bloqueada por segurança.');
      await auditLog.registrar('TENTATIVA_FRAUDE', user.id, dados);
      await sessionManager.limparSessao(user.id);
      return;
    }

    // Enviar para aprovação
    await ctx.reply('🤖 Analisando regras de aprovação...');

    const resultado = await approvalEngine.avaliar(dados);

    // Processar resultado
    switch (resultado.decisao) {
      case 'APROVADO':
        await ctx.reply('✅ Sua solicitação foi APROVADA!');
        await sessionManager.limparSessao(user.id);
        await auditLog.registrar('APROVACAO_AUTOMATICA', user.id, dados);
        break;

      case 'RECUSADO':
        await ctx.reply(
          [
            `❌ Sua solicitação foi RECUSADA.`,
            ``,
            `Motivo: ${resultado.motivo}`,
          ].join('\n')
        );
        await sessionManager.limparSessao(user.id);
        await auditLog.registrar('REJEICAO_AUTOMATICA', user.id, {
          ...dados,
          motivo: resultado.motivo,
        });
        break;

      case 'REVISAO':
        await ctx.reply('🟡 Sua solicitação está EM REVISÃO. Um administrador irá analisar.');
        await sessionManager.limparSessao(user.id);
        await auditLog.registrar('REVISAO_MANUAL', user.id, dados);
        break;

      default:
        await ctx.reply('❌ Erro ao processar solicitação. Tente novamente.');
        break;
    }
  } catch (error) {
    logger.error('❌ Erro ao processar envio:', error);
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  }
}

// ==========================================
// CANCELAR SOLICITAÇÃO
// ==========================================

async function cancelarSolicitacao(ctx: Context) {
  try {
    const user = ctx.from;

    if (user) {
      await sessionManager.limparSessao(user.id);
      await auditLog.registrar('CANCELAMENTO', user.id);
    }

    await ctx.reply('✅ Solicitação cancelada. Use /start para recomeçar.');
  } catch (error) {
    logger.error('❌ Erro ao cancelar:', error);
  }
}

// ==========================================
// MOSTRAR RESUMO
// ==========================================

async function mostrarResumo(ctx: Context) {
  try {
    const user = ctx.from;

    if (!user) {
      return;
    }

    const sessao = await sessionManager.obterSessao(user.id);

    if (!sessao || !sessao.dados) {
      await ctx.reply('❌ Sessão expirada. Use /start para recomeçar.');
      return;
    }

    const { dados } = sessao;

    const resumo = [
      `📋 *CONFIRMAÇÃO FINAL*`,
      ``,
      `🏢 *Empresa:* ${dados.empresa || 'N/A'}`,
      `📱 *Instagram:* @${dados.instagram || 'N/A'}`,
      `📧 *E-mail:* ${dados.email || 'N/A'}`,
      `📞 *Telefone:* ${dados.telefone || 'N/A'}`,
      `📱 *Formato:* ${dados.formatoNome || 'N/A'}`,
      `📅 *Data:* ${dados.data || 'N/A'}`,
      `📝 *Descrição:* ${dados.descricao || 'N/A'}`,
      ``,
      `Confirma o envio?`,
    ].join('\n');

    await ctx.reply(resumo, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ CONFIRMAR ENVIO', callback_data: 'confirmacao:sim' },
          ],
          [
            { text: '❌ CANCELAR', callback_data: 'confirmacao:nao' },
          ],
        ],
      },
    });
  } catch (error) {
    logger.error('❌ Erro ao mostrar resumo:', error);
  }
}

export default confirmacaoStep;
