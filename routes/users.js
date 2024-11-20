const express = require('express')
const router = express.Router()

const User = require('../schemas/Usuario')

const bcrypt = require('bcrypt')

const { generateAcessToken, generateRefreshToken } = require('../helpers/middleware/genTokens')

const checkPerms = require('../helpers/middleware/auth')

router.post('/signup', async (req, res) =>{

    try{
        const nome = req.body.nome
        const sobrenome = req.body.sobrenome
        const email = req.body.email
        const senha = req.body.senha

        const emailUsado = await User.findOne({ email });
        if (emailUsado) {
            console.log('Tentativa de cadastro falha, o email usado já existe.')
            return res.status(409).json({ ok:false, mensagem: 'Já existe um cadastro com este e-mail!' });
        }

        const criptografada = await bcrypt.hash(senha, 10)

        const usuario = new User({
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            senha: criptografada
        })

        const respMongo = await usuario.save()

        console.log(respMongo)
        
        res.redirect(302, '/LoginMem').json({ok:true, mensagem:'Funcionário cadastrado com sucesso!'})
    }catch(err){
        console.error(err)
        res.status(500).end()
    }
})

router.post('/signup-func', checkPerms, async (req, res) =>{

    if(!req.user.isFunc){
        return res.status(403).json({ok: false, mensagem: 'Usuário não autorizado!'})
    }

    try{
        const nome = req.body.nome
        const sobrenome = req.body.sobrenome
        const email = req.body.email
        const senha = req.body.senha
        const funcionario = req.body.funcionario

        const emailUsado = await User.findOne({ email });
        if (emailUsado) {
            console.log('Tentativa de cadastro falha, o email usado já existe.')
            return res.status(409).json({ ok:false, mensagem: 'Já existe um cadastro com este e-mail!' });
        }

        const criptografada = await bcrypt.hash(senha, 10)

        const usuario = new User({
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            senha: criptografada,
            funcionario: funcionario
        })

        const respMongo = await usuario.save()

        console.log(respMongo)
        
        res.redirect(302, '/Cadastro')
    }catch(err){
        console.error(err)
        res.status(500).end()
    }
})

router.post('/login', async(req, res) =>{

    const email = req.body.email
    const senha = req.body.senha

    console.log(req.body)
    
    const user = await User.findOne({email: email})

    if(!user){
        return res.status(401).json({ok:false, mensagem: "E-mail não encontrado."})
    }

    const senhaValida = await bcrypt.compare(senha, user.senha)
    if (!senhaValida){
        return res.status(401).json({ok:false, mensagem: "Senha incorreta."})
    }

    const accessToken = generateAcessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 100, //7 dias
        sameSite: 'Strict'
    })
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000, //15 min
        sameSite: 'Lax'
    })

    res.status(200).json({ ok: true, mensagem: "Log-in OK" })
})

router.post('/logout', async(req, res) => {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(200).json({ ok:true, mensagem: 'Log-out realizado com sucesso.'})
})

module.exports = router