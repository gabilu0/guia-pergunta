const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

// database
connection
    .authenticate()
    .then(() => {
        console.log('Conectado com sucesso')
    }).catch(error => console.log(error))

//Utilizando EJS como view engine
app.set('view engine', 'ejs')
app.use(express.static('public'))

// body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Routes
app.get('/', (request, response) => {
    Pergunta.findAll({ 
        raw: true, 
        order:[['id','DESC']] //Ordenando em ordem decrescente 
    })
    .then(perguntas =>{
        response.render('index', {
            perguntas: perguntas
        })
    })
})

app.get('/perguntar', (request, response) => {
    response.render('perguntar')
})

app.post('/savequestions', (request, response) => {
    let title = request.body.titulo
    let description = request.body.descricao

    Pergunta.create({
        titulo: title,
        descricao: description
    })
    .then(() => response.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/pergunta/:id', (request, response) => {
    let id = request.params.id

    Pergunta.findOne({
        where: {id: id}
    })
    .then(pergunta => {
        if(pergunta != undefined) {
            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order:[
                 ['id', 'DESC']   
                ]
            })
            .then(respostas => {
                response.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        } else {
            response.redirect('/')
        }
    })
})

app.post('/responder', (request, response) => {
    let corpo = request.body.corpo
    let perguntaId = request.body.pergunta

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => response.redirect(`/pergunta/${perguntaId}`))
    .catch(error => console.log(error))
})

//Server
app.listen(3000, () => {
    console.log('Server conectado')
})