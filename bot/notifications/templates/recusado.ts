// ==========================================
// FOFOCA BOT - Template E-mail Recusado
// ==========================================

export function templateRecusado(motivo: string): string {
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
        h1 { color: #F44336; margin: 0; }
        .content { margin-bottom: 30px; }
        .motivo { background: #ffebee; padding: 20px; border-radius: 8px; }
        .footer { text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">❌</div>
          <h1>Publicidade Recusada</h1>
        </div>
        <div class="content">
          <p>Infelizmente sua solicitação foi <strong>RECUSADA</strong>.</p>
          <div class="motivo">
            <p><strong>Motivo:</strong> ${motivo || 'Não especificado'}</p>
          </div>
          <p>Você pode tentar novamente com dados diferentes.</p>
        </div>
        <div class="footer">
          <p>Fofoca Bot - Todos os direitos reservados</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default templateRecusado;
