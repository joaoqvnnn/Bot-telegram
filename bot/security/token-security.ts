// ==========================================
// FOFOCA BOT - Segurança de Tokens
// ==========================================

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { logger } from '../config/logger';
import { database } from '../config/database';
import { securityConfig } from '../config/security';

// ==========================================
// CLASSE TOKEN SECURITY
// ==========================================

export class TokenSecurity {
  // ==========================================
  // GERAR TOKEN JWT
  // ==========================================

  gerarToken(userId: number, tipo: 'usuario' | 'admin' = 'usuario'): string {
    try {
      const token = jwt.sign(
        {
          userId,
          tipo,
        },
        securityConfig.jwt.secret,
        {
          expiresIn: securityConfig.jwt.expiresIn,
        }
      );

      return token;
    } catch (error) {
      logger.error('❌ Erro ao gerar token:', error);
      return '';
    }
  }

  // ==========================================
  // VERIFICAR TOKEN JWT
  // ==========================================

  verificarToken(token: string): any {
    try {
      const decodificado = jwt.verify(token, securityConfig.jwt.secret);
      return decodificado;
    } catch (error) {
      logger.error('❌ Erro ao verificar token:', error);
      return null;
    }
  }

  // ==========================================
  // GERAR TOKEN DE VERIFICAÇÃO
  // ==========================================

  gerarTokenVerificacao(): string {
    try {
      return crypto.randomBytes(32).toString('hex');
    } catch (error) {
      logger.error('❌ Erro ao gerar token de verificação:', error);
      return '';
    }
  }

  // ==========================================
  // GERAR CÓDIGO 2FA
  // ==========================================

  gerarCodigo2FA(): string {
    try {
      return Math.floor(100000 + Math.random() * 900000).toString();
    } catch (error) {
      logger.error('❌ Erro ao gerar código 2FA:', error);
      return '';
    }
  }

  // ==========================================
  // SALVAR TOKEN NO REDIS
  // ==========================================

  async salvarToken(chave: string, valor: string, expiracaoSegundos: number): Promise<boolean> {
    try {
      await database.redis.set(chave, valor, { EX: expiracaoSegundos });
      return true;
    } catch (error) {
      logger.error('❌ Erro ao salvar token:', error);
      return false;
    }
  }

  // ==========================================
  // VERIFICAR TOKEN NO REDIS
  // ==========================================

  async verificarTokenRedis(chave: string, valor: string): Promise<boolean> {
    try {
      const tokenSalvo = await database.redis.get(chave);
      return tokenSalvo === valor;
    } catch (error) {
      logger.error('❌ Erro ao verificar token no Redis:', error);
      return false;
    }
  }

  // ==========================================
  // REMOVER TOKEN DO REDIS
  // ==========================================

  async removerToken(chave: string): Promise<boolean> {
    try {
      await database.redis.del(chave);
      return true;
    } catch (error) {
      logger.error('❌ Erro ao remover token:', error);
      return false;
    }
  }
}

export const tokenSecurity = new TokenSecurity();
export default tokenSecurity;
