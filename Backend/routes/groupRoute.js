const express=  require('express');
const { addGroup, getGroupList, postGroupMessages, getAllGroupMessages } = require('../controller/groupController');
const router = express.Router();



router.post('/group',addGroup);
router.get('/group',getGroupList);
router.post('/group/message',postGroupMessages);
router.get('/group/message/:id',getAllGroupMessages);




module.exports = router;