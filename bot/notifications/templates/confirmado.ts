// ==========================================
// FOFOCA BOT - Template E-mail Confirmado
// ==========================================

export function templateConfirmado(dados: any): string {
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
        h1 { color: #4CAF50; margin: 0; }
        .content { margin-bottom: 30px; }
        .details { background: #f9f9f9; padding: 20px; border-radius: 8px; }
        .footer { text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">🎉</div>
          <h1>Pagamento Confirmado!</h1>
        </div>
        <div class="content">
          <p>Sua publicidade está <strong>CONFIRMADA</strong>!</p>
          <div class="details">
            <p><strong>Empresa:</strong> ${dados.empresa || 'N/A'}</p>
            <p><strong>Formato:</strong> ${dados.formatoNome || 'N/A'}</p>
            <p><strong>Data:</strong> ${dados.data || 'N/A'}</p>
          </div>
          <p>Obrigado por anunciar conosco!</p>
        </div>
        <div class="footer">
          <p>Fofoca Bot - Todos os direitos reservados</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default templateConfirmado;
