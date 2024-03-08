const express=  require('express');
const { addGroup, getGroupList, postGroupMessages, getAllGroupMessages, deleteGroup } = require('../controller/groupController');
const router = express.Router();



router.post('/group',addGroup);
router.get('/group',getGroupList);
router.post('/group/message',postGroupMessages);
router.get('/group/message/:id',getAllGroupMessages);
router.delete('/group/:id',deleteGroup);


module.exports = router;