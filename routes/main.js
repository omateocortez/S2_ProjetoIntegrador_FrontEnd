const express = require('express')
const router = express.Router()

const Proj = require('../schemas/Projeto')

router.get('/', async (req, res) => {
    const data = await Proj.aggregate([{ $sort: {date: -1 }}, { $limit: 3 }])
    res.render('Home', { data })
})

router.get('/Home', (req, res) => {
    res.redirect('/')
})

router.get('/NossaHistoria', (req, res) => {
    res.render('NossaHistoria')
})

router.get('/pick', (req, res) => {
    res.render('pick')
})

router.get('/loginFunc', (req, res) => {
    res.render('loginFunc')
})

router.get('/loginMem', (req, res) => {
    res.render('loginMem')
})

router.get('/ImpacTransp', (req, res) => {
    res.render('ImpacTransp')
})

router.get('/FAQ', (req, res) => {
    res.render('FAQ')
})


module.exports = router