const db = require('../models/index.model')
require('dotenv').config()
const jsonwebtoken = require('jsonwebtoken')
const Enrollcourse = db.Enrollcourse
const User = db.User


exports.createEnrollCourse = async (req, res) => {
    const {
        user_id,
        course_id,
        course_type,
        view_history
    } = req.body

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
    const login_user = decode.id

    // if(view_history == 0){
        
    // }

    try {

        findLoginUser = await User.findOne({ where: { id: login_user } })

        if (!(findLoginUser.role_id == 1)) {  //learner user
            const enrollCourse = await Enrollcourse.create({
                user_id: login_user,
                course_id: course_id,
                course_type: course_type,
                created_by: login_user,
                view_history:view_history
            })
            res.status(201).json(enrollCourse)
        }

        if (findLoginUser.role_id == 1) {   // admin user
            const enrollCourse = await Enrollcourse.create({
                user_id: user_id,
                course_id: course_id,
                course_type: course_type,
                created_by: login_user,
                view_history:view_history
            })
            res.status(201).json(enrollCourse)
        }
    }
    catch (e) {
        res.status(400).json(e)
    }
}

exports.updateEnrollCourse = async (req, res) => {
    const enrollCourseId = req.params.id

    const {
        user_id,
        course_id,
        course_type,
        view_history
    } = req.body

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
    const updated_by = decode.id

    const enrollCourseUpdate = await Enrollcourse.update({
        user_id: user_id,
        course_id: course_id,
        course_type: course_type,
        view_history:view_history,
        updated_by: updated_by
    }, { where: { id: enrollCourseId } })

    const newUpdatedEnrollCourse = await Enrollcourse.findOne({ where: { id: enrollCourseId } })
    res.status(201).json(newUpdatedEnrollCourse)

}

exports.deleteEnrollCourse = async (req, res) => {
    const enrollCourseId = req.params.id

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
    const deleted_by = decode.id

    try {
        const enrollCourseDelete = await Enrollcourse.update({
            is_deleted: true,
            deleted_by: deleted_by
        }, { where: { id: enrollCourseId } })

        const enrollCourseDeleted = await Enrollcourse.findOne({ where: { id: enrollCourseId } })
        res.status(201).json(enrollCourseDeleted)
    }
    catch (e) {
        res.status(400).json(e)
    }

}