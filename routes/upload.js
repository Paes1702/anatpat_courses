const express = require('express')
const multer = require('multer')
const mongo = require('../models/Upload')

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

// 📤 Upload do comprovante
router.post('/upload', upload.single('payment_voucher'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('Nenhum arquivo enviado')
    }

    const bucket = await mongo.createGridBucket(req.app.locals.db)

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: {
        userId: req.session.userId,
        uploadedAt: new Date()
      }
    })

    uploadStream.end(req.file.buffer)

    uploadStream.on('finish', () => {
      res.redirect('/homepage')
    })

  } catch (err) {
    console.error(err)
    res.status(500).send('Erro no upload')
  }
})

module.exports = router