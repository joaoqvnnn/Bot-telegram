# FOFOCA BOT - Documentação do Banco de Dados

## 📊 Visão Geral

O banco de dados utiliza PostgreSQL com Redis para cache e sessões.

## 🗄️ Tabelas

### 1. USERS
Armazena dados dos usuários do bot.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| telegram_user_id | BIGINT | ID do Telegram |
| username | VARCHAR(255) | Nome de usuário |
| first_name | VARCHAR(255) | Primeiro nome |
| last_name | VARCHAR(255) | Sobrenome |
| language_code | VARCHAR(10) | Idioma |
| created_at | TIMESTAMP | Data criação |
| updated_at | TIMESTAMP | Data atualização |

### 2. TELEGRAM_ACCOUNTS
Contas Telegram vinculadas aos usuários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| user_id | INTEGER | FK users.id |
| telegram_user_id | BIGINT | ID Telegram |
| username | VARCHAR(255) | Username |
| first_name | VARCHAR(255) | Nome |
| last_name | VARCHAR(255) | Sobrenome |

### 3. APPLICATIONS
Solicitações de publicidade.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| user_id | INTEGER | FK users.id |
| status | VARCHAR(50) | Status geral |
| approval_status | VARCHAR(50) | Status de aprovação |
| rejection_reason | TEXT | Motivo da recusa |
| amount | DECIMAL(10,2) | Valor |
| created_at | TIMESTAMP | Data criação |
| updated_at | TIMESTAMP | Data atualização |

### 4. APPLICATION_FIELDS
Campos das solicitações.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| application_id | INTEGER | FK applications.id |
| field_name | VARCHAR(255) | Nome do campo |
| field_value | TEXT | Valor do campo |

### 5. APPROVALS
Registros de aprovações.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| application_id | INTEGER | FK applications.id |
| approved_by | INTEGER | FK users.id |
| approved_at | TIMESTAMP | Data aprovação |

### 6. REJECTIONS
Registros de rejeições.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| application_id | INTEGER | FK applications.id |
| reason | TEXT | Motivo |
| rejected_by | INTEGER | FK users.id |
| rejected_at | TIMESTAMP | Data rejeição |

### 7. REVIEWS
Revisões manuais.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| application_id | INTEGER | FK applications.id |
| reviewed_by | INTEGER | FK users.id |
| decision | VARCHAR(50) | Decisão |
| decided_at | TIMESTAMP | Data decisão |

### 8. CAMPAIGNS
Campanhas de publicidade.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| application_id | INTEGER | FK applications.id |
| anunciante | VARCHAR(255) | Nome do anunciante |
| instagram | VARCHAR(255) | Instagram |
| formato | VARCHAR(50) | Formato |
| data | VARCHAR(20) | Data |
| status | VARCHAR(50) | Status |
| valor | DECIMAL(10,2) | Valor |

### 9. ADVERTISING_FORMATS
Formatos de publicidade.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | VARCHAR(50) | ID único |
| nome | VARCHAR(255) | Nome |
| descricao | TEXT | Descrição |
| preco | DECIMAL(10,2) | Preço |
| ativo | BOOLEAN | Ativo/inativo |

### 10. AVAILABILITY
Disponibilidade de datas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| data | VARCHAR(20) | Data |
| formato | VARCHAR(50) | Formato |
| disponivel | BOOLEAN | Disponível |

### 11. PAYMENTS
Pagamentos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| application_id | INTEGER | FK applications.id |
| provider | VARCHAR(50) | Provedor |
| external_payment_id | VARCHAR(255) | ID externo |
| status | VARCHAR(50) | Status |
| amount | DECIMAL(10,2) | Valor |
| paid_at | TIMESTAMP | Data pagamento |

### 12. PAYMENT_EVENTS
Eventos de pagamento.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| payment_id | INTEGER | FK payments.id |
| event_type | VARCHAR(100) | Tipo evento |
| event_data | JSONB | Dados evento |

### 13. SECURITY_EVENTS
Eventos de segurança.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| user_id | INTEGER | FK users.id |
| tipo | VARCHAR(100) | Tipo |
| dados | JSONB | Dados |
| ip | VARCHAR(50) | IP |

### 14. ATTEMPTS
Tentativas de solicitação.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| user_id | INTEGER | FK users.id |
| tipo | VARCHAR(100) | Tipo |
| dados | JSONB | Dados |

### 15. SESSIONS
Sessões ativas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| user_id | INTEGER | FK users.id |
| chat_id | BIGINT | ID chat |
| flow_atual | VARCHAR(100) | Fluxo atual |
| step_atual | VARCHAR(100) | Passo atual |
| dados | JSONB | Dados sessão |

### 16. RULES
Regras de aprovação.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| nome | VARCHAR(255) | Nome |
| condicao | TEXT | Condição |
| peso | INTEGER | Peso |
| ativo | BOOLEAN | Ativa/inativa |

### 17. SETTINGS
Configurações do sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| chave | VARCHAR(255) | Chave |
| valor | TEXT | Valor |
| descricao | TEXT | Descrição |

### 18. AUDIT_LOGS
Logs de auditoria.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID único |
| tipo | VARCHAR(100) | Tipo |
| user_id | INTEGER | FK users.id |
| dados | JSONB | Dados |
| ip | VARCHAR(50) | IP |

## 🔍 Índices

```sql
users(telegram_user_id)
applications(user_id)
applications(approval_status)
payments(application_id)
payments(status)
campaigns(data)
campaigns(status)
attempts(user_id)
sessions(user_id)
audit_logs(user_id)
security_events(user_id)
