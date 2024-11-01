const express = require('express')
const router = express.Router()

const Proj = require('../schemas/Projeto')

router.get('/', async (req, res) => {
    try{
        const data = await Proj.aggregate([{ $sort: {date: -1 }}])
        res.render('projetos', { data });
    }catch(error){
        console.log(`erro: ${error}`)
    }
})

module.exports = router