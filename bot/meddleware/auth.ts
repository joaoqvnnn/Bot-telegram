import express from 'express';
import jwt from 'jsonwebtoken';
import { securityConfig } from '../../config/security';

export function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const decodificado = jwt.verify(token, securityConfig.jwt.secret);

    (req as any).user = decodificado;
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
}

export default authMiddleware;
