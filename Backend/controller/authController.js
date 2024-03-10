const User = require("../models/userModel");
const saltRound = 15;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

module.exports.PostSignup = async (req, res) => {
    let { fullName, userName, password, gender } = req.body;
    try {
        const profilePic = `https://avatar.iran.liara.run/public/${gender === 'male' ? 'boy' : 'girl'}?username=${userName}`
        const user = await User.find({ userName });
        console.log(user.length);
        if (user.length !== 0) return res.send({ message: 'User Already Exist' });
        const hashPassword = await bcrypt.hash(password, saltRound);
        const newuser = User.insertMany({ fullName, userName, password: hashPassword, gender, profilePic });
        res.send({ message: 'account created' });
    } catch (error) {
        console.error(error.message);
    }
};

module.exports.PostLogin = async (req, res) => {
    let { userName, password } = req.body;
    try {
        const users = await User.find({ userName });
        if (users.length === 0) return res.send({ message: 'User Not Exist' });
        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        console.log(match);
        if (!match) return res.send({ message: 'Password Is Invalid' });
        const accessToken = jwt.sign({ userName, password }, process.env.SECRET_KEY, { expiresIn: '10min' });
        const refreshToken = jwt.sign({ userName, password }, process.env.SECRET_KEY, { expiresIn: '2d' });
        res.cookie('LoginUser', userName, { httpOnly: false, maxAge: 2 * 24 * 60 * 60 * 1000 });
        res.cookie('jwtrefresh', refreshToken, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 });
        res.cookie('jwtaccess', accessToken, { httpOnly: false, maxAge: 10 * 60 * 1000 });
        res.send({ message: 'login successful' });
    } catch (error) {
        console.error(error.message)
    }
}


module.exports.Logout = async (req, res) => {
    try {
        const refresh = req.cookies.jwtrefresh
        const access = req.cookies.jwtaccess
        res.cookie('jwtrefresh', refresh, { maxAge: 0 });
        res.cookie('jwtaccess', access, { maxAge: 0 });
        res.send({ message: 'success' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};




module.exports.RefreshToken = (req, res) => {
    let { jwtrefresh, jwtaccess } = req.cookies
    try {
        if (!jwtrefresh) return res.send({ message: 'refresh token not found' })
        let user = jwt.verify(jwtrefresh, process.env.SECRET_KEY);
        const { userName, password } = user;
        console.log(userName, password);
        if (!user) return res.send({ message: 'Refresh token not valid' });
        const accessToken = jwt.sign({ userName, password }, process.env.SECRET_KEY, { expiresIn: '10min' });
        console.log(accessToken);
        res.cookie('jwtaccess', accessToken, { httpOnly: false, maxAge: 10 * 60 * 1000 });
        res.send({ accessToken: 'success' });
    } catch (err) {
        console.error(err.message);
    }
}



