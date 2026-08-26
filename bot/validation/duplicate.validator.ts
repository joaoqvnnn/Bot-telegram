// ==========================================
// FOFOCA BOT - Validador de Duplicidade
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// VALIDAÇÃO DE DUPLICIDADE
// ==========================================

export async function validarDuplicado(campo: string, valor: string): Promise<boolean> {
  try {
    if (!valor) {
      return false;
    }

    // Verificar no banco de dados
    const resultado = await database.postgres.query(
      `SELECT id FROM applications WHERE ${campo} = $1 AND status = 'ATIVA' LIMIT 1`,
      [valor]
    );

    return resultado.rows.length > 0;
  } catch (error) {
    logger.error('❌ Erro ao validar duplicidade:', error);
    return false;
  }
}

// ==========================================
// VERIFICAR DUPLICIDADE MÚLTIPLA
// ==========================================

export async function verificarDuplicidade(dados: Record<string, string>): Promise<{ duplicado: boolean; campos: string[] }> {
  const camposDuplicados: string[] = [];

  try {
    const campos = ['instagram', 'email', 'telefone'];

    for (const campo of campos) {
      if (dados[campo]) {
        const duplicado = await validarDuplicado(campo, dados[campo]);

        if (duplicado) {
          camposDuplicados.push(campo);
        }
      }
    }
  } catch (error) {
    logger.error('❌ Erro ao verificar duplicidade múltipla:', error);
  }

  return {
    duplicado: camposDuplicados.length > 0,
    campos: camposDuplicados,
  };
}

export default {
  validarDuplicado,
  verificarDuplicidade,
};
