const express = require('express')
const router = express.Router()
const mongoUsers = require('../models/Users')
const certificateConfig = require('../curso/config_certificado.json')
const { isAdmin } = require('../util/middleware')
const { ObjectId } = require('mongodb')

// Rota: admin visualiza certificado de qualquer usuário pelo CPF ou ID
router.get('/admin/certificate/:userId', isAdmin, async (req, res) => {
  const db = req.app.locals.db
  const userId = req.params.userId

  try {
    const user = await mongoUsers.findUser(db, { _id: new ObjectId(userId) })

    if (!user) {
      return res.status(404).send('Usuário não encontrado.')
    }

    const courseStart = new Date(process.env.COURSE_START_DATE)
    const courseEnd = new Date(process.env.COURSE_END_DATE)

    let certConfig = certificateConfig

    certConfig.dataInicio = courseStart.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long"
    })

    certConfig.dataFim = courseEnd.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long"
    })

    certConfig.dataEmissao = new Date().toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "numeric",
      month: "long"
    })

    return res.render('certificate-template', { user, certConfig })
  } catch (err) {
    return res.status(500).send('Erro ao gerar certificado.')
  }
})

// Rota: usuário logado acessa seu próprio certificado
router.get('/certificate', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }

  const db = req.app.locals.db

  try {
    const user = await mongoUsers.findUser(db, { _id: new ObjectId(req.session.userId) })

    if (!user || !user.approved) {
      return res.redirect('/homepage')
    }

    // Verifica se o curso já encerrou (só libera certificado após o fim)
    const courseEnd = new Date(process.env.COURSE_END_DATE + "T00:00:00")
    const courseStart = new Date(process.env.COURSE_START_DATE + "T00:00:00")
    const now = new Date()

    let certConfig = certificateConfig

    certConfig.dataInicio = courseStart.toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "numeric",
      month: "long"
    })

    certConfig.dataFim = courseEnd.toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "numeric",
      month: "long"
    })

    certConfig.dataEmissao = new Date().toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "numeric",
      month: "long"
    })

    if (now < courseEnd) {
      return res.status(403).send('O certificado estará disponível ao término do curso.')
    }

    return res.render('certificate-template', { user, certConfig })
  } catch (err) {
    return res.status(500).send('Erro ao gerar certificado.')
  }
})

module.exports = router