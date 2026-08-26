// ==========================================
// FOFOCA BOT - Motor de Aprovação
// ==========================================

import { logger } from '../config/logger';
import { rulesEngine } from './rules-engine';
import { eligibilityEngine } from './eligibility-engine';
import { scoringEngine } from './scoring-engine';
import { autoApproval } from './auto-approval';
import { autoRejection } from './auto-rejection';
import { manualReview } from './manual-review';

// ==========================================
// TIPOS
// ==========================================

export type ResultadoAprovacao = {
  decisao: 'APROVADO' | 'RECUSADO' | 'REVISAO';
  motivo?: string;
  pontuacao?: number;
  regrasAplicadas?: string[];
};

type DadosSolicitacao = {
  instagram?: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  formato?: string;
  data?: string;
  descricao?: string;
};

// ==========================================
// CLASSE APPROVAL ENGINE
// ==========================================

export class ApprovalEngine {
  async avaliar(dados: DadosSolicitacao): Promise<ResultadoAprovacao> {
    try {
      logger.info('🤖 Iniciando avaliação de aprovação...');

      // 1. Verificar elegibilidade
      const elegivel = await eligibilityEngine.verificar(dados);

      if (!elegivel.valido) {
        return {
          decisao: 'RECUSADO',
          motivo: elegivel.motivo,
        };
      }

      // 2. Verificar rejeição automática
      const rejeicao = await autoRejection.verificar(dados);

      if (rejeicao.rejeitado) {
        return {
          decisao: 'RECUSADO',
          motivo: rejeicao.motivo,
        };
      }

      // 3. Verificar aprovação automática
      const aprovacao = await autoApproval.verificar(dados);

      if (aprovacao.aprovado) {
        return {
          decisao: 'APROVADO',
          pontuacao: aprovacao.pontuacao,
          regrasAplicadas: aprovacao.regras,
        };
      }

      // 4. Calcular pontuação
      const pontuacao = await scoringEngine.calcular(dados);

      // 5. Aplicar regras
      const regras = await rulesEngine.avaliar(dados);

      // 6. Decidir
      if (pontuacao >= 80 && regras.aprovado) {
        return {
          decisao: 'APROVADO',
          pontuacao,
          regrasAplicadas: regras.aplicadas,
        };
      }

      if (pontuacao < 40 || regras.reprovado) {
        return {
          decisao: 'RECUSADO',
          motivo: regras.motivo || 'Pontuação insuficiente',
          pontuacao,
        };
      }

      // 7. Enviar para revisão manual
      await manualReview.criar(dados, pontuacao);

      return {
        decisao: 'REVISAO',
        pontuacao,
      };
    } catch (error) {
      logger.error('❌ Erro ao avaliar solicitação:', error);
      return {
        decisao: 'RECUSADO',
        motivo: 'Erro interno na avaliação',
      };
    }
  }
}

export const approvalEngine = new ApprovalEngine();
export default approvalEngine;
