// ==========================================
// FOFOCA BOT - Template E-mail Pagamento
// ==========================================

export function templatePagamento(valor: number): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 30px; }
        .header { text-align: center; margin-bottom: 30px; }
        .icon { font-size: 48px; margin-bottom: 10px; }
        h1 { color: #2196F3; margin: 0; }
        .valor { text-align: center; font-size: 36px; color: #2196F3; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">💳</div>
          <h1>Pagamento Pendente</h1>
        </div>
        <div class="content">
          <p>Você tem um pagamento pendente:</p>
          <div class="valor">R$ ${valor.toFixed(2)}</div>
          <p>Realize o pagamento para confirmar sua publicidade.</p>
        </div>
        <div class="footer">
          <p>Fofoca Bot - Todos os direitos reservados</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default templatePagamento;
