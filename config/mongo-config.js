const { MongoClient } = require("mongodb")

const uri = process.env.MONGO_URI

let db
let dbName = process.env.MONGO_DB_NAME

async function mongoConnect() {
  if (db) return db // se já estiver conectado, retorna a conexão

  try {
    const client = new MongoClient(uri)

    await client.connect()

    db = client.db(dbName)
    return db

  } catch (error) {
    console.error(' Erro ao conectar ao MongoDB:', error)
    process.exit(1)
  }
}

module.exports = mongoConnect