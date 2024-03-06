const express=  require('express');
const { addGroup, getGroupList } = require('../controller/groupController');
const router = express.Router();



router.post('/group',addGroup);
router.get('/group',getGroupList);


module.exports = router;