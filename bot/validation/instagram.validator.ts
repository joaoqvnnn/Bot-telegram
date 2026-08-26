// ==========================================
// FOFOCA BOT - Validador de Instagram
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// VALIDAÇÃO DE INSTAGRAM
// ==========================================

export function validarInstagram(instagram: string): boolean {
  try {
    if (!instagram) {
      return false;
    }

    const instagramLimpo = instagram.replace('@', '').trim();

    // Verificar tamanho
    if (instagramLimpo.length < 1 || instagramLimpo.length > 50) {
      return false;
    }

    // Verificar caracteres permitidos
    const regex = /^[a-zA-Z0-9._]+$/;

    if (!regex.test(instagramLimpo)) {
      return false;
    }

    // Verificar se não começa com ponto
    if (instagramLimpo.startsWith('.')) {
      return false;
    }

    // Verificar se não termina com ponto
    if (instagramLimpo.endsWith('.')) {
      return false;
    }

    // Verificar se não tem pontos consecutivos
    if (instagramLimpo.includes('..')) {
      return false;
    }

    return true;
  } catch (error) {
    logger.error('❌ Erro ao validar Instagram:', error);
    return false;
  }
}

// ==========================================
// VALIDAÇÃO DE INSTAGRAM COM DETALHES
// ==========================================

export function validarInstagramDetalhado(instagram: string): { valido: boolean; erro?: string } {
  if (!instagram) {
    return { valido: false, erro: 'Instagram é obrigatório' };
  }

  const instagramLimpo = instagram.replace('@', '').trim();

  if (instagramLimpo.length < 1) {
    return { valido: false, erro: 'Instagram muito curto' };
  }

  if (instagramLimpo.length > 50) {
    return { valido: false, erro: 'Instagram muito longo' };
  }

  const regex = /^[a-zA-Z0-9._]+$/;

  if (!regex.test(instagramLimpo)) {
    return { valido: false, erro: 'Instagram contém caracteres inválidos' };
  }

  return { valido: true };
}

// ==========================================
// NORMALIZAR INSTAGRAM
// ==========================================

export function normalizarInstagram(instagram: string): string {
  let normalizado = instagram.replace('@', '').trim();
  normalizado = normalizado.replace(/https?:\/\//, '');
  normalizado = normalizado.replace(/instagram\.com\//, '');
  return normalizado;
}

export default {
  validarInstagram,
  validarInstagramDetalhado,
  normalizarInstagram,
};
