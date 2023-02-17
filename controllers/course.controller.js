const db = require('../models/index.model')
const jsonwebtoken = require('jsonwebtoken')
const Course = db.Course
const Module = db.Module
// const Session = db.Session

exports.createCourse = async (req, res) => {
    const {
        title,
        description,
        isVisible,
        isChargeable } = req.body

    const token = req.headers.authorization.split(" ")[1]
    const decode = jsonwebtoken.verify(token, 'this_is_seceret')
    const user_id = decode.id

    try {
        courseCreated = await Course.create({
            title: title,
            description: description,
            isVisible: isVisible,
            isChargeable: isChargeable,
            user_id: user_id,
        })

        res.status(201).json(courseCreated)

    } catch (e) {
        res.status(400).send(e)
    }

}

exports.deleteCourse = async (req, res) => {
    const courseId = req.params.id

    const token = req.headers.authorization.split(" ")[1]
    const decode = jsonwebtoken.verify(token, 'this_is_seceret')
    const deletedBy = decode.id

    try {
        findCourse = await Course.findOne({ where: { id: courseId } })
        if (findCourse) {
            const isDeleted = await Course.update({ isDeleted: true, deletedBy: deletedBy }, { where: { id: courseId } })
            const courseDeleted = await Course.findOne({ where: { id: courseId } })
            const moduleDelete = await Module.update({ isDeleted: true, deletedBy: deletedBy }, { where: { id: courseId } })
            const findModuleDeleted = await Module.findOne({ where: { id: courseId } })
            const moduleDeletedId = findModuleDeleted.id
            const sessionDeleted = await Session.update({ isDeleted: true, deletedBy: deletedBy }, { where: { id: moduleDeletedId } })
            res.send(sessionDeleted)
            res.status(200).json({
                courseDeleted: courseDeleted,
                moduleDelete : findModuleDeleted})
        }

        if (!findCourse) {
            res.status(404).json('This course not available')
        }
    }
    catch (e) {
        res.status(400).send(e)
    }

}