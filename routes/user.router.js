const express = require('express')
const { updateUser, registration, loginUser }= require('../controllers/user.controller')
const { webProtection } = require('../helper/auth')
const router = express.Router()

router.post('/registration', webProtection, registration)
router.post('/loginuser', loginUser)
router.put('/updateuser/:id', webProtection , updateUser)

module.exports = router