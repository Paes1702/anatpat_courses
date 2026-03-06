const express = require('express')
const router = express.Router()
const mongoUsers = require('../models/Users')
const mongoFiles = require('../models/Files')
const { sendApprovalEmail } = require('../config/nodemailer-config');
const { isAdmin } = require('../util/middleware')
const { ObjectId } = require('mongodb')

router.get('/admin', isAdmin, (req, res) => {
  return res.render('admin-main-page', {
    result: null,
    error: null
  })
})

router.get('/admin/search', isAdmin, (req, res) => {
  return res.render('admin-search-page', {
    result: null,
    error: null
  })
})

router.post('/admin/search', isAdmin, async (req, res) => {
  const cpf = req.body.cpf
  const db = req.app.locals.db

  const user = await mongoUsers.findUser(db, { cpf: cpf })

  if (!user) {
    return res.render('admin-search-page', {
      result: null,
      error: 'Usuário não encontrado.'
    })
  }

  const voucher = await mongoFiles.findVouchersByUserId(db, user._id.toString())

  if (!voucher || voucher.length == 0) {
    return res.render('admin-search-page', {
      result: null,
      error: 'Usuário ainda não enviou comprovante.'
    })
  } else {
    return res.render('admin-search-page', {
      result: {
        nome: user.nome,
        cpf: user.cpf,
        fileId: voucher[0]._id
      },
      error: null
    })
  }
})

router.get('/admin/pending', isAdmin, async (req, res) => {
  const db = req.app.locals.db

  const pendingFiles = await mongoFiles.getPendingFiles(db)

  res.render('admin-approve-page', { pendingFiles: pendingFiles, error: null })
})

router.post('/admin/approve', isAdmin, async (req, res) => {
  const db = req.app.locals.db
  const { fileId, userId } = req.query
  let filter = {}
  let changeObj = {}

  const pendingFiles = await mongoFiles.getPendingFiles(db)

  filter = { _id: new ObjectId(fileId) }
  changeObj = { $set: { 'metadata.status': 'approved' } }
  let result = await mongoFiles.updateFile(db, filter, changeObj)
  if (!result.matchedCount) {
    return res.render('admin-approve-page', { pendingFiles: pendingFiles, error: 'Arquivo à ser alterado não encontrado.' })
  }

  
  filter = { _id: new ObjectId(userId) }
  changeObj = { $set: { approved: true } }
  const user = await mongoUsers.findUser(db, filter)
  result = await mongoUsers.updateUser(db, filter, changeObj)
  if (!result.matchedCount) {
    return res.render('admin-approve-page', { pendingFiles: pendingFiles, error: 'Usuário relacionado ao arquivo não encontrado.' })
  } else {
    sendApprovalEmail(user).catch(err => {
      console.error("Erro ao enviar email:", err);
    });
    return res.redirect('/admin/pending')
    // return res.render('admin-approve-page', { pendingFiles: pendingFiles, error: null })
  }
})

router.get('/admin/promote', isAdmin, (req, res) => {
  return res.render('admin-promote-page', { error: null, user: null })
})

router.post('/admin/promote/user/:userId', isAdmin, async (req, res) => {
  const db = req.app.locals.db
  const userId = req.params.userId.toString()
  const filter = { _id: new ObjectId(userId) }

  const result = await mongoUsers.updateUser(db, filter, {$set: { isAdmin: true }})  

  if (!result.matchedCount) {
    return res.render('admin-promote-page', { user: null, error: 'Usuário não encontrado' })
  } else {
    return res.render('admin-promote-page', { user:null, error: null })
  }
})

router.post('/admin/promote/search', isAdmin, async (req, res) => {
  const { cpf } = req.body
  const db = req.app.locals.db

  const user = await mongoUsers.findUser(db, { cpf: cpf })
  if (!user) {
    return res.render('admin-promote-page', { user: null, error: 'O usuário não foi encontrado' })
  } else {
    return res.render('admin-promote-page', { user: user, error: null })
  }

})

router.get('/admin/view/:id', isAdmin,async (req, res) => {
  const db = req.app.locals.db
  const bucket = await mongoFiles.createGridBucket(db)

  const pendingFiles = await mongoFiles.getPendingFiles(db)

  const fileId = req.params.id.toString()

  const file = await mongoFiles.findVoucherById(db, new ObjectId(fileId))
  if (!file) {
    return res.render('admin-approve-page', { pendingFiles: pendingFiles, error: 'Arquivo não encontrado' })
  }

  res.setHeader('Content-Type', file.contentType || 'application/octet-stream')

  bucket.openDownloadStream(new ObjectId(fileId)).pipe(res)
})


module.exports = router