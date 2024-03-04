const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    sender: { type: String, required: true },
    to: { type: String, required: true },
    createdAt:{type:String,default:new Date()},
});


const MessageAdd = mongoose.model('MessageAdd', messageSchema);

module.exports = MessageAdd;