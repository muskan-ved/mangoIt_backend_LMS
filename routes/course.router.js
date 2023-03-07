const express = require('express')
const { createCourse,updateCourse, deleteCourse } = require('../controllers/course.controller')
const {webProtection} = require('../helper/auth')
const router = express.Router()
const {upload} = require('../helper/upload')

router.post('/createcourse', webProtection, upload.single("audio_video_trailer") , createCourse)
router.put('/updatecourse/:id', webProtection, upload.single("audio_video_trailer") , updateCourse)
router.delete('/deletecourse/:id', webProtection ,deleteCourse)


module.exports = router