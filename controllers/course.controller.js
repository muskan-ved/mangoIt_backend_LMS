const db = require('../models/index.model')
const Course = db.Course

exports.createCourse = async (req, res) => {
    const {
        title,
        description,
        isVisible,
        isChargeable,
        user_id } = req.body
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