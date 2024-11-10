const express = require('express')
const router = express.Router()

const Proj = require('../schemas/Projeto')

const upload = require('../config/multer')

const fs = require('fs')
const path = require('path')

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

    const projeto = await Proj.findById(projectId)

    console.log(projeto.images)

    projeto.images.forEach(imgPath => {

        const filePath = path.resolve(__dirname, '..', 'public', imgPath)

        fs.unlink(filePath, (err) => {
            if(err){
                console.error(`erro ao deletar imagem!\nfile path: ${filePath}`, err)
            }else{
                console.log(`imagem deltada com sucesso.\nfile path: ${filePath}`)
            }
        })
    })

    await Proj.findByIdAndDelete(projectId)
    
    res.redirect(req.baseUrl)
})

router.post('/update/:id', upload, async (req, res)=>{

    const projectId = req.params.id;
    const titulo = req.body.title
    const descr = req.body.desc

    let proj_date

    if(req.body.date){
        proj_date = new Date(req.body.date)
        proj_date.setDate(proj_date.getDate() + 1)
    }else{
        proj_date = Proj.findById(projectId).date
    }

    let imgs = []

    if(req.files && req.files.length > 0){
        imgs = req.files.map(file => `imgs/uploads/${file.filename}`)
    }else{
        imgs = Proj.findById(projectId).images
    }

    await Proj.findByIdAndUpdate(projectId, {title: titulo, desc: descr, images: imgs, date: proj_date}, {
        new: true,
        runValidators: true
    }) 

    res.redirect(req.baseUrl)
})

router.post('/upload', upload, async (req, res)=>{

    const titulo = req.body.title
    const descr = req.body.desc
    const imgs = req.files.map(file => `imgs/uploads/${file.filename}`)

    let proj_date = Date.now()

    if(req.body.date){
        proj_date = new Date(req.body.date)
        proj_date.setDate(proj_date.getDate() + 1)
    }

    const projeto = new Proj({title: titulo, desc: descr, images: imgs, date: proj_date}) 

    await projeto.save()
    res.redirect(req.baseUrl)
})

module.exports = router