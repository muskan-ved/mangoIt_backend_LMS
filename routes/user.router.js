const express = require('express')
const { updateUser, registration, loginUser,deleteUser }= require('../controllers/user.controller')
const { webProtection } = require('../helper/auth')
const router = express.Router()

router.post('/registration', webProtection, registration)
router.post('/loginuser', webProtection ,loginUser)
router.put('/updateuser/:id', webProtection , updateUser)
router.delete('/deleteuser/:id',webProtection, deleteUser)

module.exports = router