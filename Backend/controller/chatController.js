const User = require("../models/userModel")

module.exports.userList = async (req,res) => {
    let userlist = await User.find()
    let newuserlist = [];
    userlist.map(({ userName, profilePic }) => newuserlist.push({ userName, profilePic }));
    res.send(newuserlist);
}