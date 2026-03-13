const express = require('express')
const router = express.Router()
const mongoUsers = require('../models/Users')
const certConfig = require('../curso/config_certificado.json')
const { isAdmin } = require('../util/middleware')
const { ObjectId } = require('mongodb')

// Rota: admin visualiza certificado de qualquer usuário pelo CPF ou ID
// GET /admin/certificate/:userId
router.get('/admin/certificate/:userId', isAdmin, async (req, res) => {
  const db = req.app.locals.db
  const userId = req.params.userId

  try {
    const user = await mongoUsers.findUser(db, { _id: new ObjectId(userId) })

    if (!user) {
      return res.status(404).send('Usuário não encontrado.')
    }

    return res.render('certificate-template', { user, certConfig })
  } catch (err) {
    console.error('Erro ao gerar certificado:', err)
    return res.status(500).send('Erro ao gerar certificado.')
  }
})

// Rota: usuário logado acessa seu próprio certificado
// GET /certificate
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
    const courseEnd = new Date(process.env.COURSE_END_DATE)
    const now = new Date()

    if (now < courseEnd) {
      return res.status(403).send('O certificado estará disponível ao término do curso.')
    }

    return res.render('certificate-template', { user, certConfig })
  } catch (err) {
    console.error('Erro ao gerar certificado:', err)
    return res.status(500).send('Erro ao gerar certificado.')
  }
})

module.exports = router
module.exports.certConfig = certConfig // exporta para uso em outros arquivos se necessário
