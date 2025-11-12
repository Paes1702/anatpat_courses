const { MongoClient } = require("mongodb");

async function mongoConnect() {
  // Replace the uri string with your connection string
  const uri = 'mongodb://localhost:27017/';
  const client = new MongoClient(uri);
  try {
    const database = client.db('anatpatdb');
    const movies = database.collection('users');
    // Queries for a movie that has a title value of 'Back to the Future'
    const query = { nome: 'Gabriel' };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    await client.close();
  }
}

module.exports = mongoConnect