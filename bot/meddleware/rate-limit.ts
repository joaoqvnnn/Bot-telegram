// ==========================================
// FOFOCA BOT - Middleware de Rate Limit
// ==========================================

import express from 'express';
import rateLimit from 'express-rate-limit';

// ==========================================
// RATE LIMIT
// ==========================================

export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { erro: 'Muitas requisições' },
});

export default rateLimitMiddleware;
