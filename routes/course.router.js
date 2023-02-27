const express = require('express')
const { createCourse,updateCourse, deleteCourse } = require('../controllers/course.controller')
const {webProtection} = require('../helper/auth')
const router = express.Router()

router.post('/createcourse', webProtection, createCourse)
router.put('/updatecourse/:id', webProtection, updateCourse)
router.delete('/deletecourse/:id', webProtection ,deleteCourse)


module.exports = router