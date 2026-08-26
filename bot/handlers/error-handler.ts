// ==========================================
// FOFOCA BOT - Handler de Erros
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';

// ==========================================
// TIPOS DE ERROS
// ==========================================

enum TipoErro {
  ERRO_GENERICO = 'ERRO_GENERICO',
  ERRO_VALIDACAO = 'ERRO_VALIDACAO',
  ERRO_SEGURANCA = 'ERRO_SEGURANCA',
  ERRO_SESSAO = 'ERRO_SESSAO',
  ERRO_PAGAMENTO = 'ERRO_PAGAMENTO',
  ERRO_BANCO = 'ERRO_BANCO',
  ERRO_TELEGRAM = 'ERRO_TELEGRAM',
  ERRO_DUPLICADO = 'ERRO_DUPLICADO',
  ERRO_PERMISSAO = 'ERRO_PERMISSAO',
  ERRO_RATE_LIMIT = 'ERRO_RATE_LIMIT',
}

// ==========================================
// CLASSE DE ERRO PERSONALIZADA
// ==========================================

export class ErroPersonalizado extends Error {
  tipo: TipoErro;
  mensagemUsuario: string;
  detalhes?: any;

  constructor(tipo: TipoErro, mensagemUsuario: string, detalhes?: any) {
    super(mensagemUsuario);
    this.name = 'ErroPersonalizado';
    this.tipo = tipo;
    this.mensagemUsuario = mensagemUsuario;
    this.detalhes = detalhes;
  }
}

// ==========================================
// HANDLER PRINCIPAL DE ERROS
// ==========================================

export const errorHandler = async (error: any, ctx?: Context) => {
  try {
    logger.error('❌ Erro capturado:', error);

    // Se tiver contexto, responder ao usuário
    if (ctx) {
      await responderErro(ctx, error);
    }

    // Registrar no audit log
    await registrarErro(error);
  } catch (erroHandler) {
    logger.error('❌ Erro no handler de erros:', erroHandler);
  }
};

// ==========================================
// RESPONDER ERRO AO USUÁRIO
// ==========================================

async function responderErro(ctx: Context, error: any) {
  try {
    // Verificar tipo de erro
    if (error instanceof ErroPersonalizado) {
      await ctx.reply(error.mensagemUsuario);
      return;
    }

    // Erros do Telegraf
    if (error.code === 403) {
      // Bot bloqueado pelo usuário
      logger.warn('⚠️ Usuário bloqueou o bot');
      return;
    }

    if (error.code === 429) {
      // Rate limit
      await ctx.reply('⏳ Muitas solicitações. Aguarde um momento.');
      return;
    }

    // Erro de banco de dados
    if (error.code === '23505') {
      // Violação de unique constraint
      await ctx.reply('🔄 Você já possui um registro ativo.');
      return;
    }

    if (error.code === '23503') {
      // Violação de foreign key
      await ctx.reply('❌ Dados inválidos. Verifique e tente novamente.');
      return;
    }

    // Erro genérico
    await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
  } catch (erroResposta) {
    logger.error('❌ Erro ao responder erro:', erroResposta);
  }
}

// ==========================================
// REGISTRAR ERRO NO AUDIT LOG
// ==========================================

async function registrarErro(error: any) {
  try {
    const registro = {
      tipo: error.tipo || TipoErro.ERRO_GENERICO,
      mensagem: error.message,
      detalhes: error.detalhes,
      timestamp: new Date().toISOString(),
    };

    logger.error('📝 Registro de erro:', registro);

    // Aqui você pode salvar no banco de dados
    // await AuditLog.criar(registro);
  } catch (erroRegistro) {
    logger.error('❌ Erro ao registrar erro:', erroRegistro);
  }
}

// ==========================================
// FUNÇÕES AUXILIARES DE ERRO
// ==========================================

export function criarErroValidacao(mensagem: string, detalhes?: any) {
  return new ErroPersonalizado(TipoErro.ERRO_VALIDACAO, mensagem, detalhes);
}

export function criarErroSeguranca(mensagem: string, detalhes?: any) {
  return new ErroPersonalizado(TipoErro.ERRO_SEGURANCA, mensagem, detalhes);
}

export function criarErroSessao(mensagem: string, detalhes?: any) {
  return new ErroPersonalizado(TipoErro.ERRO_SESSAO, mensagem, detalhes);
}

export function criarErroPagamento(mensagem: string, detalhes?: any) {
  return new ErroPersonalizado(TipoErro.ERRO_PAGAMENTO, mensagem, detalhes);
}

export function criarErroDuplicado(mensagem: string, detalhes?: any) {
  return new ErroPersonalizado(TipoErro.ERRO_DUPLICADO, mensagem, detalhes);
}

export function criarErroPermissao(mensagem: string, detalhes?: any) {
  return new ErroPersonalizado(TipoErro.ERRO_PERMISSAO, mensagem, detalhes);
}

export function criarErroRateLimit(mensagem: string, detalhes?: any) {
  return new ErroPersonalizado(TipoErro.ERRO_RATE_LIMIT, mensagem, detalhes);
}

// ==========================================
// HANDLER DE ERROS NÃO CAPTURADOS
// ==========================================

export const uncaughtErrorHandler = (error: any) => {
  logger.error('❌ Erro não capturado:', error);
  registrarErro(error);
};

// ==========================================
// HANDLER DE PROMESSAS REJEITADAS
// ==========================================

export const unhandledRejectionHandler = (reason: any) => {
  logger.error('❌ Promessa rejeitada:', reason);
  registrarErro(reason);
};

// ==========================================
// EXPORTAÇÃO
// ==========================================

export default {
  errorHandler,
  uncaughtErrorHandler,
  unhandledRejectionHandler,
  criarErroValidacao,
  criarErroSeguranca,
  criarErroSessao,
  criarErroPagamento,
  criarErroDuplicado,
  criarErroPermissao,
  criarErroRateLimit,
  ErroPersonalizado,
  TipoErro,
};
