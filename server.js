const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const app = express();
const port = 3001;

// Caminho base para os arquivos HTML e db.json
const basePath = path.join(__dirname, 'public'); // Ajuste o caminho conforme necessário
const dbPath = path.join(__dirname, 'db.json'); // Ajuste o caminho conforme necessário

// Parser de conversão de texto
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração da sessão
app.use(session({
  secret: '0987654321',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 120000 } // Tempo de expiração em milissegundos
}));

// Configurações de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Rota para servir o arquivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(basePath, 'index.html'));
});

// Rota para servir o formulário de novo usuário
app.get('/users/add', (req, res) => {
  res.sendFile(path.join(basePath, 'newUser.html'));
});

// Rota para salvar o novo usuário
app.post('/users/save', (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).send('Nome e idade são obrigatórios');
  }

  // Adicionar o usuário ao arquivo db.json
  adicionarUsuario(name, age)
    .then(() => res.redirect('/users/add'))
    .catch(err => res.status(500).send(`Erro ao salvar usuário: ${err.message}`));
});

// Inicializar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Função para adicionar usuário ao db.json
async function adicionarUsuario(name, age) {
  try {
    // Ler o conteúdo atual do db.json
    let data = fs.readFileSync(dbPath, 'utf-8');
    let db = JSON.parse(data);

    // Adicionar o novo usuário
    const newId = (Math.random() + 1).toString(36).substring(7); // Gera um ID único para o novo usuário
    db.posts = db.posts || []; // Certifique-se de que 'posts' existe
    db.posts.push({ id: newId, name, age });

    // Escrever o conteúdo atualizado no db.json
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    throw error;
  }
}