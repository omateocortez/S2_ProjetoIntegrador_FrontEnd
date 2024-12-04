const express = require('express')
const router = express.Router()

const mailer = require('../helpers/middleware/mailer')

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

router.get('/FormInst', (req, res) => {
    res.render('FormInst')
})

router.get('/FormRes', (req, res) => {
    res.render('FormRes')
})

router.get('/FormVolunt', (req, res) => {
    res.render('FormVolunt')
})

router.get('/auth-info', checkTokens, (req, res) => {
    if (req.user.isFunc){
        return res.status(200).json({ok: true, isFunc: true, mensagem: 'Usuário logado e tem permissão.'})
    }else{
        return res.status(200).json({ok: true, isFunc: false, mensagem: "Usuário logado, mas sem permissão."})
    }   
})

router.post('/sendforms', async (req, res) => {
    try{
        await mailer.enviarEmailFuncionarios(req.body.html, req.body.assunto)
        return res.status(200).json({ ok:true, mensagem: 'Formulário enviado com sucesso.' })
    } catch(err){
        console.log(err)
        return res.status(500).json({ ok:false, mensagem: 'Erro ao enviar Formulário. Tente novamente mais tarde.'})
    }
})

module.exports = router