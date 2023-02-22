const express = require('express')
const {webProtection} = require('../helper/auth')
const { createEnrollCourse } = require('../controllers/enrollcourse.controller')
const router = express.Router()

router.post('/createenrollcourse',webProtection , createEnrollCourse)

module.exports = router