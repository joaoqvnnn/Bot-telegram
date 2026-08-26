// ==========================================
// FOFOCA BOT - Middleware de Validação
// ==========================================

import express from 'express';
import { z } from 'zod';

// ==========================================
// VALIDAR CORPO DA REQUISIÇÃO
// ==========================================

export function validationMiddleware(schema: z.ZodSchema) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({ erro: 'Dados inválidos' });
    }
  };
}

export default validationMiddleware;
