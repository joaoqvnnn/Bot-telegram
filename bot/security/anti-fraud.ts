// ==========================================
// FOFOCA BOT - Anti-Fraude
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
  empresa?: string;
};

// ==========================================
// CLASSE ANTI-FRAUD
// ==========================================

export class AntiFraud {
  private readonly BLACKLIST_PALAVRAS = [
    'spam',
    'golpe',
    'fraude',
    'ilegal',
  ];

  private readonly BLACKLIST_DOMINIOS = [
    'spam.com',
    'fraude.com',
  ];

  // ==========================================
  // VERIFICAR SOLICITAÇÃO
  // ==========================================

  async verificar(userId: number, dados: DadosSolicitacao): Promise<boolean> {
    try {
      // Verificar blacklist de palavras
      if (this.verificarBlacklist(dados)) {
        return true;
      }

      // Verificar domínio de e-mail
      if (dados.email && this.verificarDominioEmail(dados.email)) {
        return true;
      }

      // Verificar tentativas excessivas
      const tentativasExcessivas = await this.verificarTentativas(userId);
      if (tentativasExcessivas) {
        return true;
      }

      // Verificar tempo mínimo entre solicitações
      const tempoMinimo = await this.verificarTempoMinimo(userId);
      if (tempoMinimo) {
        return true;
      }

      return false;
    } catch (error) {
      logger.error('❌ Erro ao verificar anti-fraude:', error);
      return false;
    }
  }

  // ==========================================
  // VERIFICAR BLACKLIST
  // ==========================================

  private verificarBlacklist(dados: DadosSolicitacao): boolean {
    const valores = [
      dados.empresa,
      dados.instagram,
      dados.email,
      dados.telefone,
    ].filter(Boolean);

    for (const valor of valores) {
      const valorLower = valor!.toLowerCase();

      for (const palavra of this.BLACKLIST_PALAVRAS) {
        if (valorLower.includes(palavra)) {
          return true;
        }
      }
    }

    return false;
  }

  // ==========================================
  // VERIFICAR DOMÍNIO DE E-MAIL
  // ==========================================

  private verificarDominioEmail(email: string): boolean {
    const dominio = email.split('@')[1]?.toLowerCase();

    if (!dominio) {
      return true;
    }

    return this.BLACKLIST_DOMINIOS.includes(dominio);
  }

  // ==========================================
  // VERIFICAR TENTATIVAS EXCESSIVAS
  // ==========================================

  private async verificarTentativas(userId: number): Promise<boolean> {
    try {
      const resultado = await database.postgres.query(
        `SELECT COUNT(*) as total FROM attempts 
         WHERE user_id = $1 
         AND created_at > NOW() - INTERVAL '1 hour'`,
        [userId]
      );

      const total = parseInt(resultado.rows[0]?.total || '0');
      return total >= 10;
    } catch (error) {
      logger.error('❌ Erro ao verificar tentativas:', error);
      return false;
    }
  }

  // ==========================================
  // VERIFICAR TEMPO MÍNIMO
  // ==========================================

  private async verificarTempoMinimo(userId: number): Promise<boolean> {
    try {
      const resultado = await database.postgres.query(
        `SELECT created_at FROM attempts 
         WHERE user_id = $1 
         ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );

      if (resultado.rows.length === 0) {
        return false;
      }

      const ultimaTentativa = new Date(resultado.rows[0].created_at).getTime();
      const agora = new Date().getTime();

      return agora - ultimaTentativa < 60000; // 1 minuto
    } catch (error) {
      logger.error('❌ Erro ao verificar tempo mínimo:', error);
      return false;
    }
  }
}

export const antiFraud = new AntiFraud();
export default antiFraud;
