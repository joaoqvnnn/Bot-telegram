# FOFOCA BOT - Documentação do Bot

## 📱 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| /start | Iniciar o bot |
| /ajuda | Ver ajuda |
| /anunciar | Quero anunciar |
| /pedidos | Meus pedidos |
| /valores | Ver valores |
| /conta | Minha conta |
| /suporte | Suporte |

## 🔄 Fluxo de Anúncio

### 1. Início
Usuário clica em "QUERO ANUNCIAR"

### 2. Formulário
O bot pergunta:
1. Nome da empresa
2. Instagram
3. E-mail
4. Telefone
5. Formato (Story, Feed, Reels, Pacote)
6. Data desejada
7. Descrição

### 3. Validação
- Validação de formato
- Validação de campos
- Detecção de duplicidade

### 4. Aprovação
- Regras automáticas
- Pontuação
- Decisão: Aprovado/Recusado/Revisão

### 5. Pagamento
- Mercado Pago
- Webhook de confirmação

## 📝 Formulário Dinâmico

O bot mantém UMA mensagem principal que é editada:
