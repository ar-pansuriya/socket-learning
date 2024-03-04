const User = require("../models/userModel");
const MessageAdd = require("../models/messageModel");



module.exports.userList = async (req, res) => {
    let userlist = await User.find();
    let newuserlist = [];
    userlist.map(({ userName, profilePic }) =>
        newuserlist.push({ userName, profilePic })
    );
    res.send(newuserlist);
},

    module.exports.postMessage = async (req, res) => {
        let { message, sender, to,createdAt } = req.body;
        await MessageAdd.insertMany({ text: message, sender, to,createdAt });
        res.send({ message: "done" });
    };

module.exports.getMessage = async (req, res) => {
    let sender = req.cookies.LoginUser;
    let to = req.params.to;
    let chats = await MessageAdd.find({
        $or: [
            { sender: sender, to: to },
            { sender: to, to: sender },
        ],
    });
    res.send(chats);
};
