// ==========================================
// FOFOCA BOT - Sanitização de Dados
// ==========================================

import { logger } from '../../config/logger';

// ==========================================
// SANITIZAÇÃO DE CAMPOS
// ==========================================

export function sanitizarCampo(campo: string, valor: string): string {
  switch (campo) {
    case 'empresa':
      return sanitizarEmpresa(valor);

    case 'instagram':
      return sanitizarInstagram(valor);

    case 'email':
      return sanitizarEmail(valor);

    case 'telefone':
      return sanitizarTelefone(valor);

    case 'formato':
      return sanitizarFormato(valor);

    case 'data':
      return sanitizarData(valor);

    case 'descricao':
      return sanitizarDescricao(valor);

    default:
      return sanitizarTexto(valor);
  }
}

// ==========================================
// SANITIZAÇÕES INDIVIDUAIS
// ==========================================

function sanitizarEmpresa(valor: string): string {
  // Remover espaços extras
  let sanitizado = valor.trim();

  // Limitar tamanho
  sanitizado = sanitizado.substring(0, 100);

  return sanitizado;
}

function sanitizarInstagram(valor: string): string {
  // Remover @ se tiver
  let sanitizado = valor.replace('@', '').trim();

  // Remover URL completa se tiver
  sanitizado = sanitizado.replace(/https?:\/\//, '');
  sanitizado = sanitizado.replace(/instagram\.com\//, '');

  // Remover caracteres inválidos
  sanitizado = sanitizado.replace(/[^a-zA-Z0-9._]/g, '');

  // Limitar tamanho
  sanitizado = sanitizado.substring(0, 50);

  return sanitizado;
}

function sanitizarEmail(valor: string): string {
  // Converter para minúsculas
  let sanitizado = valor.trim().toLowerCase();

  // Limitar tamanho
  sanitizado = sanitizado.substring(0, 200);

  return sanitizado;
}

function sanitizarTelefone(valor: string): string {
  // Remover tudo que não for número
  let sanitizado = valor.replace(/\D/g, '');

  // Limitar tamanho
  sanitizado = sanitizado.substring(0, 11);

  return sanitizado;
}

function sanitizarFormato(valor: string): string {
  // Converter para minúsculas
  let sanitizado = valor.trim().toLowerCase();

  // Limitar tamanho
  sanitizado = sanitizado.substring(0, 20);

  return sanitizado;
}

function sanitizarData(valor: string): string {
  // Remover espaços
  let sanitizado = valor.trim();

  // Limitar tamanho
  sanitizado = sanitizado.substring(0, 20);

  return sanitizado;
}

function sanitizarDescricao(valor: string): string {
  // Remover espaços extras
  let sanitizado = valor.trim();

  // Limitar tamanho
  sanitizado = sanitizado.substring(0, 500);

  return sanitizado;
}

function sanitizarTexto(valor: string): string {
  // Remover espaços extras
  let sanitizado = valor.trim();

  // Limitar tamanho
  sanitizado = sanitizado.substring(0, 200);

  return sanitizado;
}

// ==========================================
// SANITIZAÇÃO COMPLETA DO FORMULÁRIO
// ==========================================

export function sanitizarFormulario(dados: Record<string, any>): Record<string, any> {
  const sanitizado: Record<string, any> = {};

  for (const [chave, valor] of Object.entries(dados)) {
    if (typeof valor === 'string') {
      sanitizado[chave] = sanitizarCampo(chave, valor);
    } else {
      sanitizado[chave] = valor;
    }
  }

  return sanitizado;
}

// ==========================================
// REMOVER HTML/SCRIPT
// ==========================================

export function removerHTML(valor: string): string {
  // Remover tags HTML
  let sanitizado = valor.replace(/<[^>]*>/g, '');

  // Remover scripts
  sanitizado = sanitizado.replace(/<script.*?>.*?<\/script>/gi, '');

  // Remover eventos
  sanitizado = sanitizado.replace(/on\w+="[^"]*"/g, '');

  // Remover javascript:
  sanitizado = sanitizado.replace(/javascript:/gi, '');

  return sanitizado;
}

// ==========================================
// REMOVER CARACTERES ESPECIAIS
// ==========================================

export function removerCaracteresEspeciais(valor: string): string {
  // Manter apenas letras, números e espaços
  return valor.replace(/[^a-zA-Z0-9\s@._-]/g, '');
}

// ==========================================
// LIMPAR TODOS OS DADOS
// ==========================================

export function limparDados(dados: Record<string, any>): Record<string, any> {
  const limpo: Record<string, any> = {};

  for (const [chave, valor] of Object.entries(dados)) {
    if (typeof valor === 'string') {
      // Sanitizar
      let sanitizado = removerHTML(valor);
      sanitizado = removerCaracteresEspeciais(sanitizado);
      sanitizado = sanitizarCampo(chave, sanitizado);
      limpo[chave] = sanitizado;
    } else {
      limpo[chave] = valor;
    }
  }

  return limpo;
}

export default {
  sanitizarCampo,
  sanitizarFormulario,
  removerHTML,
  removerCaracteresEspeciais,
  limparDados,
};
