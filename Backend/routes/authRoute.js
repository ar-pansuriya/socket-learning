const express = require('express');
const { PostSignup, PostLogin, RefreshToken, Logout } = require('../controller/authController');
const router = express.Router();

router.post('/signup',PostSignup);
router.post('/login',PostLogin);
router.get('/refresh',RefreshToken);
router.get('/logout',Logout);



module.exports = router;