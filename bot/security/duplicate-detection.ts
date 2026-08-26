// ==========================================
// FOFOCA BOT - Detecção de Duplicidade
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// TIPOS
// ==========================================

type DadosSolicitacao = {
  instagram?: string;
  email?: string;
  telefone?: string;
};

// ==========================================
// CLASSE DUPLICATE DETECTION
// ==========================================

export class DuplicateDetection {
  // ==========================================
  // VERIFICAR DUPLICIDADE
  // ==========================================

  async verificar(dados: DadosSolicitacao): Promise<boolean> {
    try {
      const campos = [
        { nome: 'instagram', valor: dados.instagram },
        { nome: 'email', valor: dados.email },
        { nome: 'telefone', valor: dados.telefone },
      ];

      for (const campo of campos) {
        if (campo.valor) {
          const duplicado = await this.verificarCampo(campo.nome, campo.valor);
          if (duplicado) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      logger.error('❌ Erro ao verificar duplicidade:', error);
      return false;
    }
  }

  // ==========================================
  // VERIFICAR CAMPO ESPECÍFICO
  // ==========================================

  private async verificarCampo(campo: string, valor: string): Promise<boolean> {
    try {
      const resultado = await database.postgres.query(
        `SELECT id FROM applications 
         WHERE ${campo} = $1 
         AND status IN ('ATIVA', 'EM_REVISAO', 'APROVADA') 
         AND created_at > NOW() - INTERVAL '24 hours' 
         LIMIT 1`,
        [valor]
      );

      return resultado.rows.length > 0;
    } catch (error) {
      logger.error(`❌ Erro ao verificar duplicidade do campo ${campo}:`, error);
      return false;
    }
  }

  // ==========================================
  // OBTER CAMPOS DUPLICADOS
  // ==========================================

  async obterDuplicados(dados: DadosSolicitacao): Promise<string[]> {
    const duplicados: string[] = [];

    try {
      const campos = [
        { nome: 'instagram', valor: dados.instagram },
        { nome: 'email', valor: dados.email },
        { nome: 'telefone', valor: dados.telefone },
      ];

      for (const campo of campos) {
        if (campo.valor) {
          const duplicado = await this.verificarCampo(campo.nome, campo.valor);
          if (duplicado) {
            duplicados.push(campo.nome);
          }
        }
      }
    } catch (error) {
      logger.error('❌ Erro ao obter duplicados:', error);
    }

    return duplicados;
  }
}

export const duplicateDetection = new DuplicateDetection();
export default duplicateDetection;
