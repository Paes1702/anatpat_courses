const express = require('express')
const router = express.Router()
const mongoFiles = require('../models/Files')
const { ObjectId } = require('mongodb')

router.get('/download/:id', async (req, res) => {
  const db = req.app.locals.db
  const bucket = await mongoFiles.createGridBucket(db)

  const fileId = new ObjectId(req.params.id)

  const file = await mongoFiles.findVoucherById(db, fileId)

  if (!file) {
    return res.status(404).send('Arquivo não encontrado')
  }

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${file.filename}"`
  )
  res.setHeader('Content-Type', file.contentType || 'application/octet-stream')

  bucket.openDownloadStream(fileId).pipe(res)
})

module.exports = router