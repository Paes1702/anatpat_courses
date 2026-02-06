const express = require('express')
const router = express.Router()

// Rota para a homepage
router.get('/homepage', (req, res) => {

    if(!req.session.user) {
        res.render('login-page', { error: "Você precisa estar logado para acessar esta página" })
    } else {
        res.render('home-page')
    }

})

router.post('/homepage/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Erro ao sair')
    }

    res.clearCookie('connect.sid')
    res.redirect('/login')
  })
})

module.exports = router