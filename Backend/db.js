// getting-started.js
const mongoose = require('mongoose');
const mongoUrl = process.env.ATLASDB_URL

async function connectDB() {
  await mongoose.connect(mongoUrl)
    .then(() => console.log('db is working'))
    .catch((er) => console.error(er.message));
};


module.exports = connectDB;