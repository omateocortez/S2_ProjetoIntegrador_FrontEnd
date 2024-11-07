const express = require('express')
const router = express.Router()

const Proj = require('../schemas/Projeto')

const upload = require('../config/multer')

router.get('/', async (req, res) => {
    try{
        const data = await Proj.aggregate([{ $sort: {date: -1 }}])

        const proj_edit = req.query.proj_edit ? await Proj.findById(req.query.proj_edit) : undefined;

        res.render('projetos', { data, proj_edit });
    }catch(error){
        console.log(`erro: ${error}`)
    }
})

// BAND-AID OOOPSSSSSS...
router.get('/Home', async (req, res) => {
    res.redirect(`${req.protocol}://${req.get('host')}/`)
})


router.get('/edit/:id', async(req, res) => {
    let slug = req.params.id
    res.redirect(`/projetos/?proj_edit=${slug}`)
})

router.post('/delete/:id', async (req, res)=>{
    
    const projectId = req.params.id;

    await Proj.findByIdAndDelete(projectId)
    
    res.redirect(req.baseUrl)
})

router.post('/update/:id', upload, async (req, res)=>{

    const projectId = req.params.id;
    const titulo = req.body.title
    const descr = req.body.desc
    if(req.file){
        const src = `imgs/uploads/${req.file.filename}`
    }else{
        src = Proj.findById(projectId).imgsrc
    }

    await Proj.findByIdAndUpdate(projectId, {title: titulo, desc: descr, imgsrc: src}, {
        new: true,
        runValidators: true
    }) 

    res.redirect(req.baseUrl)
})

router.post('/upload', upload, async (req, res)=>{

    const titulo = req.body.title
    const descr = req.body.desc
    const src = `imgs/uploads/${req.file.filename}`

    const projeto = new Proj({title: titulo, desc: descr, imgsrc: src}) 

    await projeto.save()
    res.redirect(req.baseUrl)
})

module.exports = router