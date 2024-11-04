require('dotenv').config();

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

const connectDB = require('./db')

connectDB()

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.json())

// ROTAS
const mainRoute = require('./routes/main')
const projRoute = require('./routes/projetos')

app.use('/', mainRoute)
app.use('/projetos', projRoute)

app.listen(PORT, ()=>{
    console.log(`Server ligado na porta ${PORT}`)
})