// ==========================================
// FOFOCA BOT - Script de Regras
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    if (!verificarAutenticacao()) return;

    await carregarRegras();

    const btnNovaRegra = document.getElementById('btn-nova-regra');
    if (btnNovaRegra) {
        btnNovaRegra.addEventListener('click', criarRegra);
    }
});

// ==========================================
// CARREGAR REGRAS
// ==========================================

async function carregarRegras() {
    try {
        const regras = await apiRequest('/admin/rules');
        const tabela = document.getElementById('tabela-regras');

        if (!tabela) return;

        tabela.innerHTML = '';

        regras.forEach((regra) => {
            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>#${regra.id}</td>
                <td>${regra.nome || 'N/A'}</td>
                <td>${regra.condicao || 'N/A'}</td>
                <td>${regra.peso || 0}</td>
                <td><span class="badge ${regra.ativo ? 'badge-ativo' : 'badge-cancelado'}">${regra.ativo ? 'Ativa' : 'Inativa'}</span></td>
                <td>
                    <button class="btn-acao btn-editar" onclick="editarRegra(${regra.id})">✏️</button>
                    <button class="btn-acao btn-recusar" onclick="toggleRegra(${regra.id}, ${!regra.ativo})">🔄</button>
                </td>
            `;

            tabela.appendChild(linha);
        });
    } catch (error) {
        console.error('❌ Erro ao carregar regras:', error);
    }
}

// ==========================================
// CRIAR REGRA
// ==========================================

async function criarRegra() {
    const nome = prompt('Nome da regra:');
    if (!nome) return;

    const condicao = prompt('Condição (ex: dados.instagram.length >= 3):');
    if (!condicao) return;

    const peso = prompt('Peso (0-100):');
    if (!peso) return;

    try {
        await apiRequest('/admin/rules', 'POST', {
            nome,
            condicao,
            peso: parseInt(peso),
        });
        alert('✅ Regra criada!');
        await carregarRegras();
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// ==========================================
// EDITAR REGRA
// ==========================================

async function editarRegra(id) {
    const nome = prompt('Novo nome:');
    if (!nome) return;

    try {
        await apiRequest(`/admin/rules/${id}`, 'PUT', { nome });
        alert('✅ Regra atualizada!');
        await carregarRegras();
    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// ==========================================
// ATIVAR/DESATIVAR REGRA
// ==========================================

async function toggleRegra(id, ativo) {
    try {
        await apiRequest(`/admin/rules/${id}/toggle`, 'POST', { ativo });
        await carregarRegras();
    } catch (error) {
        alert('❌ ' + error.message);
    }
}
