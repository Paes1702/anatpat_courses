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
  return file.findOne({ _id: fileId })
}

//obj: { filter object, setValues object }
async function updateFile(db, filter, changeObj) {
  const files = await getCollection(db)

  return files.updateOne(filter, changeObj)
}

async function getPendingFiles(db) {

  const files = await getCollection(db)

  return files.aggregate([
    {
      $match: {
        'metadata.status': 'pending'
      }
    },
    {
      $addFields: {
        userObjectId: {
          $toObjectId: '$metadata.userId'
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userObjectId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' }
  ]).toArray()
}

module.exports = {
    createGridBucket,
    findVouchersByUserId,
    findVoucherById,
    updateFile,
    getPendingFiles
}