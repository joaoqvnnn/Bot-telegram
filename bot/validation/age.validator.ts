// ==========================================
// FOFOCA BOT - Validador de Idade
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// VALIDAÇÃO DE IDADE
// ==========================================

export function validarIdade(dataNascimento: string, idadeMinima: number = 18): boolean {
  try {
    if (!dataNascimento) {
      return false;
    }

    const nascimento = new Date(dataNascimento);
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade >= idadeMinima;
  } catch (error) {
    logger.error('❌ Erro ao validar idade:', error);
    return false;
  }
}

// ==========================================
// CALCULAR IDADE
// ==========================================

export function calcularIdade(dataNascimento: string): number | null {
  try {
    if (!dataNascimento) {
      return null;
    }

    const nascimento = new Date(dataNascimento);
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade;
  } catch (error) {
    logger.error('❌ Erro ao calcular idade:', error);
    return null;
  }
}

export default {
  validarIdade,
  calcularIdade,
};
