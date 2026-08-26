// ==========================================
// FOFOCA BOT - Servidor Completo
// ==========================================

import express from 'express';
import { Telegraf } from 'telegraf';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

// ==========================================
// BANCO DE DADOS
// ==========================================

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Testar conexão
pool.query('SELECT 1')
  .then(() => console.log('✅ Banco de dados conectado'))
  .catch((err) => console.log('⚠️ Erro banco:', err.message));

// ==========================================
// EXECUTAR SCHEMA
// ==========================================

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  telegram_user_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  language_code VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'ATIVA',
  approval_status VARCHAR(50) DEFAULT 'PENDENTE',
  rejection_reason TEXT,
  amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(id),
  anunciante VARCHAR(255),
  instagram VARCHAR(255),
  formato VARCHAR(50),
  data VARCHAR(20),
  status VARCHAR(50) DEFAULT 'ATIVA',
  valor DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(id),
  provider VARCHAR(50) DEFAULT 'MERCADO_PAGO',
  external_payment_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'PENDENTE',
  amount DECIMAL(10,2) DEFAULT 0,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rules (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  condicao TEXT,
  peso INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  chave VARCHAR(255) UNIQUE NOT NULL,
  valor TEXT,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(100),
  user_id INTEGER,
  dados JSONB,
  ip VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS security_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  tipo VARCHAR(100),
  dados JSONB,
  ip VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS advertising_formats (
  id VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true
);

INSERT INTO advertising_formats (id, nome, descricao, preco) VALUES
('story', 'Story', 'Publicação nos stories por 24 horas', 150.00),
('feed', 'Feed', 'Publicação no feed principal', 200.00),
('reels', 'Reels', 'Vídeo no formato Reels', 250.00),
('pacote', 'Pacote Completo', 'Story + Feed + Reels', 500.00)
ON CONFLICT (id) DO NOTHING;
`;

pool.query(schema)
  .then(() => console.log('✅ Tabelas criadas'))
  .catch((err) => console.log('⚠️ Erro schema:', err.message));

// ==========================================
// ROTAS DA API
// ==========================================

// Saúde
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('🤖 Fofoca Bot está rodando!');
});

// API Info
app.get('/api/info', (req, res) => {
  res.json({
    nome: 'Fofoca Bot',
    versao: '1.0.0',
    status: 'ok',
  });
});

// Listar solicitações
app.get('/api/solicitacoes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM applications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar solicitações' });
  }
});

// Criar solicitação
app.post('/api/solicitacoes', async (req, res) => {
  try {
    const { user_id, empresa, instagram, email, telefone, formato, data, descricao } = req.body;
    
    const result = await pool.query(
      `INSERT INTO applications (user_id, status, approval_status) VALUES ($1, 'ATIVA', 'PENDENTE') RETURNING *`,
      [user_id]
    );

    const applicationId = result.rows[0].id;

    await pool.query(
      `INSERT INTO application_fields (application_id, field_name, field_value) VALUES 
       ($1, 'empresa', $2),
       ($1, 'instagram', $3),
       ($1, 'email', $4),
       ($1, 'telefone', $5),
       ($1, 'formato', $6),
       ($1, 'data', $7),
       ($1, 'descricao', $8)`,
      [applicationId, empresa, instagram, email, telefone, formato, data, descricao]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar solicitação' });
  }
});

// ==========================================
// BOT TELEGRAM
// ==========================================

if (TOKEN) {
  const bot = new Telegraf(TOKEN);

  // Salvar usuário
  async function salvarUsuario(ctx: any) {
    const user = ctx.from;
    if (!user) return;

    try {
      await pool.query(
        `INSERT INTO users (telegram_user_id, username, first_name, last_name) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (telegram_user_id) DO UPDATE SET 
         username = $2, first_name = $3, last_name = $4`,
        [user.id, user.username, user.first_name, user.last_name]
      );
    } catch (error) {
      console.log('⚠️ Erro ao salvar usuário:', error);
    }
  }

  // Comando start
  bot.start(async (ctx) => {
    await salvarUsuario(ctx);
    const user = ctx.from;
    const nome = user?.first_name || 'Anunciante';

    const mensagem = [
      `👋 Olá, ${nome}!`,
      ``,
      `Bem-vindo ao *Fofoca Bot*!`,
      ``,
      `📢 *Comandos:*`,
      `/anunciar - Quero anunciar`,
      `/valores - Ver valores`,
      `/ajuda - Como funciona`,
      `/suporte - Suporte`,
    ].join('\n');

    await ctx.reply(mensagem, { parse_mode: 'Markdown' });
  });

  // Comando ajuda
  bot.help((ctx) => {
    ctx.reply(
      [
        `❓ *COMO FUNCIONA*`,
        ``,
        `1️⃣ Clique em /anunciar`,
        `2️⃣ Preencha os dados`,
        `3️⃣ Aguarde aprovação`,
        `4️⃣ Pague via Mercado Pago`,
        `5️⃣ Publicidade confirmada!`,
      ].join('\n'),
      { parse_mode: 'Markdown' }
    );
  });

  // Comando anunciar
  bot.command('anunciar', (ctx) => {
    ctx.reply(
      [
        `📢 *QUERO ANUNCIAR*`,
        ``,
        `Vamos começar!`,
        ``,
        `Digite o nome da sua empresa:`,
      ].join('\n'),
      { parse_mode: 'Markdown' }
    );
  });

  // Comando valores
  bot.command('valores', (ctx) => {
    ctx.reply(
      [
        `💰 *VALORES*`,
        ``,
        `📱 Story - R$ 150,00`,
        `📝 Feed - R$ 200,00`,
        `🎥 Reels - R$ 250,00`,
        `📦 Pacote - R$ 500,00`,
      ].join('\n'),
      { parse_mode: 'Markdown' }
    );
  });

  // Comando suporte
  bot.command('suporte', (ctx) => {
    ctx.reply(
      [
        `🆘 *SUPORTE*`,
        ``,
        `E-mail: suporte@fofocabot.com`,
        `Telegram: @suporte_fofoca`,
      ].join('\n'),
      { parse_mode: 'Markdown' }
    );
  });

  // Responder mensagens
  bot.on('text', async (ctx) => {
    const texto = ctx.message.text;
    
    if (!texto.startsWith('/')) {
      ctx.reply('📝 Recebido! Aguarde nosso contato.');
    }
  });

  // Webhook
  app.post('/webhook/telegram', (req, res) => {
    bot.handleUpdate(req.body);
    res.sendStatus(200);
  });

  // Configurar webhook
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
  if (RENDER_URL) {
    bot.telegram.setWebhook(`${RENDER_URL}/webhook/telegram`);
    console.log(`✅ Webhook: ${RENDER_URL}/webhook/telegram`);
  } else {
    bot.launch();
    console.log('✅ Bot em polling');
  }
}

// ==========================================
// PAINEL ADMIN
// ==========================================

app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));
app.use('/admin-assets', express.static(path.join(__dirname, '..', 'admin-assets')));

// ==========================================
// INICIAR
// ==========================================

app.listen(PORT, () => {
  console.log(`🚀 Fofoca Bot rodando na porta ${PORT}`);
});

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

process.on('SIGTERM', async () => {
  console.log('🛑 Encerrando...');
  await pool.end();
  process.exit(0);
});
