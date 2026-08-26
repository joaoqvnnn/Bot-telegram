// ==========================================
// FOFOCA BOT - Middleware de Segurança
// ==========================================

import express from 'express';
import helmet from 'helmet';

// ==========================================
// HEADERS DE SEGURANÇA
// ==========================================

export const securityMiddleware = helmet();

export default securityMiddleware;
