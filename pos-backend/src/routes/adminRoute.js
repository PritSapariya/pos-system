const express = require('express')
const {temp, validateAdmin } = require('../controllers/authController')
const router = express.Router()

router.post('/profile', validateAdmin , temp)

module.exports = router