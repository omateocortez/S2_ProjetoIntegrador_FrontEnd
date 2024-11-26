const express = require('express')
const router = express.Router()

const checkTokens = require('../helpers/middleware/auth')

const User = require('../schemas/Usuario')

const getUserList = async (sortBy, orderBy) => {
    try {
        const sortOrder = orderBy === 'cresc' ? 1 : -1

        return await User.aggregate([
            { $project: { senha: 0 } },
            { $addFields: { normalizedSort: { $toLower: `$${sortBy}` }}}, // o mongo considera que letras maiusculas vem antes das minusculas no alfabeto entao F viria antes de a, portanto temos que normalizar.
            { $sort: { normalizedSort: sortOrder } }
        ])
    } catch (error) {
        throw new Error("Erro ao adquirir informações de usuários.");
    }
}   

router.get('/', checkTokens, async (req, res) => {
    const sortByField = 'nome'
    const orderBy = 'cresc' 

    if(req.user.isFunc){
        try{
            const userList = await getUserList(sortByField, orderBy)
            res.render('DashAdmin', { userList, sortBy: sortByField, orderBy: orderBy })
        }catch{
            res.status(500).json({ ok: false, mensagem: "Erro ao adquirir informações de usuários." })
        }
    }else{
        res.status(401).json({ok: false, mensagem: "Acesso negado."})
    }
})

router.post('/', checkTokens, async (req, res) => {
    if(req.user.isFunc){
        try{
            const sortByField = req.body.sortBy ? req.body.sortBy : 'nome'
            const orderBy = req.body.orderBy || 'cresc';

            const userList = await getUserList(sortByField, orderBy)

            res.render('DashAdmin', { userList, sortBy: sortByField, orderBy: orderBy })
        }catch(err){
            console.log(err)
            res.status(500).json({ ok: false, mensagem: "Erro ao adquirir informações de usuários." })
        }
    }else{
        res.status(401).json({ok: false, mensagem: "Acesso negado."})
    }
})

module.exports = router