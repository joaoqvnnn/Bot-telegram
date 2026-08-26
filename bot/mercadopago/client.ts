// ==========================================
// FOFOCA BOT - Cliente Mercado Pago
// ==========================================

import mercadopago from 'mercadopago';
import { logger } from '../config/logger';
import { mercadopagoConfig } from '../config/mercadopago';

// ==========================================
// CONFIGURAÇÃO DO CLIENTE
// ==========================================

mercadopago.configure({
  access_token: mercadopagoConfig.accessToken || '',
});

// ==========================================
// CLASSE MERCADOPAGO CLIENT
// ==========================================

export class MercadoPagoClient {
  async criarPagamento(amount: number, descricao: string = 'Publicidade Fofoca Bot') {
    try {
      const pagamento = {
        items: [
          {
            title: descricao,
            quantity: 1,
            unit_price: amount,
            currency_id: 'BRL',
          },
        ],
        back_urls: mercadopagoConfig.payment.backUrls,
        auto_return: 'approved',
        notification_url: mercadopagoConfig.payment.notificationUrl,
      };

      const resultado = await mercadopago.preferences.create(pagamento);

      return {
        id: resultado.body.id,
        url: resultado.body.init_point,
      };
    } catch (error) {
      logger.error('❌ Erro ao criar pagamento:', error);
      return null;
    }
  }

  async criarLinkPagamento(amount: number) {
    try {
      const resultado = await this.criarPagamento(amount);
      return resultado?.url || null;
    } catch (error) {
      logger.error('❌ Erro ao criar link:', error);
      return null;
    }
  }

  async obterStatus(paymentId: string): Promise<string | null> {
    try {
      const resultado = await mercadopago.payment.get(paymentId);
      return resultado.body.status;
    } catch (error) {
      logger.error('❌ Erro ao obter status:', error);
      return null;
    }
  }

  async obterDetalhes(paymentId: string) {
    try {
      const resultado = await mercadopago.payment.get(paymentId);
      return resultado.body;
    } catch (error) {
      logger.error('❌ Erro ao obter detalhes:', error);
      return null;
    }
  }

  async cancelar(paymentId: string): Promise<boolean> {
    try {
      await mercadopago.payment.cancel(paymentId);
      return true;
    } catch (error) {
      logger.error('❌ Erro ao cancelar pagamento:', error);
      return false;
    }
  }

  async reembolsar(paymentId: string): Promise<boolean> {
    try {
      await mercadopago.payment.refund(paymentId);
      return true;
    } catch (error) {
      logger.error('❌ Erro ao reembolsar:', error);
      return false;
    }
  }
}

export const mercadopagoClient = new MercadoPagoClient();
export default mercadopagoClient;
