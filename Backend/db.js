// getting-started.js
const mongoose = require('mongoose');


async function connectDB() {
  await mongoose.connect('mongodb://127.0.0.1:27017/socket')
  .then(()=>console.log('db is working'))
  .catch((er)=>console.error(er.message));
};


module.exports  = connectDB;