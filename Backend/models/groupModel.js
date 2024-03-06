const mongoose = require('mongoose');
const User = require('./userModel');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: User },
    member: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
    createdAt: { type: String, default: new Date() },
    profilePic: { type: String, required: true }
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;


// https://avatar.iran.liara.run/username?username=Scott+Wilson