// ==========================================
// FOFOCA BOT - Script Principal do Admin
// ==========================================

// ==========================================
// CONFIGURAÇÃO
// ==========================================

const API_URL = 'http://localhost:3000/api';
const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_USER_KEY = 'admin_user';

// ==========================================
// AUTENTICAÇÃO
// ==========================================

// Verificar se está autenticado
function verificarAutenticacao() {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    
    if (!token) {
        window.location.href = '/admin/login.html';
        return false;
    }
    
    return true;
}

// Login
async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.sucesso) {
            localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
            localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
            window.location.href = '/admin/dashboard.html';
        } else {
            throw new Error(data.mensagem || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('❌ Erro no login:', error);
        throw error;
    }
}

// Logout
function logout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    window.location.href = '/admin/login.html';
}

// ==========================================
// REQUISIÇÕES API
// ==========================================

async function apiRequest(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.mensagem || 'Erro na requisição');
    }

    return data;
}

// ==========================================
// UTILITÁRIOS
// ==========================================

function formatarData(data) {
    if (!data) return 'N/A';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
}

function formatarDataHora(data) {
    if (!data) return 'N/A';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
}

function formatarMoeda(valor) {
    if (!valor) return 'R$ 0,00';
    return 'R$ ' + parseFloat(valor).toFixed(2).replace('.', ',');
}

function obterStatusBadge(status) {
    const badges = {
        'ATIVA': 'badge-ativo',
        'APROVADO': 'badge-aprovado',
        'RECUSADO': 'badge-recusado',
        'PENDENTE': 'badge-pendente',
        'EM_REVISAO': 'badge-revisao',
        'PAGO': 'badge-pago',
        'CANCELADO': 'badge-cancelado',
        'BLOQUEADO': 'badge-bloqueado',
    };

    return badges[status] || 'badge-pendente';
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Configurar botão de logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    }

    // Configurar formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('login-error');

            try {
                await login(username, password);
            } catch (error) {
                errorElement.textContent = error.message;
            }
        });
    }
});
