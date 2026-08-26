// ==========================================
// FOFOCA BOT - Motivos de Rejeição
// ==========================================

import { logger } from '../config/logger';

// ==========================================
// TIPOS
// ==========================================

export type MotivoRejeicao = {
  codigo: string;
  mensagem: string;
  categoria: 'DADOS' | 'SEGURANCA' | 'REGRA' | 'DISPONIBILIDADE';
};

// ==========================================
// LISTA DE MOTIVOS DE REJEIÇÃO
// ==========================================

export const motivosRejeicao: MotivoRejeicao[] = [
  // Motivos de DADOS
  {
    codigo: 'DADOS_INCOMPLETOS',
    mensagem: 'Dados incompletos ou inválidos',
    categoria: 'DADOS',
  },
  {
    codigo: 'INSTAGRAM_INVALIDO',
    mensagem: 'Instagram inválido ou não encontrado',
    categoria: 'DADOS',
  },
  {
    codigo: 'EMAIL_INVALIDO',
    mensagem: 'E-mail inválido ou não verificado',
    categoria: 'DADOS',
  },
  {
    codigo: 'TELEFONE_INVALIDO',
    mensagem: 'Telefone inválido ou não verificado',
    categoria: 'DADOS',
  },

  // Motivos de SEGURANÇA
  {
    codigo: 'TENTATIVA_FRAUDE',
    mensagem: 'Tentativa de fraude detectada',
    categoria: 'SEGURANCA',
  },
  {
    codigo: 'DUPLICIDADE',
    mensagem: 'Solicitação duplicada',
    categoria: 'SEGURANCA',
  },
  {
    codigo: 'RATE_LIMIT',
    mensagem: 'Muitas solicitações em pouco tempo',
    categoria: 'SEGURANCA',
  },

  // Motivos de REGRA
  {
    codigo: 'FORMATO_INDISPONIVEL',
    mensagem: 'Formato não disponível no momento',
    categoria: 'REGRA',
  },
  {
    codigo: 'DESCRICAO_INSUFICIENTE',
    mensagem: 'Descrição muito curta ou vaga',
    categoria: 'REGRA',
  },

  // Motivos de DISPONIBILIDADE
  {
    codigo: 'DATA_INDISPONIVEL',
    mensagem: 'Data não disponível',
    categoria: 'DISPONIBILIDADE',
  },
  {
    codigo: 'AGENDA_LOTADA',
    mensagem: 'Agenda lotada para esta data',
    categoria: 'DISPONIBILIDADE',
  },
];

// ==========================================
// CLASSE REJECTION REASONS
// ==========================================

export class RejectionReasons {
  // ==========================================
  // OBTER MOTIVO POR CÓDIGO
  // ==========================================

  obterPorCodigo(codigo: string): MotivoRejeicao | undefined {
    return motivosRejeicao.find((motivo) => motivo.codigo === codigo);
  }

  // ==========================================
  // OBTER MOTIVOS POR CATEGORIA
  // ==========================================

  obterPorCategoria(categoria: string): MotivoRejeicao[] {
    return motivosRejeicao.filter((motivo) => motivo.categoria === categoria);
  }

  // ==========================================
  // FORMATAR MENSAGEM PARA O USUÁRIO
  // ==========================================

  formatarMensagem(codigo: string): string {
    const motivo = this.obterPorCodigo(codigo);

    if (!motivo) {
      return 'Motivo não especificado';
    }

    return `❌ ${motivo.mensagem}`;
  }

  // ==========================================
  // REGISTRAR REJEIÇÃO NO BANCO
  // ==========================================

  async registrar(applicationId: number, codigo: string, detalhes?: string) {
    try {
      const motivo = this.obterPorCodigo(codigo);

      // Aqui você salva no banco
      logger.info(`📝 Rejeição registrada: ${codigo} - ${motivo?.mensagem}`);
      
      return true;
    } catch (error) {
      logger.error('❌ Erro ao registrar rejeição:', error);
      return false;
    }
  }
}

export const rejectionReasons = new RejectionReasons();
export default rejectionReasons;
