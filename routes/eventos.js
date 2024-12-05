const express = require('express')
const router = express.Router()

const Evento = require('../schemas/Evento')

const upload = require('../helpers/middleware/multer')

const checkTokens = require('../helpers/middleware/auth')

const fs = require('fs')
const path = require('path')

router.get('/', async (req, res) => {
    try{
        const data = await Evento.aggregate([{ $sort: {last_update_date: -1 }}])

        const evento_edit = req.query.evento_edit ? await Evento.findById(req.query.evento_edit) : undefined

        res.render('Eventos', { data, evento_edit})
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
        const evento = await Evento.findById(req.params.id)

        var paragrafos = evento.evento_text.split('\n')

        res.render('eventoGenerico', { evento, paragrafos })
    }catch(err){
        console.log(`Erro: ${err}`)
    }

})

router.get('/edit/:id', async(req, res) => {
    let slug = req.params.id
    res.redirect(`/eventos/?evento_edit=${slug}`)
})

router.post('/delete/:id', checkTokens, async (req, res)=>{
    if(!req.user.isFunc){
        return res.status(403).json({ok: false, mensagem: 'Usuário não autorizado'})
    }

    const eventoId = req.params.id
    try{
        const evento = await Evento.findById(eventoId)

        console.log(evento.images)

        evento.images.forEach(imgPath => {

            const filePath = path.resolve(__dirname, '..', 'public', imgPath)

            fs.unlink(filePath, (err) => {
                if(err){
                    console.error(`Erro ao deletar imagem!\nfile path: ${filePath}`, err)
                }else{
                    console.log(`Imagem deltada com sucesso.\nfile path: ${filePath}`)
                }
            })
        })

        await Evento.findByIdAndDelete(eventoId)
        
        res.status(200).json({ok: true, mensagem: 'Evento deletada com sucesso.'})
    }catch(err){
        console.error(err)
        res.status(403).json({ok: false, mensagem: 'Erro ao deletar evento.'})
    }
})

router.post('/update/:id', checkTokens, upload, async (req, res)=>{
    if(!req.user.isFunc){
        return res.status(403).json({ok: false, mensagem: 'Usuário não autorizado'})
    }

    const eventoId = req.params.id
    const titulo = req.body.title
    const evento_text = req.body.evento_text

    const editor_email = req.user.email
    
    try{
        const evento = await Evento.findById(eventoId)

        let creator_email =  evento.creator_email


        let evento_date

        if(req.body.evento_date){
            evento_date = new Date(req.body.evento_date)
            evento_date.setDate(evento_date.getDate() + 1)
        }else{
            evento_date = evento.evento_date
        }

        let delete_old_imgs = false
        let old_images = evento.images
        
        let imgs = []
        
        if(req.files && req.files.length > 0){
            delete_old_imgs = true
            imgs = req.files.map(file => `imgs/uploads/${file.filename}`)
        }else{
            imgs = old_images
        }

        await Evento.findByIdAndUpdate(eventoId, {title: titulo, evento_text: evento_text, images: imgs, evento_date: evento_date, creator_email: creator_email, last_editor_email: editor_email}, {
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

        res.status(200).json({ok: true, mensagem: 'Evento atualizada com sucesso.'})

    }catch(err){
        console.log(err)
        res.status(403).json({ok: false, mensagem: 'Erro ao atualizar evento.'})
    }
})

router.post('/upload', checkTokens, upload, async (req, res)=>{
    if(!req.user.isFunc){
        return res.status(403).json({ok: false, mensagem: 'Usuário não autorizado'})
    }

    try{
        const titulo = req.body.title
        const evento_text = req.body.evento_text
        const imgs = req.files.map(file => `imgs/uploads/${file.filename}`)
        const creator = req.user.email

        let evento_date = Date.now()

        if(req.body.evento_date){
            evento_date = new Date(req.body.evento_date)
            evento_date.setDate(evento_date.getDate() + 1)
        }

        const evento = new Evento({title: titulo, evento_text: evento_text, images: imgs, evento_date: evento_date, creator_email: creator, last_editor_email: creator}) 

        await evento.save()

        res.status(201).json({ok: true, mensagem:'Evento criada com sucesso.'})
    }catch(err){
        console.log(err)
        res.status(403).json({ok: false, mensagem: 'Erro ao criar evento.'})
    }
})

module.exports = router