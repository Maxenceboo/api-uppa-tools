const express = require('express'); // Import express
const router = express.Router();    // Create an instance of express

const edtRoutes = require('../controllers/ical.js') // Import edtRoutes


router.get('/get/edt/:ressource', edtRoutes.edt)    // Get all users 

module.exports = router;    // Export router
