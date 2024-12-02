const express = require('express')
const router = express.Router()

const User = require('../schemas/Usuario')

const bcrypt = require('bcrypt')

const { generateAcessToken, generateRefreshToken } = require('../helpers/middleware/genTokens')

const checkTokens = require('../helpers/middleware/auth')

router.get('/me', checkTokens, async (req, res) => {

    const user = await User.findById(req.user.id)

    data = {
        id: user.id,
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
        isFunc: user.funcionario,
        recebeForms: user.recebeForms
    }
    res.render('SuaConta', data)
})

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

router.post('/signup-func', checkTokens, async (req, res) =>{

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
        
        res.redirect(302, '/DashAdmin')
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

router.post('/logout', async(req, res) =>{
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(200).json({ ok:true, mensagem: 'Log-out realizado com sucesso.'})
})

router.post('/delete/:id', checkTokens, async (req, res) =>{
    const userId = req.params.id 

    if(!req.user.isFunc && req.params.id != req.user.id){
        return res.status(403).json({ok: false, mensagem: 'Usuário não autorizado'})
    }

    try{
        await User.findByIdAndDelete(userId)
        res.status(200).json({ok: true, mensagem: 'Usuário deletado com sucesso.'})
    }catch(err){
        console.error(err)
        res.status(403).json({ok: false, mensagem: 'Erro ao deletar usuário.'})
    }
})

router.post('/update/:id', checkTokens, async(req, res) =>{
    const user_id = req.params.id

    if(!req.user.isFunc && req.params.id != req.user.id){
        return res.status(403).json({ok: false, mensagem: 'Usuário não autorizado'})
    }
    
    try{
        const user = await User.findById(user_id)

        if(!user){
            return res.status(404).json({ok: false, mensagem: 'Usuário não encontrado'})
        }

        const nome = req.body.nome ? req.body.nome : user.nome
        const sobrenome = req.body.sobrenome ? req.body.sobrenome : user.sobrenome
        const email = req.body.email ? req.body.email : user.email
        let funcionario = false
        if(req.user.isFunc){
            funcionario = req.body.funcionario
        }
        const recebeForms = req.body.recebeForms

        if(req.body.nova_senha){
            const criptografada = await bcrypt.hash(req.body.nova_senha, 10)

            await User.findByIdAndUpdate(user_id, {nome: nome, sobrenome: sobrenome, email: email, senha: criptografada, funcionario: funcionario, recebeForms: recebeForms}, {
                new: true,
                runValidators: true
            })
        }else{
            await User.findByIdAndUpdate(user_id, {nome: nome, sobrenome: sobrenome, email: email, funcionario: funcionario, recebeForms: recebeForms}, {
                new: true,
                runValidators: true
            })
        }
        res.status(200).json({ok: true, mensagem: 'Usuário atualizado com sucesso.'})

    } catch(err){
        console.error(err)
        res.status(403).json({ok: false, mensagem: 'Erro ao atualizar usuário.'})
    }
})

module.exports = router