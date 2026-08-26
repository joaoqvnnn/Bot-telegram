# ==========================================
# FOFOCA BOT - Dockerfile
# ==========================================

# ---------- Build Stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build do TypeScript
RUN npm run build

# Remover dependências de desenvolvimento
RUN npm prune --production

# ---------- Production Stage ----------
FROM node:18-alpine

WORKDIR /app

# Copiar dependências de produção
COPY --from=builder /app/node_modules ./node_modules

# Copiar build
COPY --from=builder /app/dist ./dist

# Copiar arquivos necessários
COPY package.json ./
COPY .env.example ./
COPY public ./public
COPY admin ./admin
COPY admin-assets ./admin-assets

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Comando de inicialização
CMD ["node", "dist/server.js"]
