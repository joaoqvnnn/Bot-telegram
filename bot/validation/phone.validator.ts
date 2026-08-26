// ==========================================
// FOFOCA BOT - Validador de Telefone
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// VALIDAÇÃO DE TELEFONE
// ==========================================

export function validarTelefone(telefone: string): boolean {
  try {
    if (!telefone) {
      return false;
    }

    const telefoneLimpo = telefone.replace(/\D/g, '');

    // Verificar se tem 10 ou 11 dígitos
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      return false;
    }

    // Verificar DDD válido
    const ddd = telefoneLimpo.substring(0, 2);
    const dddsValidos = [
      '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '21', '22', '24', '27', '28',
      '31', '32', '33', '34', '35', '37', '38',
      '41', '42', '43', '44', '45', '46', '47', '48', '49',
      '51', '53', '54', '55',
      '61', '62', '63', '64', '65', '66', '67', '68', '69',
      '71', '73', '74', '75', '77', '79',
      '81', '82', '83', '84', '85', '86', '87', '88', '89',
      '91', '92', '93', '94', '95', '96', '97', '98', '99',
    ];

    if (!dddsValidos.includes(ddd)) {
      return false;
    }

    return true;
  } catch (error) {
    logger.error('❌ Erro ao validar telefone:', error);
    return false;
  }
}

// ==========================================
// VALIDAÇÃO DE TELEFONE COM DETALHES
// ==========================================

export function validarTelefoneDetalhado(telefone: string): { valido: boolean; erro?: string } {
  if (!telefone) {
    return { valido: false, erro: 'Telefone é obrigatório' };
  }

  const telefoneLimpo = telefone.replace(/\D/g, '');

  if (telefoneLimpo.length < 10) {
    return { valido: false, erro: 'Telefone muito curto' };
  }

  if (telefoneLimpo.length > 11) {
    return { valido: false, erro: 'Telefone muito longo' };
  }

  return { valido: true };
}

// ==========================================
// NORMALIZAR TELEFONE
// ==========================================

export function normalizarTelefone(telefone: string): string {
  return telefone.replace(/\D/g, '');
}

export default {
  validarTelefone,
  validarTelefoneDetalhado,
  normalizarTelefone,
};
