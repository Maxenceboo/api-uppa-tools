const express = require('express');
const router = express.Router();

const authController = require("../controllers/authController");
const check_auth = require('../middleware/check-auth');


router.post("/signup", authController.signup);
router.post("/signin", authController.signin);

module.exports = router;
