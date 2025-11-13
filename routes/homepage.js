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

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router