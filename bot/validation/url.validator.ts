// ==========================================
// FOFOCA BOT - Validador de URL
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// VALIDAÇÃO DE URL
// ==========================================

export function validarUrl(url: string): boolean {
  try {
    if (!url) {
      return false;
    }

    const urlLimpa = url.trim();

    // Verificar tamanho
    if (urlLimpa.length > 500) {
      return false;
    }

    // Verificar formato
    const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;

    if (!regex.test(urlLimpa)) {
      return false;
    }

    return true;
  } catch (error) {
    logger.error('❌ Erro ao validar URL:', error);
    return false;
  }
}

// ==========================================
// VALIDAÇÃO DE URL COM DETALHES
// ==========================================

export function validarUrlDetalhado(url: string): { valido: boolean; erro?: string } {
  if (!url) {
    return { valido: false, erro: 'URL é obrigatória' };
  }

  if (url.length > 500) {
    return { valido: false, erro: 'URL muito longa' };
  }

  const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/;

  if (!regex.test(url)) {
    return { valido: false, erro: 'URL inválida' };
  }

  return { valido: true };
}

export default {
  validarUrl,
  validarUrlDetalhado,
};
