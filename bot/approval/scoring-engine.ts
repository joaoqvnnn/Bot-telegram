// ==========================================
// FOFOCA BOT - Motor de Pontuação
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// CLASSE SCORING ENGINE
// ==========================================

export class ScoringEngine {
  async calcular(dados: any): Promise<number> {
    try {
      let pontuacao = 0;

      // Instagram preenchido (+20)
      if (dados.instagram) {
        pontuacao += 20;
      }

      // E-mail válido (+15)
      if (dados.email && dados.email.includes('@')) {
        pontuacao += 15;
      }

      // Telefone preenchido (+15)
      if (dados.telefone) {
        pontuacao += 15;
      }

      // Descrição detalhada (+20)
      if (dados.descricao && dados.descricao.length >= 50) {
        pontuacao += 20;
      } else if (dados.descricao && dados.descricao.length >= 20) {
        pontuacao += 10;
      }

      // Formato válido (+15)
      if (dados.formato) {
        pontuacao += 15;
      }

      // Data futura (+15)
      if (dados.data) {
        const data = new Date(dados.data);
        const hoje = new Date();
        if (data > hoje) {
          pontuacao += 15;
        }
      }

      return Math.min(pontuacao, 100);
    } catch (error) {
      logger.error('❌ Erro ao calcular pontuação:', error);
      return 0;
    }
  }
}

export const scoringEngine = new ScoringEngine();
export default scoringEngine;
