// ==========================================
// FOFOCA BOT - Schemas dos Formulários
// ==========================================

import { z } from 'zod';
import { FormConfig } from './form-engine';
import { camposPublicidade } from './fields';

// ==========================================
// SCHEMA DE VALIDAÇÃO (ZOD)
// ==========================================

export const schemaPublicidade = z.object({
  empresa: z.string().min(1, 'Nome da empresa é obrigatório').max(100),
  instagram: z.string().min(1, 'Instagram é obrigatório').max(50),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido').max(15),
  formato: z.enum(['story', 'feed', 'reels', 'pacote']),
  data: z.string().min(1, 'Data é obrigatória'),
  descricao: z.string().min(10, 'Descrição muito curta').max(500, 'Descrição muito longa'),
});

// ==========================================
// CONFIGURAÇÃO DO FORMULÁRIO
// ==========================================

export const formularioPublicidade: FormConfig = {
  nome: 'publicidade',
  titulo: 'FORMULÁRIO DE PUBLICIDADE',
  fields: camposPublicidade,
};

// ==========================================
// EXPORTAÇÃO
// ==========================================

export default {
  schemaPublicidade,
  formularioPublicidade,
};
