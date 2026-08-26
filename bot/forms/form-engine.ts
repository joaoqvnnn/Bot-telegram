// ==========================================
// FOFOCA BOT - Motor de Formulários
// ==========================================

import { Context } from 'telegraf';
import { logger } from '../../config/logger';
import { sessionManager } from '../../flows/session-manager';

// ==========================================
// TIPOS DO FORMULÁRIO
// ==========================================

export type FieldType = 'texto' | 'email' | 'telefone' | 'instagram' | 'data' | 'formato' | 'descricao';

export type FieldConfig = {
  nome: string;
  tipo: FieldType;
  obrigatorio: boolean;
  validadores?: ((valor: string) => boolean)[];
  mensagemPergunta: string;
  mensagemErro?: string;
};

export type FormConfig = {
  nome: string;
  titulo: string;
  fields: FieldConfig[];
};

export type FormState = {
  config: FormConfig;
  fieldAtualIndex: number;
  dados: Record<string, any>;
  status: 'preenchendo' | 'validando' | 'concluido' | 'cancelado';
};

// ==========================================
// CLASSE FORM ENGINE
// ==========================================

export class FormEngine {
  private forms: Map<string, FormConfig> = new Map();

  // ==========================================
  // REGISTRAR FORMULÁRIO
  // ==========================================

  registrar(config: FormConfig) {
    this.forms.set(config.nome, config);
    logger.info(`✅ Formulário registrado: ${config.nome}`);
    return this;
  }

  // ==========================================
  // OBTER FORMULÁRIO
  // ==========================================

  obterForm(nome: string): FormConfig | undefined {
    return this.forms.get(nome);
  }

  // ==========================================
  // INICIAR FORMULÁRIO
  // ==========================================

  async iniciar(ctx: Context, formNome: string) {
    try {
      const config = this.obterForm(formNome);

      if (!config) {
        logger.error(`❌ Formulário não encontrado: ${formNome}`);
        await ctx.reply('❌ Formulário não encontrado.');
        return;
      }

      const user = ctx.from;

      if (!user) {
        return;
      }

      // Criar estado do formulário
      const estado: FormState = {
        config,
        fieldAtualIndex: 0,
        dados: {},
        status: 'preenchendo',
      };

      // Salvar na sessão
      await sessionManager.atualizarDados(user.id, {
        formState: estado,
      });

      logger.info(`🚀 Formulário iniciado: ${config.titulo}`);

      // Perguntar primeiro campo
      await this.perguntarCampo(ctx, config, 0);
    } catch (error) {
      logger.error('❌ Erro ao iniciar formulário:', error);
      await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
    }
  }

  // ==========================================
  // PROCESSAR RESPOSTA
  // ==========================================

  async processarResposta(ctx: Context, valor: string) {
    try {
      const user = ctx.from;

      if (!user) {
        return;
      }

      const sessao = await sessionManager.obterSessao(user.id);

      if (!sessao || !sessao.dados?.formState) {
        return;
      }

      const formState = sessao.dados.formState as FormState;
      const config = formState.config;
      const campoAtual = config.fields[formState.fieldAtualIndex];

      // Validar campo
      const valido = await this.validarCampo(campoAtual, valor);

      if (!valido) {
        await ctx.reply(campoAtual.mensagemErro || '❌ Valor inválido. Tente novamente:');
        return;
      }

      // Salvar valor
      formState.dados[campoAtual.nome] = valor;
      formState.fieldAtualIndex++;

      // Verificar se terminou
      if (formState.fieldAtualIndex >= config.fields.length) {
        formState.status = 'concluido';
        await sessionManager.atualizarDados(user.id, { formState });
        await this.mostrarResumo(ctx, formState);
        return;
      }

      // Salvar estado atualizado
      await sessionManager.atualizarDados(user.id, { formState });

      // Perguntar próximo campo
      await this.perguntarCampo(ctx, config, formState.fieldAtualIndex);
    } catch (error) {
      logger.error('❌ Erro ao processar resposta:', error);
      await ctx.reply('❌ Ocorreu um erro. Tente novamente.');
    }
  }

  // ==========================================
  // PERGUNTAR CAMPO
  // ==========================================

  private async perguntarCampo(ctx: Context, config: FormConfig, index: number) {
    const campo = config.fields[index];

    if (!campo) {
      return;
    }

    await ctx.reply(campo.mensagemPergunta);
  }

  // ==========================================
  // VALIDAR CAMPO
  // ==========================================

  private async validarCampo(campo: FieldConfig, valor: string): Promise<boolean> {
    // Campo obrigatório
    if (campo.obrigatorio && !valor.trim()) {
      return false;
    }

    // Validadores customizados
    if (campo.validadores && campo.validadores.length > 0) {
      for (const validador of campo.validadores) {
        if (!validador(valor)) {
          return false;
        }
      }
    }

    return true;
  }

  // ==========================================
  // MOSTRAR RESUMO
  // ==========================================

  private async mostrarResumo(ctx: Context, formState: FormState) {
    const linhas = [
      `📋 *${formState.config.titulo}*`,
      ``,
    ];

    for (const campo of formState.config.fields) {
      const valor = formState.dados[campo.nome] || 'N/A';
      linhas.push(`• *${campo.nome}:* ${valor}`);
    }

    linhas.push(``);
    linhas.push(`✅ Formulário concluído!`);

    await ctx.reply(linhas.join('\n'), { parse_mode: 'Markdown' });
  }

  // ==========================================
  // LISTAR FORMULÁRIOS
  // ==========================================

  listarForms(): string[] {
    return Array.from(this.forms.keys());
  }

  // ==========================================
  // LIMPAR
  // ==========================================

  limpar() {
    this.forms.clear();
    return this;
  }
}

// ==========================================
// INSTÂNCIA ÚNICA
// ==========================================

export const formEngine = new FormEngine();

export default formEngine;
