// ==========================================
// FOFOCA BOT - Script de Pagamentos
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    if (!verificarAutenticacao()) return;

    await carregarPagamentos();
});

// ==========================================
// CARREGAR PAGAMENTOS
// ==========================================

async function carregarPagamentos() {
    try {
        const pagamentos = await apiRequest('/admin/payments');
        const tabela = document.getElementById('tabela-pagamentos');

        if (!tabela) return;

        tabela.innerHTML = '';

        pagamentos.forEach((pagamento) => {
            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>#${pagamento.id}</td>
                <td>#${pagamento.application_id || 'N/A'}</td>
                <td>${formatarMoeda(pagamento.amount)}</td>
                <td>${pagamento.provider || 'N/A'}</td>
                <td><span class="badge ${obterStatusBadge(pagamento.status)}">${pagamento.status}</span></td>
                <td>${formatarDataHora(pagamento.created_at)}</td>
            `;

            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('❌ Erro ao carregar pagamentos:', error);
    }
}
