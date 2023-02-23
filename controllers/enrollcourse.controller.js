const db = require('../models/index.model')
const jsonwebtoken = require('jsonwebtoken')
const Enrollcourse = db.Enrollcourse
const User = db.User


exports.createEnrollCourse = async (req, res) => {
    const {
        user_id,
        course_id,
        course_type,
        created_by,
    } = req.body

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, 'this_is_seceret')
    const login_user = decode.id

    try {

        findLoginUser = await User.findOne({ where: { id: login_user } })

        if (!(findLoginUser.role_id == 1)) {
            const enrollCourse = await Enrollcourse.create({
                user_id: login_user,
                course_id: course_id,
                course_type: course_type
            })
            res.status(201).json(enrollCourse)
        }

        if (findLoginUser.role_id == 1) {
            const enrollCourse = await Enrollcourse.create({
                user_id: user_id,
                course_id: course_id,
                course_type: course_type,
                created_by: login_user
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
    } = req.body

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, 'this_is_seceret')
    const updated_by = decode.id

    const enrollCourseUpdate = await Enrollcourse.update({
        user_id: user_id,
        course_id: course_id,
        course_type: course_type,
        updated_by: updated_by
    }, { where: { id: enrollCourseId } })

    const newUpdatedEnrollCourse = await Enrollcourse.findOne({ where: { id: enrollCourseId } })
    res.status(201).json(newUpdatedEnrollCourse)

}

exports.deleteEnrollCourse = async (req, res) => {
    const enrollCourseId = req.params.id

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, 'this_is_seceret')
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