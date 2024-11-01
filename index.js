const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.render('Home');
})
app.get('/Home', (req, res) => {
    res.redirect('/');
})
app.get('/projetos', (req, res) => {
    res.render('projetos');
})
app.get('/NossaHistoria', (req, res) => {
    res.render('NossaHistoria');
})
app.get('/pick', (req, res) => {
    res.render('pick');
})
app.get('/loginFunc', (req, res) => {
    res.render('loginFunc');
})
app.get('/loginMem', (req, res) => {
    res.render('loginMem');
})
app.get('/ImpacTransp', (req, res) => {
    res.render('ImpacTransp');
})

app.listen(PORT, ()=>{
    console.log(`Server ligado na porta ${PORT}`)
})