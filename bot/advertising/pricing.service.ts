// ==========================================
// FOFOCA BOT - Serviço de Preços
// ==========================================

import { logger } from '../config/logger';
import { database } from '../config/database';

// ==========================================
// TIPOS
// ==========================================

type Preco = {
  formato: string;
  valor: number;
  ativo: boolean;
};

// ==========================================
// CLASSE PRICING SERVICE
// ==========================================

export class PricingService {
  // ==========================================
  // OBTER PREÇO DO FORMATO
  // ==========================================

  async obterPreco(formato: string): Promise<number> {
    try {
      const resultado = await database.postgres.query(
        'SELECT valor FROM advertising_formats WHERE id = $1 AND ativo = true',
        [formato]
      );
      return resultado.rows[0]?.valor || 0;
    } catch (error) {
      logger.error('❌ Erro ao obter preço:', error);
      return 0;
    }
  }

  // ==========================================
  // CALCULAR VALOR TOTAL
  // ==========================================

  async calcularTotal(formato: string, quantidade: number = 1): Promise<number> {
    try {
      const preco = await this.obterPreco(formato);
      return preco * quantidade;
    } catch (error) {
      logger.error('❌ Erro ao calcular total:', error);
      return 0;
    }
  }

  // ==========================================
  // APLICAR DESCONTO
  // ==========================================

  async aplicarDesconto(valor: number, percentual: number): Promise<number> {
    const desconto = valor * (percentual / 100);
    return valor - desconto;
  }
}

export const pricingService = new PricingService();
export default pricingService;
