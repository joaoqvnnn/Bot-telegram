// ==========================================
// FOFOCA BOT - Validador de E-mail
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// VALIDAÇÃO DE E-MAIL
// ==========================================

export function validarEmail(email: string): boolean {
  try {
    if (!email) {
      return false;
    }

    const emailLimpo = email.trim().toLowerCase();

    // Verificar tamanho
    if (emailLimpo.length < 5 || emailLimpo.length > 200) {
      return false;
    }

    // Verificar formato básico
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regex.test(emailLimpo)) {
      return false;
    }

    // Verificar se não tem espaços
    if (emailLimpo.includes(' ')) {
      return false;
    }

    // Verificar se não tem @ duplicado
    if (emailLimpo.split('@').length > 2) {
      return false;
    }

    return true;
  } catch (error) {
    logger.error('❌ Erro ao validar e-mail:', error);
    return false;
  }
}

// ==========================================
// VALIDAÇÃO DE E-MAIL COM DETALHES
// ==========================================

export function validarEmailDetalhado(email: string): { valido: boolean; erro?: string } {
  if (!email) {
    return { valido: false, erro: 'E-mail é obrigatório' };
  }

  const emailLimpo = email.trim().toLowerCase();

  if (emailLimpo.length < 5) {
    return { valido: false, erro: 'E-mail muito curto' };
  }

  if (emailLimpo.length > 200) {
    return { valido: false, erro: 'E-mail muito longo' };
  }

  if (emailLimpo.includes(' ')) {
    return { valido: false, erro: 'E-mail não pode conter espaços' };
  }

  if (emailLimpo.split('@').length > 2) {
    return { valido: false, erro: 'E-mail com @ duplicado' };
  }

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(emailLimpo)) {
    return { valido: false, erro: 'Formato de e-mail inválido' };
  }

  return { valido: true };
}

// ==========================================
// VERIFICAR DOMÍNIO
// ==========================================

export function verificarDominio(email: string): string | null {
  try {
    const emailLimpo = email.trim().toLowerCase();
    const partes = emailLimpo.split('@');

    if (partes.length !== 2) {
      return null;
    }

    return partes[1];
  } catch (error) {
    logger.error('❌ Erro ao verificar domínio:', error);
    return null;
  }
}

// ==========================================
// NORMALIZAR E-MAIL
// ==========================================

export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

export default {
  validarEmail,
  validarEmailDetalhado,
  verificarDominio,
  normalizarEmail,
};
