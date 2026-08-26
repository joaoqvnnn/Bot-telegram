// ==========================================
// FOFOCA BOT - Modelo Approval
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type Approval = {
  id: number;
  application_id: number;
  approved_by: number | null;
  approved_at: Date;
  created_at: Date;
};

// ==========================================
// MODELO APPROVAL
// ==========================================

export const ApprovalModel = {
  async criar(dados: Partial<Approval>): Promise<Approval | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO approvals (application_id, approved_by) 
         VALUES ($1, $2) 
         RETURNING *`,
        [dados.application_id, dados.approved_by || null]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar aprovação:', error);
      return null;
    }
  },

  async obterPorApplication(applicationId: number): Promise<Approval | null> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM approvals WHERE application_id = $1',
        [applicationId]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter aprovação:', error);
      return null;
    }
  },
};

export default ApprovalModel;
