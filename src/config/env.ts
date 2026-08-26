// ==========================================
// FOFOCA BOT - Configuração de Ambiente
// ==========================================

import dotenv from 'dotenv';
import { z } from 'zod';

// Carregar variáveis de ambiente
dotenv.config();

// ==========================================
// SCHEMA DE VALIDAÇÃO
// ==========================================

const envSchema = z.object({
  // Ambiente
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('3000'),
  APP_NAME: z.string().default('Fofoca Bot'),
  APP_URL: z.string().default('http://localhost:3000'),

  // Banco de Dados
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432'),
  DB_USER: z.string().default('postgres'),
  DB_PASS: z.string().default('postgres'),
  DB_NAME: z.string().default('fofoca_bot'),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_PASSWORD: z.string().optional(),

  // Telegram
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_WEBHOOK_URL: z.string().optional(),
  TELEGRAM_WEBHOOK_SECRET: z.string().optional(),

  // Mercado Pago
  MERCADO_PAGO_ACCESS_TOKEN: z.string().optional(),
  MERCADO_PAGO_PUBLIC_KEY: z.string().optional(),
  MERCADO_PAGO_WEBHOOK_SECRET: z.string().optional(),

  // E-mail
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().default('587'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default('noreply@fofocabot.com'),

  // Segurança
  JWT_SECRET: z.string().default('secret_dev'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_ROUNDS: z.string().default('10'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX: z.string().default('100'),

  // Admin
  ADMIN_USERNAME: z.string().default('admin'),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_2FA_SECRET: z.string().optional(),

  // Logs
  LOG_LEVEL: z.string().default('info'),
  SENTRY_DSN: z.string().optional(),
});

// ==========================================
// VALIDAÇÃO
// ==========================================

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Erro na validação das variáveis de ambiente:');
  console.error(parsed.error.format());
  process.exit(1);
}

// ==========================================
// EXPORTAÇÃO
// ==========================================

export const env = {
  // Ambiente
  NODE_ENV: parsed.data.NODE_ENV,
  PORT: parseInt(parsed.data.PORT),
  APP_NAME: parsed.data.APP_NAME,
  APP_URL: parsed.data.APP_URL,

  // Banco de Dados
  DB_HOST: parsed.data.DB_HOST,
  DB_PORT: parseInt(parsed.data.DB_PORT),
  DB_USER: parsed.data.DB_USER,
  DB_PASS: parsed.data.DB_PASS,
  DB_NAME: parsed.data.DB_NAME,

  // Redis
  REDIS_URL: parsed.data.REDIS_URL,
  REDIS_PASSWORD: parsed.data.REDIS_PASSWORD,

  // Telegram
  TELEGRAM_BOT_TOKEN: parsed.data.TELEGRAM_BOT_TOKEN,
  TELEGRAM_WEBHOOK_URL: parsed.data.TELEGRAM_WEBHOOK_URL,
  TELEGRAM_WEBHOOK_SECRET: parsed.data.TELEGRAM_WEBHOOK_SECRET,

  // Mercado Pago
  MERCADO_PAGO_ACCESS_TOKEN: parsed.data.MERCADO_PAGO_ACCESS_TOKEN,
  MERCADO_PAGO_PUBLIC_KEY: parsed.data.MERCADO_PAGO_PUBLIC_KEY,
  MERCADO_PAGO_WEBHOOK_SECRET: parsed.data.MERCADO_PAGO_WEBHOOK_SECRET,

  // E-mail
  SMTP_HOST: parsed.data.SMTP_HOST,
  SMTP_PORT: parseInt(parsed.data.SMTP_PORT),
  SMTP_USER: parsed.data.SMTP_USER,
  SMTP_PASS: parsed.data.SMTP_PASS,
  SMTP_FROM: parsed.data.SMTP_FROM,

  // Segurança
  JWT_SECRET: parsed.data.JWT_SECRET,
  JWT_EXPIRES_IN: parsed.data.JWT_EXPIRES_IN,
  BCRYPT_ROUNDS: parseInt(parsed.data.BCRYPT_ROUNDS),
  RATE_LIMIT_WINDOW_MS: parseInt(parsed.data.RATE_LIMIT_WINDOW_MS),
  RATE_LIMIT_MAX: parseInt(parsed.data.RATE_LIMIT_MAX),

  // Admin
  ADMIN_USERNAME: parsed.data.ADMIN_USERNAME,
  ADMIN_PASSWORD: parsed.data.ADMIN_PASSWORD,
  ADMIN_2FA_SECRET: parsed.data.ADMIN_2FA_SECRET,

  // Logs
  LOG_LEVEL: parsed.data.LOG_LEVEL,
  SENTRY_DSN: parsed.data.SENTRY_DSN,

  // CORS
  CORS: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
};
