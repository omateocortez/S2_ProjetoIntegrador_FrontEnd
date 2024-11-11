const express = require('express')
const router = express.Router()

const User = require('../schemas/Usuario')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/signup', async (req, res) =>{

    try{
        const nome = req.body.nome
        const sobrenome = req.body.sobrenome
        const email = req.body.email
        const senha = req.body.senha

        const emailUsado = await User.findOne({ email });
        if (emailUsado) {
            console.log('Tentativa de cadastro falha, o email usado já existe.')
            return res.status(409).json({ error: 'Já existe um cadastro com este e-mail!' });
        }

        const criptografada = await bcrypt.hash(senha, 10)

        const usuario = new User({
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            senha: criptografada,
        })

        const respMongo = await usuario.save()

        console.log(respMongo)
        
        res.redirect(302, '/LoginMem')
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
        return res.status(401).json({mensagem: "E-mail não encontrado."})
    }

    const senhaValida = await bcrypt.compare(senha, user.senha)
    if (!senhaValida){
        return res.status(401).json({mensagem: "Senha incorreta."})
    }

    const token = jwt.sign(
        {
            email: email,
            isFunc: user.funcionario
        },
        process.env.JWT_SECRET,
        {expiresIn:"1h"}
    )

    res.status(200).json({ token, mensagem: "Log-in OK" })
})

module.exports = router