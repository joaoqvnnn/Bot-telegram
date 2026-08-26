# FOFOCA BOT

Bot de publicidade via Telegram com aprovação automática, pagamento via Mercado Pago e painel administrativo.

## 🚀 Funcionalidades

- 📱 Interface completa via Telegram (sem abrir site)
- 📝 Formulário dinâmico com mensagens editadas (não acumula)
- ✅ Validação em tempo real (formato + campos)
- 🛡️ Sistema de segurança (anti-fraude, duplicidade, rate-limit)
- 🤖 Aprovação/reprovação automática via motor de regras
- 👨‍💼 Revisão manual para casos incertos
- 💳 Pagamento via Mercado Pago (somente após aprovação)
- 🔔 Confirmação por webhook/status oficial do Mercado Pago
- 📊 Painel administrativo completo (preços, formatos, regras, campanhas)

## 🛠️ Tecnologias

- Node.js + TypeScript
- Express
- Telegram Bot API
- Mercado Pago SDK
- PostgreSQL
- Redis

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env

# Executar migrações
npm run migrate

# Iniciar em desenvolvimento
npm run dev

# Iniciar em produção
npm start
