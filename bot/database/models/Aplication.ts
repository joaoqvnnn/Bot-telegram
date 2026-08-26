// ==========================================
// FOFOCA BOT - Modelo Application
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type Application = {
  id: number;
  user_id: number;
  status: string;
  approval_status: string;
  rejection_reason: string | null;
  amount: number;
  created_at: Date;
  updated_at: Date;
};

// ==========================================
// MODELO APPLICATION
// ==========================================

export const ApplicationModel = {
  async criar(dados: Partial<Application>): Promise<Application | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO applications (user_id, status, approval_status, amount) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [dados.user_id, dados.status || 'ATIVA', dados.approval_status || 'PENDENTE', dados.amount || 0]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar solicitação:', error);
      return null;
    }
  },

  async obterPorId(id: number): Promise<Application | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM applications WHERE id = $1',
        [id]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter solicitação:', error);
      return null;
    }
  },

  async obterPorUserId(userId: number): Promise<Application[]> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return resultado.rows;
    } catch (error) {
      console.error('❌ Erro ao obter solicitações:', error);
      return [];
    }
  },

  async atualizarStatus(id: number, status: string): Promise<boolean> {
    try {
      await database.postgres.query(
        'UPDATE applications SET status = $2, updated_at = NOW() WHERE id = $1',
        [id, status]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      return false;
    }
  },

  async atualizarApprovalStatus(id: number, approvalStatus: string, motivo?: string): Promise<boolean> {
    try {
      await database.postgres.query(
        'UPDATE applications SET approval_status = $2, rejection_reason = $3, updated_at = NOW() WHERE id = $1',
        [id, approvalStatus, motivo || null]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar status de aprovação:', error);
      return false;
    }
  },
};

export default ApplicationModel;
