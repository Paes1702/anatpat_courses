const express = require('express')
const router = express.Router()
const mongo = require('../models/Users')

// Rota para a homepage
router.get('/login', (req, res) => {
  res.render('login-page')
})

router.post('/login', async (req, res) => {

    obj = req.body

    let user = await mongo.findUser(req.app.locals.db, {
        cpf: obj.cpf,
        password: obj.password
    })

    if (user) {
        req.session.userId = user._id.toString()
        req.session.user = {
            nome: user.nome,
            cpf: user.cpf
        }
        if (user.isAdmin) {
            res.redirect('/admin')    
        } else {
            res.redirect('/homepage')
        }
    } else {
        res.render('login-page', { error: 'Usuário ou senha incorretos!' })
    }
})

module.exports = router