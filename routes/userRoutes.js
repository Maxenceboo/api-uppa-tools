const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const check_auth = require('../middleware/check-auth');

router.get('/', userController.getAll);
router.get('/get/:id', userController.getOne);
router.get('/test', check_auth, userController.getAll);
router.post("/upDate", check_auth ,userController.upDate);


module.exports = router;
