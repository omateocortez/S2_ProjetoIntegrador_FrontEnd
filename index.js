require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
const PORT = process.env.PORT || 3000
const connectDB = require('./config/db')

connectDB()

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use('/utils', express.static(__dirname + '/helpers/utils'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(cookieParser())

// ROTAS
const mainRoute = require('./routes/main')
const projRoute = require('./routes/projetos')
const usersRoute = require('./routes/users')
const noticiasRoute = require('./routes/noticias')
const eventosRoute = require('./routes/eventos')
const adminRoute = require('./routes/admin')

app.use('/', mainRoute)
app.use('/projetos', projRoute)
app.use('/users', usersRoute)
app.use('/Noticias', noticiasRoute)
app.use('/Eventos', eventosRoute)
app.use('/DashAdmin', adminRoute)

app.listen(PORT, ()=>{
    console.log(`Server ligado na porta ${PORT}`)
})