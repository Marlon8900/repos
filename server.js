const express = require('express')
const app = express()
const port = 3001
const path = require('path')


//anexa a pasta templates
const basePath = path.join(__dirname, 'templates')

//parser de consersao de texto
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//index
app.get('/', (req, res) => {
    res.sendFile(`${basePath}/index.html`)
})

//cria novo usuario
app.get('/users/add', (req, res) => {
    res.sendFile(`${basePath}/newUser.html`)
})

//salva dados
app.post('/users/save', (req, res) => {
   adicionarUsuario (req.body.name, req.body.age)
    res.sendFile(`${basePath}/newUser.html`)
})
const date = {name, age}
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})

async function adicionarUsuario(name, age) {
    const url = 'http://localhost:3000/users/save'
  const data = {name, age}
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(date)
    })

    if (response.ok) {
        const result = await response.text()
        console.log(result)
    } else {
        console.error('Erro ao adicionar usuário:', response.statusText)
    }
  } catch (error) {
    console.error('Erro na requisição:', error)
  }
}