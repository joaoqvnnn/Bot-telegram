// ==========================================
// FOFOCA BOT - Script de Segurança
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    if (!verificarAutenticacao()) return;

    await carregarDadosSeguranca();
});

// ==========================================
// CARREGAR DADOS DE SEGURANÇA
// ==========================================

async function carregarDadosSeguranca() {
    try {
        const container = document.getElementById('conteudo-seguranca');

        if (!container) return;

        const eventos = await apiRequest('/admin/security-events');

        container.innerHTML = `
            <div class="config-section">
                <h3>🔐 Eventos de Segurança</h3>
                <div id="lista-eventos">
                    ${eventos.map((evento) => `
                        <div class="notificacao-card">
                            <div class="notificacao-icon">⚠️</div>
                            <div class="notificacao-info">
                                <h4>${evento.tipo}</h4>
                                <p>Usuário: ${evento.user_id || 'N/A'} | ${formatarDataHora(evento.created_at)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="config-section">
                <h3>⚙️ Configurações de Segurança</h3>
                <div class="config-item">
                    <label>Rate Limit</label>
                    <input type="number" value="100" id="rate-limit">
                </div>
                <div class="config-item">
                    <label>Tempo de Sessão (min)</label>
                    <input type="number" value="30" id="tempo-sessao">
                </div>
                <button class="btn-primary" onclick="salvarConfiguracoes()">Salvar</button>
            </div>
        `;
    } catch (error) {
        console.error('❌ Erro ao carregar segurança:', error);
    }
}

// ==========================================
// SALVAR CONFIGURAÇÕES
// ==========================================

async function salvarConfiguracoes() {
    const rateLimit = document.getElementById('rate-limit').value;
    const tempoSessao = document.getElementById('tempo-sessao').value;

    try {
        await apiRequest('/admin/security-settings', 'POST', {
            rateLimit: parseInt(rateLimit),
            tempoSessao: parseInt(tempoSessao),
        });
        alert('✅ Configurações salvas!');
    } catch (error) {
        alert('❌ ' + error.message);
    }
}
