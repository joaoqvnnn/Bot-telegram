// ==========================================
// FOFOCA BOT - Validador de Campo Obrigatório
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// VALIDAÇÃO DE CAMPO OBRIGATÓRIO
// ==========================================

export function validarObrigatorio(valor: string): boolean {
  try {
    if (!valor) {
      return false;
    }

    if (valor.trim().length === 0) {
      return false;
    }

    return true;
  } catch (error) {
    logger.error('❌ Erro ao validar campo obrigatório:', error);
    return false;
  }
}

// ==========================================
// VALIDAÇÃO DE CAMPO OBRIGATÓRIO COM DETALHES
// ==========================================

export function validarObrigatorioDetalhado(valor: string, nomeCampo: string): { valido: boolean; erro?: string } {
  if (!valor) {
    return { valido: false, erro: `${nomeCampo} é obrigatório` };
  }

  if (valor.trim().length === 0) {
    return { valido: false, erro: `${nomeCampo} não pode estar vazio` };
  }

  return { valido: true };
}

// ==========================================
// VALIDAR MÚLTIPLOS CAMPOS
// ==========================================

export function validarObrigatorios(campos: Record<string, string>): { valido: boolean; erros: string[] } {
  const erros: string[] = [];

  for (const [nome, valor] of Object.entries(campos)) {
    if (!validarObrigatorio(valor)) {
      erros.push(`${nome} é obrigatório`);
    }
  }

  return {
    valido: erros.length === 0,
    erros,
  };
}

export default {
  validarObrigatorio,
  validarObrigatorioDetalhado,
  validarObrigatorios,
};
