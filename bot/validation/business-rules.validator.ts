// ==========================================
// FOFOCA BOT - Validador de Regras de Negócio
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// VALIDAÇÃO DE REGRAS DE NEGÓCIO
// ==========================================

export function validarRegrasNegocio(dados: Record<string, any>): { valido: boolean; erros: string[] } {
  const erros: string[] = [];

  // Validar formato
  if (!validarFormato(dados.formato)) {
    erros.push('Formato inválido');
  }

  // Validar data
  if (!validarDataFutura(dados.data)) {
    erros.push('Data deve ser futura');
  }

  // Validar descrição
  if (!validarTamanhoDescricao(dados.descricao)) {
    erros.push('Descrição fora do limite');
  }

  // Validar Instagram
  if (!validarInstagramNegocio(dados.instagram)) {
    erros.push('Instagram inválido');
  }

  return {
    valido: erros.length === 0,
    erros,
  };
}

// ==========================================
// VALIDAÇÕES ESPECÍFICAS
// ==========================================

function validarFormato(formato: string): boolean {
  const formatosValidos = ['story', 'feed', 'reels', 'pacote'];
  return formatosValidos.includes(formato);
}

function validarDataFutura(data: string): boolean {
  try {
    const dataSelecionada = new Date(data);
    const hoje = new Date();
    return dataSelecionada >= hoje;
  } catch (error) {
    logger.error('❌ Erro ao validar data futura:', error);
    return false;
  }
}

function validarTamanhoDescricao(descricao: string): boolean {
  if (!descricao) {
    return false;
  }

  return descricao.length >= 10 && descricao.length <= 500;
}

function validarInstagramNegocio(instagram: string): boolean {
  if (!instagram) {
    return false;
  }

  return instagram.length >= 3 && instagram.length <= 50;
}

// ==========================================
// REGRAS DE DISPONIBILIDADE
// ==========================================

export function validarDisponibilidade(data: string, formato: string): boolean {
  // Aqui você pode verificar:
  // - Se a data está disponível
  // - Se o formato está disponível na data
  // - Se não há conflitos
  return true;
}

export default {
  validarRegrasNegocio,
  validarDisponibilidade,
};
