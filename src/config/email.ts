// ==========================================
// FOFOCA BOT - Configuração do E-mail
// ==========================================

import nodemailer from 'nodemailer';
import { env } from './env';

// ==========================================
// CONFIGURAÇÃO DO TRANSPORT
// ==========================================

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

// ==========================================
// CONFIGURAÇÕES DE E-MAIL
// ==========================================

const emailConfig = {
  from: env.SMTP_FROM,
  transporter,

  // Templates de e-mail
  templates: {
    aprovado: {
      subject: '✅ Sua publicidade foi aprovada!',
      html: '',
    },
    recusado: {
      subject: '❌ Sua publicidade foi recusada',
      html: '',
    },
    revisao: {
      subject: '🟡 Sua publicidade está em revisão',
      html: '',
    },
    pagamento: {
      subject: '💳 Pagamento pendente',
      html: '',
    },
    confirmado: {
      subject: '🎉 Pagamento confirmado!',
      html: '',
    },
  },
};

export { transporter, emailConfig };
