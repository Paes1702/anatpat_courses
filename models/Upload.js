const { GridFSBucket } = require('mongodb')

// async function getCollection(db) {
//   return db.collection('payment_vouchers')
// }

async function createGridBucket(db) {
    return new GridFSBucket(db, { bucketName: 'vouchers' })
}

module.exports = {
    createGridBucket
}