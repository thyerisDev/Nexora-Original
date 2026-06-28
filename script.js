// ── NAV SCROLL ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) { 
    if (window.scrollY > 50) {
      nav.style.padding = '0.8rem 4rem';
    } else {
      nav.style.padding = '1.2rem 4rem';
    }
  }
});

// ── HAMBURGER ──
const hamburgerBtn = document.getElementById('hamburger');
if (hamburgerBtn) { 
  hamburgerBtn.addEventListener('click', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) mobileMenu.classList.toggle('open');
  });
}

function closeMobile() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) mobileMenu.classList.remove('open');
}

// ── TABS DA PÁGINA PRINCIPAL ──
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  
  const targetTab = document.getElementById('tab-' + tab);
  if (targetTab) targetTab.classList.add('active');
  
  if (event && event.target && event.target.classList) {
    event.target.classList.add('active');
  }
}

// ── FAQ ──
function toggleFaq(el) {
  el.classList.toggle('open');
}

// ── REVEAL ON SCROLL ──
const reveals = document.querySelectorAll('.reveal');
if (reveals.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
}

// ── PROGRESS BARS ──
const aboutCards = document.querySelectorAll('.about-card-main');
if (aboutCards.length > 0) {
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.progress-fill');
        fills.forEach(fill => {
          const w = fill.style.width;
          fill.style.width = '0%';
          setTimeout(() => { fill.style.width = w; }, 300);
        });
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  aboutCards.forEach(el => progressObserver.observe(el));
}

// ── FORM SUBMIT ──
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button') || e.target;
  const textoOriginal = btn.textContent;
  btn.textContent = '✓ Mensagem Enviada!';
  btn.style.background = '#4CAF82';
  btn.style.borderColor = '#4CAF82';
  setTimeout(() => {
    btn.textContent = textoOriginal;
    btn.style.background = '';
    btn.style.borderColor = '';
  }, 3000);
}

// ── SMOOTH ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]');
if (sections.length > 0) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--text)' : '';
    });
  });
}

// Mobile nav padding fix
window.addEventListener('resize', () => {
  const nav = document.getElementById('navbar');
  if (nav && window.innerWidth <= 1024) {
    nav.style.padding = '';
  }
});


// ========================================================
//   LÓGICA DA TELA DE LOGIN / CADASTRO E INTEGRAÇÃO API
// ========================================================

function toggleForms() {
  const formLogin = document.getElementById('formLogin');
  const formCadastro = document.getElementById('formCadastro');
  const msgBox = document.getElementById('mensagem');
  
  if(formLogin && formCadastro) {
    formLogin.classList.toggle('hidden');
    formCadastro.classList.toggle('hidden');
    if(msgBox) msgBox.style.display = 'none';
    document.querySelectorAll('.auth-form-area input').forEach(input => input.value = '');
  }
}

function mostrarMensagem(texto, tipo) {
  const msgBox = document.getElementById('mensagem');
  if(msgBox) {
    msgBox.textContent = texto;
    msgBox.className = `msg-box msg-${tipo}`;
    msgBox.style.display = 'block';
  }
}

async function fazerCadastro(e) {
  e.preventDefault();
  const nome = document.getElementById('cadNome').value;
  const email = document.getElementById('cadEmail').value;
  const senha = document.getElementById('cadSenha').value;

  try {
    const response = await fetch('/api/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      mostrarMensagem("Conta criada com sucesso! Faça seu login.", 'success');
      setTimeout(toggleForms, 1500); 
    } else {
      mostrarMensagem(data.erro, 'error');
    }
  } catch (error) {
    mostrarMensagem('Erro de conexão com o servidor. Verifique se o Node está rodando.', 'error');
  }
}

async function fazerLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('nexora_token', data.token);
      localStorage.setItem('nexora_cliente_nome', data.nome);
      window.location.href = '/portal.html';
    } else {
      mostrarMensagem(data.erro, 'error');
    }
  } catch (error) {
    mostrarMensagem('Erro de conexão com o servidor.', 'error');
  }
}