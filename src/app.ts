// ==========================================
// FOFOCA BOT - Aplicação Express
// ==========================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { logger } from './config/logger';

// ==========================================
// IMPORTAÇÃO DE ROTAS
// ==========================================

import healthRoutes from './api/routes/health';
import applicationRoutes from './api/routes/applications';
import campaignRoutes from './api/routes/campaigns';
import paymentRoutes from './api/routes/payments';
import telegramRoutes from './api/routes/telegram';
import adminRoutes from './api/routes/admin';

// ==========================================
// IMPORTAÇÃO DE MIDDLEWARES
// ==========================================

import { authMiddleware } from './api/middleware/auth';
import { permissionsMiddleware } from './api/middleware/permissions';
import { validationMiddleware } from './api/middleware/validation';
import { rateLimitMiddleware } from './api/middleware/rate-limit';
import { securityMiddleware } from './api/middleware/security';

// ==========================================
// INICIALIZAÇÃO DO EXPRESS
// ==========================================

const app = express();

// ==========================================
// CONFIGURAÇÕES BÁSICAS
// ==========================================

app.set('trust proxy', 1);
app.disable('x-powered-by');

// ==========================================
// MIDDLEWARES GLOBAIS
// ==========================================

// Segurança
app.use(helmet());
app.use(cors(env.CORS));

// Compressão
app.use(compression());

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limit global
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite por IP
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ==========================================
// ARQUIVOS ESTÁTICOS
// ==========================================

app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));
app.use('/admin-assets', express.static(path.join(__dirname, '..', 'admin-assets')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// ==========================================
// ROTAS PÚBLICAS
// ==========================================

// Health check
app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);

// Webhook do Telegram (público)
app.use('/webhook/telegram', telegramRoutes);

// Webhook do Mercado Pago (público)
app.use('/webhook/mercadopago', paymentRoutes);

// ==========================================
// ROTAS PROTEGIDAS
// ==========================================

// Autenticação
app.use('/api/auth', authMiddleware);

// Applications
app.use(
  '/api/applications',
  authMiddleware,
  rateLimitMiddleware,
  applicationRoutes
);

// Campaigns
app.use(
  '/api/campaigns',
  authMiddleware,
  rateLimitMiddleware,
  campaignRoutes
);

// Payments
app.use(
  '/api/payments',
  authMiddleware,
  rateLimitMiddleware,
  paymentRoutes
);

// ==========================================
// ROTAS ADMIN
// ==========================================

app.use(
  '/api/admin',
  authMiddleware,
  permissionsMiddleware,
  validationMiddleware,
  adminRoutes
);

// ==========================================
// PÁGINA ADMIN
// ==========================================

app.get('/admin*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});

// ==========================================
// ROTA DE INFORMAÇÕES
// ==========================================

app.get('/api/info', (req, res) => {
  res.json({
    nome: 'Fofoca Bot',
    versao: '1.0.0',
    ambiente: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// TRATAMENTO DE 404
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: 'Rota não encontrada',
  });
});

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('❌ Erro:', error);

  const statusCode = error.statusCode || 500;
  const mensagem = error.mensagem || 'Erro interno do servidor';

  res.status(statusCode).json({
    sucesso: false,
    mensagem,
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  });
});

// ==========================================
// EXPORTAÇÃO
// ==========================================

export default app;
