// ==========================================
// FOFOCA BOT - Serviço de Notificações E-mail
// ==========================================

import nodemailer from 'nodemailer';
import { logger } from '../config/logger';
import { emailConfig } from '../config/email';
import { templates } from './templates';

// ==========================================
// CLASSE EMAIL SERVICE
// ==========================================

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = emailConfig.transporter;
  }

  // ==========================================
  // ENVIAR E-MAIL
  // ==========================================

  async enviar(para: string, assunto: string, html: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: emailConfig.from,
        to: para,
        subject: assunto,
        html,
      });

      return true;
    } catch (error) {
      logger.error('❌ Erro ao enviar e-mail:', error);
      return false;
    }
  }

  // ==========================================
  // NOTIFICAR APROVAÇÃO
  // ==========================================

  async notificarAprovacao(email: string, dados: any) {
    const html = templates.aprovado(dados);
    return this.enviar(email, 'Sua publicidade foi aprovada!', html);
  }

  // ==========================================
  // NOTIFICAR REJEIÇÃO
  // ==========================================

  async notificarRejeicao(email: string, motivo: string) {
    const html = templates.recusado(motivo);
    return this.enviar(email, 'Sua publicidade foi recusada', html);
  }

  // ==========================================
  // NOTIFICAR REVISÃO
  // ==========================================

  async notificarRevisao(email: string) {
    const html = templates.revisao();
    return this.enviar(email, 'Sua publicidade está em revisão', html);
  }

  // ==========================================
  // NOTIFICAR PAGAMENTO
  // ==========================================

  async notificarPagamento(email: string, valor: number) {
    const html = templates.pagamento(valor);
    return this.enviar(email, 'Pagamento pendente', html);
  }

  // ==========================================
  // NOTIFICAR CONFIRMAÇÃO
  // ==========================================

  async notificarConfirmacao(email: string, dados: any) {
    const html = templates.confirmado(dados);
    return this.enviar(email, 'Pagamento confirmado!', html);
  }
}

export const emailService = new EmailService();
export default emailService;
