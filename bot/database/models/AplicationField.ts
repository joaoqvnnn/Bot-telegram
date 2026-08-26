// ==========================================
// FOFOCA BOT - Modelo ApplicationField
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type ApplicationField = {
  id: number;
  application_id: number;
  field_name: string;
  field_value: string;
  created_at: Date;
};

// ==========================================
// MODELO APPLICATION FIELD
// ==========================================

export const ApplicationFieldModel = {
  async criar(dados: Partial<ApplicationField>): Promise<ApplicationField | null> {
    try {
      const resultado = await database.postgres.query(
        `INSERT INTO application_fields (application_id, field_name, field_value) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [dados.application_id, dados.field_name, dados.field_value]
      );
      return resultado.rows[0];
    } catch (error) {
      console.error('❌ Erro ao criar campo:', error);
      return null;
    }
  },

  async obterPorApplication(applicationId: number): Promise<ApplicationField[]> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM application_fields WHERE application_id = $1',
        [applicationId]
      );
      return resultado.rows;
    } catch (error) {
      console.error('❌ Erro ao obter campos:', error);
      return [];
    }
  },
};

export default ApplicationFieldModel;
