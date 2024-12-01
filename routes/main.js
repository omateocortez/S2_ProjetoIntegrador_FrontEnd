const express = require('express')
const router = express.Router()

const Proj = require('../schemas/Projeto')

const checkTokens = require('../helpers/middleware/auth')

router.get('/', async (req, res) => {
    const data = await Proj.aggregate([{ $sort: {date: -1 }}, { $limit: 3 }])
    res.render('Home', { data })
})

router.get('/Home', (req, res) => {
    res.redirect('/')
})

router.get('/QuemSomos', (req, res) => {
    res.render('QuemSomos')
})

router.get('/pick', (req, res) => {
    res.render('pick')
})

router.get('/Transp', (req, res) => {
    res.render('Transp')
})

router.get('/FAQ', (req, res) => {
    res.render('FAQ')
})

router.get('/loginFunc', (req, res) => {
    res.render('loginFunc')
})

router.get('/loginMem', (req, res) => {
    res.render('loginMem')
})

router.get('/Cadastro', (req, res) => {
    res.render('Cadastro')
})

router.get('/DonatePix', (req, res) => {
    res.render('DonatePix')
})

router.get('/PoliticaDePrivacidade', (req, res) => {
    res.render('PoliticaDePrivacidade')
})

router.get('/Certificacoes', (req, res) => {
    res.render('Certificacoes')
})

router.get('/TermosUso', (req, res) => {
    res.render('TermosUso')
})

router.get('/Inscricao', (req, res) => {
    res.render('Inscricao')
})

router.get('/ReqsInst', (req, res) => {
    res.render('ReqsInst')
})

router.get('/ReqsRes', (req, res) => {
    res.render('ReqsRes')
})

router.get('/auth-info', checkTokens, (req, res) => {
    if (req.user.isFunc){
        return res.status(200).json({ok: true, isFunc: true, mensagem: 'Usuário logado e tem permissão.'})
    }else{
        return res.status(200).json({ok: true, isFunc: false, mensagem: "Usuário logado, mas sem permissão."})
    }   
})

module.exports = router