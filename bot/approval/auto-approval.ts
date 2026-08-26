// ==========================================
// FOFOCA BOT - Aprovação Automática
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// TIPOS
// ==========================================

type ResultadoAutoAprovacao = {
  aprovado: boolean;
  pontuacao?: number;
  regras?: string[];
};

// ==========================================
// CLASSE AUTO APPROVAL
// ==========================================

export class AutoApproval {
  async verificar(dados: any): Promise<ResultadoAutoAprovacao> {
    try {
      const regras: string[] = [];

      // Regra 1: Instagram com @
      if (dados.instagram && dados.instagram.length >= 3) {
        regras.push('Instagram válido');
      }

      // Regra 2: E-mail com domínio
      if (dados.email && dados.email.includes('@')) {
        regras.push('E-mail válido');
      }

      // Regra 3: Telefone com 11 dígitos
      if (dados.telefone && dados.telefone.length >= 10) {
        regras.push('Telefone válido');
      }

      // Regra 4: Descrição completa
      if (dados.descricao && dados.descricao.length >= 30) {
        regras.push('Descrição completa');
      }

      // Se todas as regras passarem
      if (regras.length >= 4) {
        return {
          aprovado: true,
          pontuacao: 100,
          regras,
        };
      }

      return { aprovado: false };
    } catch (error) {
      logger.error('❌ Erro na aprovação automática:', error);
      return { aprovado: false };
    }
  }
}

export const autoApproval = new AutoApproval();
export default autoApproval;
