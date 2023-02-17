const express = require('express')
const { createCourse, deleteCourse } = require('../controllers/course.controller')
const {webProtection} = require('../helper/auth')
const router = express.Router()

router.post('/createcourse', webProtection, createCourse)
router.delete('/deletecourse/:id', webProtection ,deleteCourse)

module.exports = router