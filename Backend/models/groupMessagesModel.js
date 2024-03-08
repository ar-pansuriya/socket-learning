const mongoose = require('mongoose');
const User = require('./userModel');
const Group = require('./groupModel');

const groupMessagesSchema = new mongoose.Schema({
    groupId:{type:mongoose.Schema.Types.ObjectId,ref:Group,required:true},
    sender:{type:mongoose.Schema.Types.ObjectId,ref:User},
    text:{type:String,required:true},
});


const GroupMessage = mongoose.model('GroupMessage',groupMessagesSchema);

module.exports = GroupMessage;