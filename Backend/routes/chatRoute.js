const express = require('express');
const { userList, postMessage, getMessage } = require('../controller/chatController');
const router = express.Router();



router.get('/userslist', userList);
router.post('/message', postMessage);
router.get('/message', getMessage);



module.exports = router