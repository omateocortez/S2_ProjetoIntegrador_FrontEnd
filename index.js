require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000
const connectDB = require('./db')

connectDB()

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors());

// ROTAS
const mainRoute = require('./routes/main')
const projRoute = require('./routes/projetos')
const usersRoute = require('./routes/users')

app.use('/', mainRoute)
app.use('/projetos', projRoute)
app.use('/users', usersRoute)

app.listen(PORT, ()=>{
    console.log(`Server ligado na porta ${PORT}`)
})