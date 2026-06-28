// ==========================================
// VALIDAÇÃO DE LOGIN E CARREGAMENTO DO NOME
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('nexora_token');
  const nomeCliente = localStorage.getItem('nexora_cliente_nome');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  if (nomeCliente) {
    const primeiroNome = nomeCliente.split(' ')[0];
    const boasVindasElement = document.getElementById('boasVindas');
    const avatarElement = document.getElementById('avatarInicial');
    
    if (boasVindasElement) boasVindasElement.innerText = `Bem-vindo de volta, ${primeiroNome}.`;
    if (avatarElement) avatarElement.innerText = primeiroNome.charAt(0).toUpperCase();
  }
});

function fazerLogout() {
  localStorage.removeItem('nexora_token');
  localStorage.removeItem('nexora_cliente_nome');
  window.location.href = 'login.html';
}

// ==========================================
// NAVEGAÇÃO DE ABAS
// ==========================================
function switchTab(tabId, menuElement = null) {
  const views = document.querySelectorAll('.portal-view');
  views.forEach(view => view.classList.remove('active'));

  const targetView = document.getElementById(tabId);
  if (targetView) targetView.classList.add('active');

  if (menuElement) {
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    menuElement.classList.add('active');
  }

  const subtitle = document.getElementById('header-subtitle');
  if (subtitle) {
    if(tabId === 'view-dashboard') subtitle.innerText = "Aqui está o resumo estratégico da sua vida financeira hoje.";
    if(tabId === 'view-paineis') subtitle.innerText = "Monitoramento profundo do seu patrimônio.";
    if(tabId === 'view-comunidade') subtitle.innerText = "Conecte-se com outros membros da Nexora.";
    if(tabId === 'view-ferramentas') subtitle.innerText = "Ferramentas práticas para inteligência financeira.";
    if(tabId === 'view-organizacao') subtitle.innerText = "Sua central de gestão e controle de fluxo.";
  }
  
  if(window.innerWidth <= 1024) {
    const sidebar = document.getElementById('portalSidebar');
    if (sidebar) sidebar.classList.remove('open');
  }
}

function openTool(toolId) {
  document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
  switchTab(toolId);
}

// ==========================================
// LÓGICA DAS FERRAMENTAS
// ==========================================
function calcularReserva() {
  const custo = parseFloat(document.getElementById('res-custo').value);
  const meses = parseInt(document.getElementById('res-meses').value);
  const box = document.getElementById('res-resultado');

  if (!custo || isNaN(custo) || custo <= 0) return alert("Insira um custo válido.");

  const total = custo * meses;
  document.getElementById('res-valor').innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  box.style.display = 'block';
}

function simularDecisao() {
  const valorCompra = parseFloat(document.getElementById('dec-valor').value);
  const renda = parseFloat(document.getElementById('dec-renda').value);
  const tipo = document.getElementById('dec-tipo').value;
  const box = document.getElementById('dec-resultado');
  
  if (!valorCompra || !renda || isNaN(valorCompra) || isNaN(renda)) return alert("Preencha todos os campos.");

  const percentualRenda = (valorCompra / renda) * 100;
  const statusEl = document.getElementById('dec-status');
  const vereditoEl = document.getElementById('dec-veredito');
  const msgEl = document.getElementById('dec-msg');

  box.style.display = 'block';

  if (tipo === 'necessidade') {
    box.className = 'result-box'; statusEl.style.color = '#4CAF82'; statusEl.innerText = 'Aprovado'; vereditoEl.innerText = 'Pode comprar.'; msgEl.innerText = `Impacto: ${percentualRenda.toFixed(1)}% da renda.`;
  } else {
    if (percentualRenda > 30) {
      box.className = 'result-box error'; statusEl.style.color = '#E05C5C'; statusEl.innerText = 'Alerta de Risco'; vereditoEl.innerText = 'NÃO COMPRE AGORA.'; msgEl.innerText = `Impacto muito alto: ${percentualRenda.toFixed(1)}% da renda.`;
    } else if (percentualRenda > 15) {
      box.className = 'result-box'; statusEl.style.color = '#FEBC2E'; statusEl.innerText = 'Atenção'; vereditoEl.innerText = 'Pense por 48h.'; msgEl.innerText = `Impacto médio: ${percentualRenda.toFixed(1)}% da renda.`;
    } else {
      box.className = 'result-box'; statusEl.style.color = '#4CAF82'; statusEl.innerText = 'Aprovado'; vereditoEl.innerText = 'Compra Saudável.'; msgEl.innerText = `Baixo impacto: apenas ${percentualRenda.toFixed(1)}% da renda.`;
    }
  }
}

