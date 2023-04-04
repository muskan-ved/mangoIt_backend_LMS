const express = require('express')
const {upload} = require('../helper/upload')
const { updateUser, registration, loginUser,deleteUser, resetPassword ,sendGmail}= require('../controllers/user.controller')
const { webProtection } = require('../helper/auth')
const router = express.Router()

router.post('/registration', webProtection, upload.single("profile_pic") ,registration)
router.post('/loginuser', webProtection ,loginUser)
router.put('/updateuser/:id', webProtection , updateUser)
router.delete('/deleteuser/:id',webProtection, deleteUser)

router.post('/resetpassword', webProtection, resetPassword)


router.post('/sendgmail', webProtection, upload.single("attachment"), sendGmail)

module.exports = router