const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const secretKey = "A!B@C#D$E%F";

module.exports.authMiddleware = async(req, res, next) => {
  try {
    let { jwtrefresh, jwtaccess } = req.cookies;
    if (!jwtaccess) return res.send("/api/auth/refresh");
    if (!jwtrefresh) return res.redirect("/api/auth/login");
    const user = jwt.verify(jwtaccess, secretKey);
    if (!user) return res.send({ message: "invalid refresh token" });
    const bodyuser = await User.find({userName:user.userName});
    req.user = bodyuser;
    next();
  } catch (err) {
    console.error(err.message);
  }
};