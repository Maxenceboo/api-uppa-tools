const express = require('express'); // Import express
const router = express.Router();    // Create an instance of express

const userController = require('../controllers/userController');    // Import userController
const check_auth = require('../middleware/check-auth'); // Import check_auth middleware 

router.get('/', userController.getAll); // Get all users 
router.get('/get/:id', userController.getOne);  // Get one user 
router.get('/test', check_auth, userController.getAll); // Get all users 
router.post("/upDate", check_auth ,userController.upDate); // Update one user 


module.exports = router;    // Export router
