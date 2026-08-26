// ==========================================
// FOFOCA BOT - Script do Dashboard
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    if (!verificarAutenticacao()) return;

    // Carregar dados do dashboard
    await carregarDashboard();

    // Exibir nome do admin
    exibirNomeAdmin();
});

// ==========================================
// CARREGAR DADOS DO DASHBOARD
// ==========================================

async function carregarDashboard() {
    try {
        const dados = await apiRequest('/admin/dashboard');

        // Atualizar estatísticas
        document.getElementById('stat-solicitacoes').textContent = dados.totalSolicitacoes || 0;
        document.getElementById('stat-aprovados').textContent = dados.totalAprovados || 0;
        document.getElementById('stat-recusados').textContent = dados.totalRecusados || 0;
        document.getElementById('stat-revisao').textContent = dados.totalRevisao || 0;
        document.getElementById('stat-pagamentos').textContent = dados.totalPagamentos || 0;
        document.getElementById('stat-usuarios').textContent = dados.totalUsuarios || 0;
    } catch (error) {
        console.error('❌ Erro ao carregar dashboard:', error);
    }
}

// ==========================================
// EXIBIR NOME DO ADMIN
// ==========================================

function exibirNomeAdmin() {
    const adminUser = localStorage.getItem(ADMIN_USER_KEY);
    
    if (adminUser) {
        const user = JSON.parse(adminUser);
        const nomeElement = document.getElementById('admin-name');
        
        if (nomeElement) {
            nomeElement.textContent = `👋 Olá, ${user.nome || 'Admin'}`;
        }
    }
}
