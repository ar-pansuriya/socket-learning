const User = require("../models/userModel");
const MessageAdd = require("../models/messageModel");
const Group = require('../models/groupModel');



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
        let list = await Group.insertMany({ name, member:memberIds, owner:userId._id, profilePic, createdAt });
        res.send({message:'Group created'});
    } catch (error) {
        console.error(error.message);
    }
}



module.exports.getGroupList = async(req,res)=>{
    let list = await Group.find().populate('owner').populate('member');
    res.send(list);
}