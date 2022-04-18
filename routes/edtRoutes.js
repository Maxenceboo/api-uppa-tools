const express = require('express');
const router = express.Router();

const edtRoutes = require('../controllers/ical.js')


router.get('/get/edt/:ressource', edtRoutes.edt)

module.exports = router;
