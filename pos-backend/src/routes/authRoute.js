const express = require('express')
const { userSignUp, userSignIn, requireSignIn } = require('../controllers/authController')

const router = express.Router()

router.post('/signin', userSignIn)
router.post('/signup', userSignUp)

module.exports = router;