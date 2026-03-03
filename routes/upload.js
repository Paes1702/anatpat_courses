const express = require('express')
const multer = require('multer')
const mongoFiles = require('../models/Files')

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

// 📤 Upload do comprovante
router.post('/upload', upload.single('payment_voucher'), async (req, res) => {
  try {
    if (!req.file) {
      return res.render('home-page', { error: 'Nenhum comprovante foi enviado.' })
    }
    const db = req.app.locals.db

    const bucket = await mongoFiles.createGridBucket(db)

    const userFiles = await mongoFiles.findVouchersByUserId(db, req.session.userId)
    
    // Procurar se o usuário já tem comprovantes aprovados
    if (userFiles.find(file => 
      file.metadata?.status === 'approved'
    )){
      return res.render('home-page', { error: 'Um comprovante enviado por este usuário já foi aprovado.' })
    }

    // Procurar pendente e deletar
    const pendingFile = userFiles.find(file => 
      file.metadata?.status === 'pending'
    )

    if (pendingFile) {
      await bucket.delete(pendingFile._id)
    }

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: {
        userId: req.session.userId,
        uploadedAt: new Date(),
        status: 'pending'
      }
    })

    uploadStream.end(req.file.buffer)

    uploadStream.on('finish', () => {
      return res.render('home-page', { success: 'Comprovante enviado com sucesso!' })
    })

    uploadStream.on('error', (err) => {
      return res.render('home-page', { error: 'Erro no upload do comprovante.' })
    })

  } catch (err) {
    return res.render('home-page', { error: 'Erro no upload do comprovante.' })
  }
})

module.exports = router