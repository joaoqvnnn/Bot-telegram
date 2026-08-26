// ==========================================
// FOFOCA BOT - Validação de Formulários
// ==========================================

import { logger } from '../../config/logger';
import { FormState } from './form-engine';

// ==========================================
// VALIDAR CAMPO
// ==========================================

export function validarCampo(campo: string, valor: string): { valido: boolean; erro?: string } {
  switch (campo) {
    case 'empresa':
      return validarEmpresa(valor);

    case 'instagram':
      return validarInstagram(valor);

    case 'email':
      return validarEmail(valor);

    case 'telefone':
      return validarTelefone(valor);

    case 'formato':
      return validarFormato(valor);

    case 'data':
      return validarData(valor);

    case 'descricao':
      return validarDescricao(valor);

    default:
      return { valido: false, erro: 'Campo não reconhecido' };
  }
}

// ==========================================
// VALIDAÇÕES INDIVIDUAIS
// ==========================================

function validarEmpresa(valor: string) {
  if (!valor.trim()) {
    return { valido: false, erro: 'Nome da empresa é obrigatório' };
  }

  if (valor.length < 3) {
    return { valido: false, erro: 'Nome muito curto (mínimo 3 caracteres)' };
  }

  if (valor.length > 100) {
    return { valido: false, erro: 'Nome muito longo (máximo 100 caracteres)' };
  }

  return { valido: true };
}

function validarInstagram(valor: string) {
  const instagram = valor.replace('@', '').trim();

  if (!instagram) {
    return { valido: false, erro: 'Instagram é obrigatório' };
  }

  const regex = /^[a-zA-Z0-9._]+$/;

  if (!regex.test(instagram)) {
    return { valido: false, erro: 'Instagram contém caracteres inválidos' };
  }

  return { valido: true };
}

function validarEmail(valor: string) {
  const email = valor.trim().toLowerCase();

  if (!email) {
    return { valido: false, erro: 'E-mail é obrigatório' };
  }

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(email)) {
    return { valido: false, erro: 'E-mail inválido' };
  }

  return { valido: true };
}

function validarTelefone(valor: string) {
  const telefone = valor.replace(/\D/g, '');

  if (!telefone) {
    return { valido: false, erro: 'Telefone é obrigatório' };
  }

  if (telefone.length < 10 || telefone.length > 11) {
    return { valido: false, erro: 'Telefone deve ter 10 ou 11 dígitos' };
  }

  return { valido: true };
}

function validarFormato(valor: string) {
  const formatos = ['story', 'feed', 'reels', 'pacote'];

  if (!formatos.includes(valor)) {
    return { valido: false, erro: 'Formato inválido' };
  }

  return { valido: true };
}

function validarData(valor: string) {
  if (!valor) {
    return { valido: false, erro: 'Data é obrigatória' };
  }

  return { valido: true };
}

function validarDescricao(valor: string) {
  if (!valor.trim()) {
    return { valido: false, erro: 'Descrição é obrigatória' };
  }

  if (valor.length < 10) {
    return { valido: false, erro: 'Descrição muito curta (mínimo 10 caracteres)' };
  }

  if (valor.length > 500) {
    return { valido: false, erro: 'Descrição muito longa (máximo 500 caracteres)' };
  }

  return { valido: true };
}

// ==========================================
// VALIDAR FORMULÁRIO COMPLETO
// ==========================================

export function validarFormularioCompleto(formState: FormState): { valido: boolean; erros: string[] } {
  const erros: string[] = [];
  const camposObrigatorios = [
    'empresa',
    'instagram',
    'email',
    'telefone',
    'formato',
    'data',
    'descricao',
  ];

  for (const campo of camposObrigatorios) {
    const valor = formState.dados[campo];

    if (!valor) {
      erros.push(`${campo} é obrigatório`);
      continue;
    }

    const resultado = validarCampo(campo, valor);

    if (!resultado.valido && resultado.erro) {
      erros.push(resultado.erro);
    }
  }

  return {
    valido: erros.length === 0,
    erros,
  };
}

export default {
  validarCampo,
  validarFormularioCompleto,
};
