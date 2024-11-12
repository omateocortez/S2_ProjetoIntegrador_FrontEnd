const express = require('express')
const router = express.Router()

const Proj = require('../schemas/Projeto')

const upload = require('../config/multer')

const fs = require('fs')
const path = require('path')

const jwt = require('jsonwebtoken')

const checkPerm = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.body.token

    console.log("Token recebido!")

    if (!token) {
        return res.status(403).json({ message: 'Erro ao receber token' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado' })
        }

        if (decoded.isFunc !== true) {
            return res.status(403).json({ message: 'Usuário não é funcionário.' })
        }

        req.user = decoded
        next()
    })
}

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


router.get('/edit/:id', async(req, res) => {
    let slug = req.params.id
    res.redirect(`/projetos/?proj_edit=${slug}`)
})

router.post('/delete/:id', checkPerm, async (req, res)=>{
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
        res.status(500).json({ok: false, mensagem: 'Erro ao deletar projeto.'})
    }
})

router.post('/update/:id', checkPerm, upload, async (req, res)=>{
    const projectId = req.params.id
    const titulo = req.body.title
    const descr = req.body.desc

    const editor_email = req.user.email
    
    try{
        let creator_email =  Proj.findById(projectId).creator_email

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

        await Proj.findByIdAndUpdate(projectId, {title: titulo, desc: descr, images: imgs, date: proj_date, creator_email: creator_email, last_editor_email: editor_email}, {
            new: true,
            runValidators: true
        }) 

        res.status(200).json({ok: true, mensagem: 'Projeto atualizado com sucesso.'})

    }catch(err){
        console.log(err)
        res.status(500).json({ok: false, mensagem: 'Erro ao atualizar projeto.'})
    }
})

router.post('/upload', checkPerm, upload, async (req, res)=>{
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

        await projeto.save()

        res.status(201).json({ok: true, mensagem:'Projeto criado com sucesso.'})
    }catch{
        res.status(500).json({ok: false, mensagem: 'Erro ao criar projeto.'})
    }
})

module.exports = router