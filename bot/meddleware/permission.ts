// ==========================================
// FOFOCA BOT - Middleware de Permissões
// ==========================================

import express from 'express';

// ==========================================
// VERIFICAR PERMISSÃO DE ADMIN
// ==========================================

export function adminMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const user = (req as any).user;

    if (!user || user.tipo !== 'admin') {
      return res.status(403).json({ erro: 'Acesso negado' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ erro: 'Acesso negado' });
  }
}

export default adminMiddleware;
