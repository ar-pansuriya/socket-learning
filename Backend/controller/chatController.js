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
        let { message, sender, to, createdAt } = req.body;
        await MessageAdd.insertMany({ text: message, sender, to, createdAt });
        res.send({ message: "done" });
    };

module.exports.getMessage = async (req, res) => {
    try {
        let sender = req.cookies.LoginUser;
        let to = req.query.user;
        let page = req.query.page
        let limit = 15;
        let skip = (page - 1) * limit;

        // Include the last two messages from the previous page
        if (page > 1) {
            skip = skip - 3; // Adjust the skip value to include the last two messages from the previous page
            limit = limit + 3; // Increase the limit to fetch the additional two messages
        }

        let chats = await MessageAdd.find({
            $or: [
                { sender: sender, to: to },
                { sender: to, to: sender },
            ],
        }).skip(skip).limit(limit);
        res.send(chats);
    } catch (error) {
        console.error(error.message)
    }
};
