// ==========================================
// FOFOCA BOT - Motor de Elegibilidade
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// TIPOS
// ==========================================

type ResultadoElegibilidade = {
  valido: boolean;
  motivo?: string;
};

// ==========================================
// CLASSE ELIGIBILITY ENGINE
// ==========================================

export class EligibilityEngine {
  async verificar(dados: any): Promise<ResultadoElegibilidade> {
    try {
      // Verificar campos obrigatórios
      if (!dados.empresa) {
        return { valido: false, motivo: 'Empresa é obrigatória' };
      }

      if (!dados.instagram) {
        return { valido: false, motivo: 'Instagram é obrigatório' };
      }

      if (!dados.email) {
        return { valido: false, motivo: 'E-mail é obrigatório' };
      }

      if (!dados.telefone) {
        return { valido: false, motivo: 'Telefone é obrigatório' };
      }

      if (!dados.formato) {
        return { valido: false, motivo: 'Formato é obrigatório' };
      }

      if (!dados.data) {
        return { valido: false, motivo: 'Data é obrigatória' };
      }

      if (!dados.descricao) {
        return { valido: false, motivo: 'Descrição é obrigatória' };
      }

      return { valido: true };
    } catch (error) {
      logger.error('❌ Erro ao verificar elegibilidade:', error);
      return { valido: false, motivo: 'Erro ao verificar elegibilidade' };
    }
  }
}

export const eligibilityEngine = new EligibilityEngine();
export default eligibilityEngine;
