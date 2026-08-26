// ==========================================
// FOFOCA BOT - Definição de Campos
// ==========================================

import { FieldConfig } from './form-engine';

// ==========================================
// CAMPOS DO FORMULÁRIO DE PUBLICIDADE
// ==========================================

export const campoEmpresa: FieldConfig = {
  nome: 'empresa',
  tipo: 'texto',
  obrigatorio: true,
  mensagemPergunta: '🏢 Qual o nome da sua empresa?',
  mensagemErro: '❌ O nome da empresa é obrigatório. Digite novamente:',
};

export const campoInstagram: FieldConfig = {
  nome: 'instagram',
  tipo: 'instagram',
  obrigatorio: true,
  mensagemPergunta: '📱 Qual o Instagram da empresa? (Ex: @empresa)',
  mensagemErro: '❌ Instagram inválido. Use @usuario. Digite novamente:',
};

export const campoEmail: FieldConfig = {
  nome: 'email',
  tipo: 'email',
  obrigatorio: true,
  mensagemPergunta: '📧 Qual o e-mail para contato?',
  mensagemErro: '❌ E-mail inválido. Use exemplo@dominio.com. Digite novamente:',
};

export const campoTelefone: FieldConfig = {
  nome: 'telefone',
  tipo: 'telefone',
  obrigatorio: true,
  mensagemPergunta: '📞 Qual o telefone para contato? (Ex: (11) 99999-9999)',
  mensagemErro: '❌ Telefone inválido. Use (11) 99999-9999. Digite novamente:',
};

export const campoFormato: FieldConfig = {
  nome: 'formato',
  tipo: 'formato',
  obrigatorio: true,
  mensagemPergunta: '📱 Escolha o formato de publicidade:',
  mensagemErro: '❌ Formato inválido. Escolha novamente:',
};

export const campoData: FieldConfig = {
  nome: 'data',
  tipo: 'data',
  obrigatorio: true,
  mensagemPergunta: '📅 Escolha a data desejada:',
  mensagemErro: '❌ Data inválida. Escolha novamente:',
};

export const campoDescricao: FieldConfig = {
  nome: 'descricao',
  tipo: 'descricao',
  obrigatorio: true,
  mensagemPergunta: '📝 Descreva brevemente o que será divulgado:',
  mensagemErro: '❌ Descrição inválida. Digite novamente:',
};

// ==========================================
// LISTA DE TODOS OS CAMPOS
// ==========================================

export const camposPublicidade: FieldConfig[] = [
  campoEmpresa,
  campoInstagram,
  campoEmail,
  campoTelefone,
  campoFormato,
  campoData,
  campoDescricao,
];

export default {
  camposPublicidade,
};
