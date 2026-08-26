// ==========================================
// FOFOCA BOT - Script de Solicitações
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    if (!verificarAutenticacao()) return;

    // Carregar solicitações
    await carregarSolicitacoes();

    // Configurar filtro
    const filtroStatus = document.getElementById('filtro-status');
    if (filtroStatus) {
        filtroStatus.addEventListener('change', carregarSolicitacoes);
    }

    // Verificar se é página de detalhes
    if (window.location.pathname.includes('solicitacao.html')) {
        await carregarDetalhesSolicitacao();
    }
});

// ==========================================
// CARREGAR SOLICITAÇÕES
// ==========================================

async function carregarSolicitacoes() {
    try {
        const filtroStatus = document.getElementById('filtro-status')?.value;
        const endpoint = filtroStatus ? `/admin/applications?status=${filtroStatus}` : '/admin/applications';
        
        const solicitacoes = await apiRequest(endpoint);
        const tabela = document.getElementById('tabela-solicitacoes');

        if (!tabela) return;

        tabela.innerHTML = '';

        solicitacoes.forEach((solicitacao) => {
            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>#${solicitacao.id}</td>
                <td>${solicitacao.empresa || 'N/A'}</td>
                <td>@${solicitacao.instagram || 'N/A'}</td>
                <td>${solicitacao.formato || 'N/A'}</td>
                <td>${formatarData(solicitacao.data)}</td>
                <td><span class="badge ${obterStatusBadge(solicitacao.approval_status)}">${solicitacao.approval_status}</span></td>
                <td>
                    <button class="btn-acao btn-visualizar" onclick="window.location.href='solicitacao.html?id=${solicitacao.id}'">👁️</button>
                    ${solicitacao.approval_status === 'PENDENTE' ? `
                        <button class="btn-acao btn-aprovar" onclick="aprovarSolicitacao(${solicitacao.id})">✅</button>
                        <button class="btn-acao btn-recusar" onclick="recusarSolicitacao(${solicitacao.id})">❌</button>
                    ` : ''}
                </td>
            `;

            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('❌ Erro ao carregar solicitações:', error);
    }
}

// ==========================================
// CARREGAR DETALHES DA SOLICITAÇÃO
// ==========================================

async function carregarDetalhesSolicitacao() {
    try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (!id) return;

        const solicitacao = await apiRequest(`/admin/applications/${id}`);
        const container = document.getElementById('detalhes-solicitacao');

        if (!container) return;

        container.innerHTML = `
            <div class="config-section">
                <h3>📋 Informações da Solicitação</h3>
                <p><strong>ID:</strong> #${solicitacao.id}</p>
                <p><strong>Status:</strong> <span class="badge ${obterStatusBadge(solicitacao.approval_status)}">${solicitacao.approval_status}</span></p>
                <p><strong>Data Criação:</strong> ${formatarDataHora(solicitacao.created_at)}</p>
            </div>

            <div class="config-section">
                <h3>🏢 Dados do Anunciante</h3>
                <p><strong>Empresa:</strong> ${solicitacao.empresa || 'N/A'}</p>
                <p><strong>Instagram:</strong> @${solicitacao.instagram || 'N/A'}</p>
                <p><strong>E-mail:</strong> ${solicitacao.email || 'N/A'}</p>
                <p><strong>Telefone:</strong> ${solicitacao.telefone || 'N/A'}</p>
            </div>

            <div class="config-section">
                <h3>📢 Dados da Publicidade</h3>
                <p><strong>Formato:</strong> ${solicitacao.formato || 'N/A'}</p>
                <p><strong>Data:</strong> ${formatarData(solicitacao.data)}</p>
                <p><strong>Descrição:</strong> ${solicitacao.descricao || 'N/A'}</p>
                <p><strong>Valor:</strong> ${formatarMoeda(solicitacao.amount)}</p>
            </div>
        `;
    } catch (error) {
        console.error('❌ Erro ao carregar detalhes:', error);
    }
}

// ==========================================
// APROVAR SOLICITAÇÃO
// ==========================================

async function aprovarSolicitacao(id) {
    if (!confirm('Aprovar esta solicitação?')) return;

    try {
        await apiRequest(`/admin/applications/${id}/aprovar`, 'POST');
        alert('✅ Solicitação aprovada!');
        await carregarSolicitacoes();
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// ==========================================
// RECUSAR SOLICITAÇÃO
// ==========================================

async function recusarSolicitacao(id) {
    const motivo = prompt('Motivo da recusa:');

    if (!motivo) return;

    try {
        await apiRequest(`/admin/applications/${id}/recusar`, 'POST', { motivo });
        alert('❌ Solicitação recusada.');
        await carregarSolicitacoes();
    } catch (error) {
        alert('❌ ' + error.message);
    }
}
