const db = require('../models/index.model')
const Enrollcourse = db.Enrollcourse

exports.createEnrollCourse = async(req,res)=>{
    const {
        user_id,
        course_id,
        course_type,
        created_by,
    } = req.body

    const createEnroll = await Enrollcourse.create({

    })
}