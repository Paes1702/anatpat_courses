const express = require('express')
const router = express.Router()

router.get('/homepage', (req, res) => {
    if(!req.session.user) {
        res.render('login-page', { error: "Você precisa estar logado para acessar esta página" })
    } else {
        res.render('home-page')
    }
})

router.post('/homepage/logout', (req, res) => {
  const bp = res.locals.basePath
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Erro ao sair')
    }
    res.clearCookie('connect.sid')
    res.redirect(bp + '/login')
  })
})

router.get('/homepage/curso', async (req, res) => {
  const bp = res.locals.basePath

  if(!req.session.user) {
    return res.render('login-page', { error: "Você precisa estar logado para acessar esta página" })
  }

  const courseStart = new Date(process.env.COURSE_START_DATE + "T00:00:00-03:00")
  const courseEnd = new Date(process.env.COURSE_END_DATE + "T00:00:00-03:00")
  const now = new Date()

  if (req.session.user.approved){
    if (now >= courseStart && now <= courseEnd) {
      return res.redirect(bp + '/curso/index.html')
    } if (now > courseEnd) {
      return res.render('course-end-certificate')
    } else {
      return res.render('course-standby-page', { startDay: courseStart })
    }
  } else {
    return res.redirect(bp + '/homepage')
  }
})

module.exports = router