function calcularScore() {
  const renda = parseFloat(document.getElementById('sc-renda').value);
  const gastos = parseFloat(document.getElementById('sc-gastos').value);
  const dividas = parseFloat(document.getElementById('sc-dividas').value) || 0;
  const box = document.getElementById('sc-resultado');

  if (!renda || !gastos || isNaN(renda) || isNaN(gastos)) return alert("Preencha renda e gastos.");

  let score = 100;
  const comprometimento = (gastos / renda) * 100;

  if (comprometimento > 90) score -= 60;
  else if (comprometimento > 70) score -= 30;
  else if (comprometimento > 50) score -= 10;

  if (dividas > 0) score -= 40;

  score = Math.max(0, score); 

  const msgEl = document.getElementById('sc-msg');
  if (score >= 80) msgEl.innerText = "Excelente! Suas finanças estão sob controle absoluto.";
  else if (score >= 50) msgEl.innerText = "Atenção. Você está no limite, precisa reduzir os custos fixos.";
  else msgEl.innerText = "Sinal Vermelho. Risco alto de colapso financeiro.";

  document.getElementById('sc-valor').innerText = score + " / 100";
  box.style.display = 'block';
}

function calcularMeta() {
  const alvo = parseFloat(document.getElementById('mt-alvo').value);
  const atual = parseFloat(document.getElementById('mt-atual').value) || 0;
  const aporte = parseFloat(document.getElementById('mt-aporte').value);
  const box = document.getElementById('mt-resultado');

  if (!alvo || !aporte || isNaN(alvo) || isNaN(aporte)) return alert("Preencha o alvo e o aporte mensal.");
  if (atual >= alvo) return alert("Parabéns! Você já atingiu essa meta.");

  const falta = alvo - atual;
  const meses = Math.ceil(falta / aporte);
  const anos = (meses / 12).toFixed(1);

  document.getElementById('mt-meses').innerText = meses + (meses === 1 ? " Mês" : " Meses");
  document.getElementById('mt-anos').innerText = `Isso equivale a aproximadamente ${anos} anos de investimentos consistentes.`;
  box.style.display = 'block';
}

function calcularDivida() {
  const valor = parseFloat(document.getElementById('dv-valor').value);
  const parcela = parseFloat(document.getElementById('dv-parcela').value);
  const box = document.getElementById('dv-resultado');

  if (!valor || !parcela || isNaN(valor) || isNaN(parcela)) return alert("Preencha o valor e a parcela.");
  
  const meses = Math.ceil(valor / parcela);

  document.getElementById('dv-meses').innerText = meses + (meses === 1 ? " Mês" : " Meses");
  box.style.display = 'block';
}

// ==========================================
// CHAT AO VIVO
// ==========================================
const tokenSeguranca = localStorage.getItem('nexora_token');

// Só roda o código do chat se a biblioteca do socket estiver disponível
if (tokenSeguranca && typeof io !== 'undefined') {
  const socket = io();

  function enviarProChat() {
    const input = document.getElementById('input-chat');
    const texto = input.value.trim();
    const nomeCliente = localStorage.getItem('nexora_cliente_nome') || 'Membro Anônimo';
    
    const horaReal = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    if (texto !== '') {
      socket.emit('enviarMensagem', { nome: nomeCliente, texto: texto, hora: horaReal });
      input.value = ''; 
    }
  }

  function verificarEnter(event) {
    if (event.key === 'Enter') enviarProChat();
  }

  socket.on('receberMensagem', (dados) => {
    const box = document.getElementById('box-mensagens');
    const nomeLocal = localStorage.getItem('nexora_cliente_nome') || 'Membro Anônimo';
    const ehMinha = dados.nome === nomeLocal;

    const inicial = dados.nome.charAt(0).toUpperCase();

    const wrapper = document.createElement('div');
    wrapper.className = `msg-wrapper ${ehMinha ? 'mine' : 'other'}`;

    wrapper.innerHTML = `
      <div class="msg-avatar">${inicial}</div>
      <div class="msg-content">
        <div class="msg-header">
          <span class="msg-name">${ehMinha ? 'Você' : dados.nome}</span>
          <span class="msg-time">${dados.hora || ''}</span>
        </div>
        <div class="msg-bubble">${dados.texto}</div>
      </div>
    `;

    box.appendChild(wrapper);
    box.scrollTop = box.scrollHeight; 
  });
}