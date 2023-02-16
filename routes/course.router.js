const express = require('express')
const { createCourse } = require('../controllers/course.controller')
const router = express.Router()

router.post('/createcourse',createCourse)

module.exports = router