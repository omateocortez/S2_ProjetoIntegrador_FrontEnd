const express = require('express')
const router = express.Router()

const Noticia = require('../schemas/Noticia')

const upload = require('../helpers/middleware/multer')

const checkTokens = require('../helpers/middleware/auth')

const fs = require('fs')
const path = require('path')

router.get('/', async (req, res) => {
    try{
        const data = await Noticia.aggregate([{ $sort: {last_update_date: -1 }}])

        const noticia_edit = req.query.noticia_edit ? await Noticia.findById(req.query.noticia_edit) : undefined

        res.render('Noticias', { data, noticia_edit})
    }catch(error){
        console.log(`erro: ${error}`)
    }
})

router.get('/:id', async (req, res) => {
    try{
        const noticia = await Noticia.findById(req.params.id)

        var paragrafos = noticia.noticia_text.split('\n')

        res.render('noticiaGenerica', { noticia, paragrafos })
    }catch(err){
        console.log(`Erro: ${err}`)
    }

})

// BAND-AID OOOPSSSSSS...
router.get('/Home', async (req, res) => {
    res.redirect(`${req.protocol}://${req.get('host')}/`)
})


router.get('/edit/:id', async(req, res) => {
    let slug = req.params.id
    res.redirect(`/noticias/?noticia_edit=${slug}`)
})

router.post('/delete/:id', checkTokens, async (req, res)=>{
    if(!req.user.isFunc){
        return res.status(403).json({ok: false, mensagem: 'Usuário não autorizado'})
    }

    const noticiaId = req.params.id
    try{
        const noticia = await Noticia.findById(noticiaId)

        console.log(noticia.images)

        noticia.images.forEach(imgPath => {

            const filePath = path.resolve(__dirname, '..', 'public', imgPath)

            fs.unlink(filePath, (err) => {
                if(err){
                    console.error(`Erro ao deletar imagem!\nfile path: ${filePath}`, err)
                }else{
                    console.log(`Imagem deltada com sucesso.\nfile path: ${filePath}`)
                }
            })
        })

        await Noticia.findByIdAndDelete(noticiaId)
        
        res.status(200).json({ok: true, mensagem: 'Notícia deletada com sucesso.'})
    }catch(err){
        console.error(err)
        res.status(403).json({ok: false, mensagem: 'Erro ao deletar notícia.'})
    }
})

router.post('/update/:id', checkTokens, upload, async (req, res)=>{
    if(!req.user.isFunc){
        return res.status(403).json({ok: false, mensagem: 'Usuário não autorizado'})
    }

    const noticiaId = req.params.id
    const titulo = req.body.title
    const noticia_text = req.body.noticia_text

    const editor_email = req.user.email
    
    try{
        const noticia = await Noticia.findById(noticiaId)

        let creator_email =  noticia.creator_email


        let upload_date

        if(req.body.upload_date){
            upload_date = new Date(req.body.upload_date)
            upload_date.setDate(upload_date.getDate() + 1)
        }else{
            upload_date = noticia.upload_date
        }

        let delete_old_imgs = false
        let old_images = noticia.images
        
        let imgs = []
        
        if(req.files && req.files.length > 0){
            delete_old_imgs = true
            imgs = req.files.map(file => `imgs/uploads/${file.filename}`)
        }else{
            imgs = old_images
        }

        await Noticia.findByIdAndUpdate(noticiaId, {title: titulo, noticia_text: noticia_text, images: imgs, upload_date: upload_date, creator_email: creator_email, last_editor_email: editor_email}, {
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

        res.status(200).json({ok: true, mensagem: 'Notícia atualizada com sucesso.'})

    }catch(err){
        console.log(err)
        res.status(403).json({ok: false, mensagem: 'Erro ao atualizar noticia.'})
    }
})

router.post('/upload', checkTokens, upload, async (req, res)=>{
    if(!req.user.isFunc){
        return res.status(403).json({ok: false, mensagem: 'Usuário não autorizado'})
    }

    try{
        const titulo = req.body.title
        const noticia_text = req.body.noticia_text
        const imgs = req.files.map(file => `imgs/uploads/${file.filename}`)
        const creator = req.user.email

        let upload_date = Date.now()

        if(req.body.upload_date){
            upload_date = new Date(req.body.upload_date)
            upload_date.setDate(upload_date.getDate() + 1)
        }

        const noticia = new Noticia({title: titulo, noticia_text: noticia_text, images: imgs, upload_date: upload_date, creator_email: creator, last_editor_email: creator}) 

        await noticia.save()

        res.status(201).json({ok: true, mensagem:'Noticia criada com sucesso.'})
    }catch(err){
        console.log(err)
        res.status(403).json({ok: false, mensagem: 'Erro ao criar noticia.'})
    }
})

module.exports = router