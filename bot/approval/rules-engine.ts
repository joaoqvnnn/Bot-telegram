// ==========================================
// FOFOCA BOT - Motor de Regras
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// TIPOS
// ==========================================

export type Regra = {
  nome: string;
  condicao: (dados: any) => boolean;
  peso: number;
};

type ResultadoRegras = {
  aprovado: boolean;
  reprovado: boolean;
  aplicadas: string[];
  motivo?: string;
};

// ==========================================
// CLASSE RULES ENGINE
// ==========================================

export class RulesEngine {
  private regras: Regra[] = [];

  async carregarRegras() {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM rules WHERE ativo = true'
      );

      this.regras = resultado.rows.map((regra) => ({
        nome: regra.nome,
        condicao: new Function('dados', `return ${regra.condicao}`) as any,
        peso: regra.peso,
      }));
    } catch (error) {
      logger.error('❌ Erro ao carregar regras:', error);
    }
  }

  async avaliar(dados: any): Promise<ResultadoRegras> {
    try {
      await this.carregarRegras();

      const aplicadas: string[] = [];
      let reprovado = false;
      let motivo: string | undefined;

      for (const regra of this.regras) {
        try {
          const resultado = regra.condicao(dados);

          if (resultado === false) {
            reprovado = true;
            motivo = `Regra violada: ${regra.nome}`;
          } else {
            aplicadas.push(regra.nome);
          }
        } catch (error) {
          logger.error(`❌ Erro na regra ${regra.nome}:`, error);
        }
      }

      return {
        aprovado: !reprovado,
        reprovado,
        aplicadas,
        motivo,
      };
    } catch (error) {
      logger.error('❌ Erro ao avaliar regras:', error);
      return {
        aprovado: false,
        reprovado: true,
        aplicadas: [],
        motivo: 'Erro ao avaliar regras',
      };
    }
  }
}

export const rulesEngine = new RulesEngine();
export default rulesEngine;
