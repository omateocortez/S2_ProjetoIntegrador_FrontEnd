const express = require('express')
const router = express.Router()

const Proj = require('../schemas/Projeto')

const upload = require('../config/multer')

router.get('/', async (req, res) => {
    try{
        const data = await Proj.aggregate([{ $sort: {date: -1 }}])
        res.render('projetos', { data });
    }catch(error){
        console.log(`erro: ${error}`)
    }
})

router.post('/upload', upload, async (req, res)=>{

    const titulo = req.body.title
    const descr = req.body.desc
    const src = `imgs/uploads/${req.file.filename}`

    const projeto = new Proj({title: titulo, desc: descr, imgsrc: src})

    await projeto.save()
    res.redirect((req.get('referer')))
})

module.exports = router