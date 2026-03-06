const express = require('express')
const router = express.Router()
const mongo = require('../models/Users')
const bcrypt = require("bcrypt");

// Rota para a homepage
router.get('/login', (req, res) => {
  return res.render('login-page')
})

router.post('/login', async (req, res) => {

    obj = req.body

    const user = await mongo.findUser(req.app.locals.db, {
        cpf: obj.cpf
    })

    if (!user) {
        return res.render('login-page', { error: 'Usuário ou senha incorretos!' })
    }

    const senhaValida = await bcrypt.compare(obj.password, user.password);

    if (!senhaValida) {
        return res.render('login-page', { error: 'Usuário ou senha incorretos!' });
    }

    if (user) {
        req.session.userId = user._id.toString()
        req.session.user = {
            nome: user.nome,
            cpf: user.cpf,
            approved: user.approved
        }
        if (user.isAdmin) {
            return res.redirect('/admin')    
        } else if (user.approved){
            return res.redirect('/homepage/curso')
        } else {
            return res.redirect('/homepage')
        }
    } 
})

module.exports = router