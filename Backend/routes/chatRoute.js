const express = require('express');
const { userList } = require('../controller/chatController');
const router  = express.Router();



router.get('/userslist',userList);



module.exports= router