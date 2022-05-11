const express = require('express')
const { requireSignIn, hasRole, temp, validateUser } = require('../controllers/authController')
const router = express.Router()

router.post('/profile', validateUser , temp)

module.exports = router