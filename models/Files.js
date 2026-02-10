const { GridFSBucket } = require('mongodb')

async function getCollection(db) {
  return db.collection('vouchers.files')
}

async function createGridBucket(db) {
    return new GridFSBucket(db, { bucketName: 'vouchers' })
}

async function findVouchersByUserId(db, userId) {

    const files = await getCollection(db)

    return files
    .find({
      'metadata.userId': userId
    })
    .sort({ uploadDate: -1 }) // mais recente primeiro
    .toArray()
}

async function findVoucherById(db, fileId) {

  const file = await getCollection(db)
  return file
  .findOne({ _id: fileId })
}

module.exports = {
    createGridBucket,
    findVouchersByUserId,
    findVoucherById
}