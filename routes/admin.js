const express = require('express')
const router = express.Router()
const mongoUsers = require('../models/Users')
const mongoUploads = require('../models/Upload')
const { ObjectId } = require('mongodb')

//Middleware para validar permissão de administrador
async function isAdmin(req, res, next) {
    
    if (!req.session.user) return res.sendStatus(401)

    const user = await mongoUsers.findUser(req.app.locals.db, { _id: new ObjectId(req.session.userId) })

    if (!user.isAdmin) {
        return res.sendStatus(403)
    }

  next()
}

router.get('/admin', isAdmin, (req, res) => {
  res.render('admin-main-page', {
    result: null,
    error: null
  })
})

router.post('/admin/search', isAdmin, async (req, res) => {
  const cpf = req.body.cpf
  const db = req.app.locals.db

  const user = await mongoUsers.findUser(db, { cpf })

  if (!user) {
    return res.render('admin-search-page', {
      result: null,
      error: 'Usuário não encontrado'
    })
  }

  const voucher = await mongoUploads.findVoucherByUserId(db, user._id.toString())

  if (!voucher) {
    return res.render('admin-search-page', {
      result: null,
      error: 'Usuário ainda não enviou comprovante'
    })
  }

  res.render('admin-search-page', {
    result: {
      nome: user.nome,
      cpf: user.cpf,
      fileId: voucher.fileId
    },
    error: null
  })
})

router.get('/admin/pending', isAdmin, async (req, res) => {
  const db = req.app.locals.db

  const pendentes = await db.collection('uploads').aggregate([
    { $match: { status: 'pending' } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' }
  ]).toArray()

  res.render('admin/pending', { pendentes })
})

router.post('/admin/approve', isAdmin, async (req, res) => {
  const db = req.app.locals.db
  const { uploadId, userId } = req.body

  await db.collection('uploads').updateOne(
    { _id: new ObjectId(uploadId) },
    { $set: { status: 'approved' } }
  )

  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { $set: { approved: true } }
  )

  res.redirect('/admin/pending')
})

router.get('/admin/promote', isAdmin, (req, res) => {
  res.render('admin/promote', { error: null, success: null })
})

router.post('/admin/promote', isAdmin, async (req, res) => {
  const db = req.app.locals.db
  const { cpf } = req.body

  const result = await db.collection('users').updateOne(
    { cpf },
    { $set: { isAdmin: true } }
  )

  if (!result.matchedCount) {
    return res.render('admin/promote', { error: 'Usuário não encontrado', success: null })
  }

  res.render('admin/promote', { error: null, success: 'Usuário promovido a administrador' })
})

module.exports = router