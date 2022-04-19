const express = require('express'); // Import express
const router = express.Router();    // Create an instance of express

const authController = require("../controllers/authController");    // Import authController 
const check_auth = require('../middleware/check-auth'); // Import check_auth middleware 


router.post("/signup", authController.signup);  // Signup a user
router.post("/signin", authController.signin);  // Signin a user 

module.exports = router;    // Export router
