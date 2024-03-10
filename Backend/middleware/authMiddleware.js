const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config()
}

module.exports.authMiddleware = async (req, res, next) => {
  try {
    let { jwtrefresh, jwtaccess } = req.cookies;
    if (!jwtaccess) return res.send("/api/auth/refresh");
    if (!jwtrefresh) return res.redirect("/api/auth/login");
    const user = jwt.verify(jwtaccess, process.env.SECRET_KEY);
    if (!user) return res.send({ message: "invalid refresh token" });
    const bodyuser = await User.find({ userName: user.userName });
    req.user = bodyuser;
    next();
  } catch (err) {
    console.error(err.message);
  }
};