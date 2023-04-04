const express = require('express')
const {upload} = require('../helper/upload')
const { getUsers,getUserById, getUsersBySearch, updateUser, registration, loginUser,deleteUser, resetPassword ,sendGmail}= require('../controllers/user.controller')
const { webProtection } = require('../helper/auth')
const router = express.Router()

router.get('/getusers',webProtection, getUsers)
router.get('/getuser/:id',webProtection, getUserById)
router.get('/getuserbysearch',webProtection, getUsersBySearch)
router.post('/registration', webProtection, registration)
router.post('/loginuser', webProtection ,loginUser)
router.put('/updateuser/:id', webProtection , upload.single("profile_pic") , updateUser)
router.delete('/deleteuser/:id',webProtection, deleteUser)

router.post('/resetpassword', webProtection, resetPassword)

router.post('/sendgmail', webProtection, upload.single("attachment"), sendGmail)

module.exports = router