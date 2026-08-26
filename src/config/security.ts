// ==========================================
// FOFOCA BOT - Configuração de Segurança
// ==========================================

import { env } from './env';

// ==========================================
// CONFIGURAÇÕES DE SEGURANÇA
// ==========================================

const securityConfig = {
  // JWT
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },

  // Bcrypt
  bcrypt: {
    rounds: env.BCRYPT_ROUNDS,
  },

  // Rate Limit
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  },

  // Anti-Fraude
  antiFraud: {
    // Limite de tentativas por usuário
    maxTentativasPorUsuario: 3,
    maxTentativasPorDia: 10,

    // Tempo mínimo entre solicitações (ms)
    tempoMinimoEntreSolicitacoes: 60000, // 1 minuto

    // Detecção de duplicidade
    duplicidade: {
      campos: ['instagram', 'email', 'telefone'],
      janelaTempoMs: 24 * 60 * 60 * 1000, // 24 horas
    },

    // Blacklist de IPs
    blacklistIPs: [] as string[],

    // Blacklist de palavras
    blacklistPalavras: [] as string[],
  },

  // Sessão
  sessao: {
    // Tempo de expiração da sessão (ms)
    tempoExpiracao: 30 * 60 * 1000, // 30 minutos

    // Limite de sessões por usuário
    maxSessoesPorUsuario: 5,
  },

  // Tokens
  tokens: {
    // Tempo de expiração dos tokens de verificação
    emailTokenExpiracao: 24 * 60 * 60 * 1000, // 24 horas
    telefoneTokenExpiracao: 10 * 60 * 1000, // 10 minutos
  },

  // Auditoria
  auditoria: {
    // Eventos que devem ser auditados
    eventos: [
      'LOGIN',
      'CADASTRO',
      'SOLICITACAO',
      'APROVACAO',
      'REJEICAO',
      'PAGAMENTO',
      'REEMBOLSO',
      'ADMIN_LOGIN',
      'ADMIN_ACAO',
    ],
  },

  // Headers de segurança
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  },
};

export { securityConfig };
