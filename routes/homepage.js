const express = require('express')
const router = express.Router()
const path = require("path")

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

router.get('/homepage/curso', async (req, res) => {

  const courseStart = new Date(process.env.COURSE_START_DATE)
  const courseEnd = new Date(process.env.COURSE_END_DATE)
  const now = new Date()

  if (req.session.user.approved){
    if (now >= courseStart && now <= courseEnd) {
      return res.redirect('/curso/index.html')
    } else {
      return res.render('course-standby-page', { startDay: courseStart })
    }
  } else {
    return res.redirect('/homepage')
  }
})

module.exports = router