// ==========================================
// FOFOCA BOT - Modelo Availability
// ==========================================

import { database } from '../../config/database';

// ==========================================
// TIPOS
// ==========================================

export type Availability = {
  id: number;
  data: string;
  formato: string;
  disponivel: boolean;
  created_at: Date;
};

// ==========================================
// MODELO AVAILABILITY
// ==========================================

export const AvailabilityModel = {
  async verificar(data: string, formato: string): Promise<boolean> {
    try {
      const resultado = await database.postgres.query(
        'SELECT * FROM availability WHERE data = $1 AND formato = $2',
        [data, formato]
      );
      return resultado.rows[0]?.disponivel || false;
    } catch (error) {
      console.error('❌ Erro ao verificar disponibilidade:', error);
      return false;
    }
  },

  async reservar(data: string, formato: string): Promise<boolean> {
    try {
      await database.postgres.query(
        `INSERT INTO availability (data, formato, disponivel) 
         VALUES ($1, $2, false) 
         ON CONFLICT (data, formato) DO UPDATE SET disponivel = false`,
        [data, formato]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao reservar disponibilidade:', error);
      return false;
    }
  },

  async liberar(data: string, formato: string): Promise<boolean> {
    try {
      await database.postgres.query(
        `UPDATE availability SET disponivel = true WHERE data = $1 AND formato = $2`,
        [data, formato]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao liberar disponibilidade:', error);
      return false;
    }
  },
};

export default AvailabilityModel;
