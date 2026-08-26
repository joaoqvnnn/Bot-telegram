-- ==========================================
-- FOFOCA BOT - Schema do Banco de Dados
-- ==========================================

-- ==========================================
-- USERS
-- ==========================================

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

-- ==========================================
-- TELEGRAM ACCOUNTS
-- ==========================================

CREATE TABLE IF NOT EXISTS telegram_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    telegram_user_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    language_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- APPLICATIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'ATIVA',
    approval_status VARCHAR(50) DEFAULT 'PENDENTE',
    rejection_reason TEXT,
    amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- APPLICATION FIELDS
-- ==========================================

CREATE TABLE IF NOT EXISTS application_fields (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    field_name VARCHAR(255) NOT NULL,
    field_value TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- APPROVALS
-- ==========================================

CREATE TABLE IF NOT EXISTS approvals (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- REJECTIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS rejections (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    reason TEXT,
    rejected_by INTEGER REFERENCES users(id),
    rejected_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- REVIEWS
-- ==========================================

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    reviewed_by INTEGER REFERENCES users(id),
    decision VARCHAR(50),
    decided_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- CAMPAIGNS
-- ==========================================

CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    anunciante VARCHAR(255),
    instagram VARCHAR(255),
    formato VARCHAR(50),
    data VARCHAR(20),
    status VARCHAR(50) DEFAULT 'ATIVA',
    valor DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- ADVERTISING FORMATS
-- ==========================================

CREATE TABLE IF NOT EXISTS advertising_formats (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- AVAILABILITY
-- ==========================================

CREATE TABLE IF NOT EXISTS availability (
    id SERIAL PRIMARY KEY,
    data VARCHAR(20) NOT NULL,
    formato VARCHAR(50) NOT NULL,
    disponivel BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(data, formato)
);

-- ==========================================
-- PAYMENTS
-- ==========================================

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    provider VARCHAR(50) DEFAULT 'MERCADO_PAGO',
    external_payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDENTE',
    amount DECIMAL(10, 2) DEFAULT 0,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- PAYMENT EVENTS
-- ==========================================

CREATE TABLE IF NOT EXISTS payment_events (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
    event_type VARCHAR(100),
    event_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- SECURITY EVENTS
-- ==========================================

CREATE TABLE IF NOT EXISTS security_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    tipo VARCHAR(100),
    dados JSONB,
    ip VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- ATTEMPTS
-- ==========================================

CREATE TABLE IF NOT EXISTS attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tipo VARCHAR(100),
    dados JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- SESSIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    chat_id BIGINT,
    flow_atual VARCHAR(100),
    step_atual VARCHAR(100),
    dados JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- RULES
-- ==========================================

CREATE TABLE IF NOT EXISTS rules (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    condicao TEXT,
    peso INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- SETTINGS
-- ==========================================

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(255) UNIQUE NOT NULL,
    valor TEXT,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- AUDIT LOGS
-- ==========================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(100),
    user_id INTEGER REFERENCES users(id),
    dados JSONB,
    ip VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- ÍNDICES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_users_telegram ON users(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(approval_status);
CREATE INDEX IF NOT EXISTS idx_payments_application ON payments(application_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_data ON campaigns(data);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_user ON security_events(user_id);

-- ==========================================
-- SEED: FORMATOS PADRÃO
-- ==========================================

INSERT INTO advertising_formats (id, nome, descricao, preco) VALUES
('story', 'Story', 'Publicação nos stories por 24 horas', 150.00),
('feed', 'Feed', 'Publicação no feed principal', 200.00),
('reels', 'Reels', 'Vídeo no formato Reels', 250.00),
('pacote', 'Pacote Completo', 'Story + Feed + Reels', 500.00)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- SEED: SETTINGS PADRÃO
-- ==========================================

INSERT INTO settings (chave, valor, descricao) VALUES
('limite_diario', '10', 'Limite de campanhas por dia'),
('tempo_sessao', '30', 'Tempo de sessão em minutos'),
('rate_limit', '100', 'Limite de requisições por 15 minutos'),
('notificacoes_telegram', 'true', 'Ativar notificações via Telegram'),
('notificacoes_email', 'true', 'Ativar notificações via E-mail')
ON CONFLICT (chave) DO NOTHING;
