// ==========================================
// FOFOCA BOT - Script de Campanhas
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    if (!verificarAutenticacao()) return;

    await carregarCampanhas();

    const filtroStatus = document.getElementById('filtro-status');
    if (filtroStatus) {
        filtroStatus.addEventListener('change', carregarCampanhas);
    }

    if (window.location.pathname.includes('campanha.html')) {
        await carregarDetalhesCampanha();
    }
});

// ==========================================
// CARREGAR CAMPANHAS
// ==========================================

async function carregarCampanhas() {
    try {
        const filtroStatus = document.getElementById('filtro-status')?.value;
        const endpoint = filtroStatus ? `/admin/campaigns?status=${filtroStatus}` : '/admin/campaigns';
        
        const campanhas = await apiRequest(endpoint);
        const tabela = document.getElementById('tabela-campanhas');

        if (!tabela) return;

        tabela.innerHTML = '';

        campanhas.forEach((campanha) => {
            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>#${campanha.id}</td>
                <td>${campanha.anunciante || 'N/A'}</td>
                <td>@${campanha.instagram || 'N/A'}</td>
                <td>${campanha.formato || 'N/A'}</td>
                <td>${formatarData(campanha.data)}</td>
                <td>${formatarMoeda(campanha.valor)}</td>
                <td><span class="badge ${obterStatusBadge(campanha.status)}">${campanha.status}</span></td>
                <td>
                    <button class="btn-acao btn-visualizar" onclick="window.location.href='campanha.html?id=${campanha.id}'">👁️</button>
                    ${campanha.status === 'ATIVA' ? `
                        <button class="btn-acao btn-recusar" onclick="cancelarCampanha(${campanha.id})">❌</button>
                    ` : ''}
                </td>
            `;

            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('❌ Erro ao carregar campanhas:', error);
    }
}

// ==========================================
// CARREGAR DETALHES DA CAMPANHA
// ==========================================

async function carregarDetalhesCampanha() {
    try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (!id) return;

        const campanha = await apiRequest(`/admin/campaigns/${id}`);
        const container = document.getElementById('detalhes-campanha');

        if (!container) return;

        container.innerHTML = `
            <div class="config-section">
                <h3>📢 Informações da Campanha</h3>
                <p><strong>ID:</strong> #${campanha.id}</p>
                <p><strong>Status:</strong> <span class="badge ${obterStatusBadge(campanha.status)}">${campanha.status}</span></p>
                <p><strong>Data Criação:</strong> ${formatarDataHora(campanha.created_at)}</p>
            </div>

            <div class="config-section">
                <h3>👥 Dados do Anunciante</h3>
                <p><strong>Anunciante:</strong> ${campanha.anunciante || 'N/A'}</p>
                <p><strong>Instagram:</strong> @${campanha.instagram || 'N/A'}</p>
            </div>

            <div class="config-section">
                <h3>📋 Dados da Publicidade</h3>
                <p><strong>Formato:</strong> ${campanha.formato || 'N/A'}</p>
                <p><strong>Data:</strong> ${formatarData(campanha.data)}</p>
                <p><strong>Valor:</strong> ${formatarMoeda(campanha.valor)}</p>
            </div>
        `;
    } catch (error) {
        console.error('❌ Erro ao carregar detalhes:', error);
    }
}

// ==========================================
// CANCELAR CAMPANHA
// ==========================================

async function cancelarCampanha(id) {
    if (!confirm('Cancelar esta campanha?')) return;

    try {
        await apiRequest(`/admin/campaigns/${id}/cancelar`, 'POST');
        alert('❌ Campanha cancelada.');
        await carregarCampanhas();
    } catch (error) {
        alert('❌ ' + error.message);
    }
}
