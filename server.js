const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs'); // Ferramenta de criptografia
const jwt = require('jsonwebtoken'); // Criador do "crachá" de acesso
const http = require('http'); // Adicionado para o motor do chat
const { Server } = require('socket.io'); // Adicionado para o motor do chat

const app = express();
// Atualizado para pegar a porta da internet ou a 3000 no PC
const PORT = process.env.PORT || 3000; 
const SECRET_KEY = "nexora_chave_super_secreta_2026"; // Chave de segurança do servidor

// Conectando o servidor HTTP e o WebSocket (Chat) ao nosso App
const server = http.createServer(app);
const io = new Server(server);

app.use(cors()); 
app.use(express.json()); 

// ---------------------------------------------------------
// FORÇANDO O SERVIDOR A LER A PASTA CORRETAMENTE
// ---------------------------------------------------------
app.use(express.static(path.join(__dirname)));

// CONEXÃO COM O BANCO
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error(err.message);
  else console.log('📦 Banco de dados conectado!');
});

db.run(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT,
    patrimonio REAL DEFAULT 0
  )
`);

// ---------------------------------------------------------
// ROTA 1: CADASTRAR NOVO CLIENTE
// ---------------------------------------------------------
app.post('/api/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  
  try {
    // Transforma a senha real em um código criptografado
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    
    // Salva no banco de dados
    db.run(`INSERT INTO clientes (nome, email, senha) VALUES (?, ?, ?)`, 
      [nome, email, senhaCriptografada], 
      function(err) {
        if (err) {
          // Se der erro, provavelmente o e-mail já existe
          return res.status(400).json({ erro: 'Este e-mail já está cadastrado.' });
        }
        res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso!' });
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

// ---------------------------------------------------------
// ROTA 2: FAZER LOGIN
// ---------------------------------------------------------
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  
  // Procura o cliente pelo e-mail
  db.get(`SELECT * FROM clientes WHERE email = ?`, [email], async (err, cliente) => {
    if (err || !cliente) {
      return res.status(400).json({ erro: 'E-mail ou senha incorretos.' });
    }
    
    // Compara a senha que ele digitou agora com a senha criptografada do banco
    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) {
      return res.status(400).json({ erro: 'E-mail ou senha incorretos.' });
    }

    // Se passou, cria o "Crachá" (Token) válido por 2 horas
    const token = jwt.sign({ id: cliente.id, nome: cliente.nome }, SECRET_KEY, { expiresIn: '2h' });
    
    res.json({ 
      mensagem: 'Login aprovado!', 
      token: token, 
      nome: cliente.nome 
    });
  });
});

// ==========================================
// INTELIGÊNCIA DO CHAT (WEB SOCKETS)
// ==========================================
io.on('connection', (socket) => {
  console.log('Novo membro conectado à comunidade.');

  // Quando o servidor recebe uma mensagem de um membro
  socket.on('enviarMensagem', (dados) => {
    // Ele retransmite (emite) essa mensagem para TODOS os membros online
    io.emit('receberMensagem', dados);
  });

  socket.on('disconnect', () => {
    console.log('Membro saiu da comunidade.');
  });
});

// ---------------------------------------------------------
// ---------------------------------------------------------
// ROTA CORINGA: QUALQUER LINK VAI PARA O INDEX
// (Precisa ficar no final de tudo!)
// ---------------------------------------------------------
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ---------------------------------------------------------
// LIGANDO O SERVIDOR
// ---------------------------------------------------------
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor Nexora e Chat online na porta ${PORT}!`);
});
