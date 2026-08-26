// ==========================================
// FOFOCA BOT - Rejeição Automática
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// TIPOS
// ==========================================

type ResultadoAutoRejeicao = {
  rejeitado: boolean;
  motivo?: string;
};

// ==========================================
// CLASSE AUTO REJECTION
// ==========================================

export class AutoRejection {
  async verificar(dados: any): Promise<ResultadoAutoRejeicao> {
    try {
      // Verificar Instagram vazio
      if (!dados.instagram || dados.instagram.length < 3) {
        return { rejeitado: true, motivo: 'Instagram inválido' };
      }

      // Verificar e-mail inválido
      if (!dados.email || !dados.email.includes('@')) {
        return { rejeitado: true, motivo: 'E-mail inválido' };
      }

      // Verificar telefone inválido
      if (!dados.telefone || dados.telefone.length < 10) {
        return { rejeitado: true, motivo: 'Telefone inválido' };
      }

      // Verificar descrição muito curta
      if (!dados.descricao || dados.descricao.length < 10) {
        return { rejeitado: true, motivo: 'Descrição muito curta' };
      }

      // Verificar data passada
      if (dados.data) {
        const data = new Date(dados.data);
        const hoje = new Date();
        if (data < hoje) {
          return { rejeitado: true, motivo: 'Data no passado' };
        }
      }

      return { rejeitado: false };
    } catch (error) {
      logger.error('❌ Erro na rejeição automática:', error);
      return { rejeitado: true, motivo: 'Erro ao verificar rejeição' };
    }
  }
}

export const autoRejection = new AutoRejection();
export default autoRejection;
