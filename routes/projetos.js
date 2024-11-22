const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

const Proj = require('../schemas/Projeto')

const upload = require('../helpers/middleware/multer')

const checkTokens = require('../helpers/middleware/auth')

const fs = require('fs')
const path = require('path')

router.get('/', async (req, res) => {
    try{
        const data = await Proj.aggregate([{ $sort: {date: -1 }}])

        const proj_edit = req.query.proj_edit ? await Proj.findById(req.query.proj_edit) : undefined

        res.render('projetos', { data, proj_edit})
    }catch(error){
        console.log(`erro: ${error}`)
    }
})

// BAND-AID OOOPSSSSSS...
router.get('/Home', async (req, res) => {
    res.redirect(`${req.protocol}://${req.get('host')}/`)
})

router.get('/:id', async (req, res) => {
    try{
        const proj = await Proj.findById(req.params.id)

        var paragrafos = proj.desc.split('\n')

        res.render('projetoGenerico', { proj, paragrafos })
    }catch(err){
        console.log(`Erro: ${err}`)
    }

})


router.get('/edit/:id', async(req, res) => {
    let slug = req.params.id
    if (!mongoose.Types.ObjectId.isValid(slug)) {
        return res.status(400).send('ID inválido');
    }
    res.redirect(`/projetos/?proj_edit=${slug}`)
})

router.post('/delete/:id', checkTokens, async (req, res)=>{
    if(!req.user.isFunc){
        return res.status(403).json({ok: false, mensagem: 'Usuário não autorizado'})
    }

    const projectId = req.params.id
    try{
        const projeto = await Proj.findById(projectId)

        console.log(projeto.images)

        projeto.images.forEach(imgPath => {

            const filePath = path.resolve(__dirname, '..', 'public', imgPath)

            fs.unlink(filePath, (err) => {
                if(err){
                    console.error(`Erro ao deletar imagem!\nfile path: ${filePath}`, err)
                }else{
                    console.log(`Imagem deltada com sucesso.\nfile path: ${filePath}`)
                }
            })
        })

        await Proj.findByIdAndDelete(projectId)
        
        res.status(200).json({ok: true, mensagem: 'Projeto deletado com sucesso.'})
    }catch(err){
        console.error(err)
        res.status(403).json({ok: false, mensagem: 'Erro ao deletar projeto.'})
    }
})

router.post('/update/:id', checkTokens, upload, async (req, res)=>{
    if(!req.user.isFunc){
        return res.status(403).json({ok: false, mensagem: 'Usuário não autorizado'})
    }

    const projectId = req.params.id
    const titulo = req.body.title
    const descr = req.body.desc

    const editor_email = req.user.email
    
    try{
        const projeto = await Proj.findById(projectId)
        let creator_email = projeto.creator_email

        let delete_old_imgs = false
        let old_images = projeto.images

        let proj_date

        if(req.body.date){
            proj_date = new Date(req.body.date)
            proj_date.setDate(proj_date.getDate() + 1)
        }else{
            proj_date = projeto.date
        }

        let imgs = []

        if(req.files && req.files.length > 0){
            delete_old_imgs = true
            imgs = req.files.map(file => `imgs/uploads/${file.filename}`)

        }else{
            imgs = old_images
        }

        await Proj.findByIdAndUpdate(projectId, {title: titulo, desc: descr, images: imgs, date: proj_date, creator_email: creator_email, last_editor_email: editor_email}, {
            new: true,
            runValidators: true
        }) 

        if(delete_old_imgs){
            old_images.forEach(imgPath => {

                const filePath = path.resolve(__dirname, '..', 'public', imgPath)

                fs.unlink(filePath, (err) => {
                    if(err){
                        console.error(`Erro ao deletar imagem!\nfile path: ${filePath}`, err)
                    }else{
                        console.log(`Imagem deltada com sucesso.\nfile path: ${filePath}`)
                    }
                })
            })
        }

        res.status(200).json({ok: true, mensagem: 'Projeto atualizado com sucesso.'})

    }catch(err){
        console.log(err)
        res.status(403).json({ok: false, mensagem: 'Erro ao atualizar projeto.'})
    }
})

router.post('/upload', checkTokens, upload, async (req, res)=>{
    if(!req.user.isFunc){
        return res.status(403).json({ok: false, mensagem: 'Usuário não autorizado'})
    }

    try{
        const titulo = req.body.title
        const descr = req.body.desc
        const imgs = req.files.map(file => `imgs/uploads/${file.filename}`)
        const creator = req.user.email

        let proj_date = Date.now()

        if(req.body.date){
            proj_date = new Date(req.body.date)
            proj_date.setDate(proj_date.getDate() + 1)
        }

        const projeto = new Proj({title: titulo, desc: descr, images: imgs, date: proj_date, creator_email: creator, last_editor_email: creator}) 

        console.log(projeto)

        await projeto.save()

        res.status(201).json({ok: true, mensagem:'Projeto criado com sucesso.'})
    }catch{
        res.status(403).json({ok: false, mensagem: 'Erro ao criar projeto.'})
    }
})

module.exports = router