const User = require("../models/userModel");
const MessageAdd = require("../models/messageModel");
const Group = require('../models/groupModel');
const GroupMessage = require("../models/groupMessagesModel");



module.exports.addGroup = async (req, res) => {
    try {
        let { name, member, owner } = req.body;
        let userId = await User.findOne({ userName: owner });
        // Create an array of memberIds from usernames
        let memberIds = [];
        for (const memberUsername of member) {
            let memberUser = await User.findOne({ userName: memberUsername });
            if (memberUser) {
                memberIds.push(memberUser._id);
            }
        }
        let profilePic = `https://avatar.iran.liara.run/username?username=${name[0]}+A`
        let createdAt = new Date();
        let list = await Group.insertMany({ name, member: memberIds, owner: userId._id, profilePic, createdAt });
        let group = await Group.findOne({_id:list[0]._id}).populate({path:'member',select:'userName'});
        res.send({ message: 'Group created',group})
    } catch (error) {
        console.error(error.message);
    }
}

module.exports.getGroupList = async (req, res) => {
    let list = await Group.find().populate('owner').populate('member');
    res.send(list);
};



module.exports.postGroupMessages = async (req, res) => {
    try {
        let { sender, Id, message } = req.body;
        // let group = await Group.findOne({_id:Id});
        let senderUser = await User.findOne({ userName: sender });
        await GroupMessage.insertMany({ groupId: Id, sender: senderUser._id, text: message });
        let group = await Group.findOne({_id:Id}).populate({path:'member',select:'userName'});
        res.send({ message: "done",group });
    } catch (error) {
        console.error(error.message)
    }
}

module.exports.getAllGroupMessages = async (req, res) => {
    let { id } = req.params;
    try {
        let messages = await GroupMessage.find({ groupId: id }).populate('sender', 'userName');
        res.send(messages)
    } catch (error) {
        console.error(error.message)
    }
}