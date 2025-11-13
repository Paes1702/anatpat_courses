
async function getCollection(db) {
  return db.collection('users')
}

// 🔍 Buscar usuário por e-mail
async function findUser(db, searchObj) {
  const users = await getCollection(db)
  return users.findOne(searchObj)
}

// ➕ Inserir novo usuário
async function insertUser(db, userData) {
  const users = await getCollection(db)
  return users.insertOne(userData)
}

module.exports = {
  findUser,
  insertUser
}