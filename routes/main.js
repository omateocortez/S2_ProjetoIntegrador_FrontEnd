const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('Home');
})

router.get('/Home', (req, res) => {
    res.redirect('/');
})

router.get('/NossaHistoria', (req, res) => {
    res.render('NossaHistoria');
})

router.get('/pick', (req, res) => {
    res.render('pick');
})

router.get('/loginFunc', (req, res) => {
    res.render('loginFunc');
})

router.get('/loginMem', (req, res) => {
    res.render('loginMem');
})

router.get('/ImpacTransp', (req, res) => {
    res.render('ImpacTransp');
})

router.get('/FAQ', (req, res) => {
    res.render('FAQ');
})


module.exports = router