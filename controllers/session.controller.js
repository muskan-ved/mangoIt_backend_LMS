const db = require('../models/index.model')
const jsonwebtoken = require('jsonwebtoken')

const Session = db.Session

exports.createSession = async (req, res) => {
    const {
        title,
        description,
        module_id,
    } = req.body

    const uploads = req.file.path

    try {
        const sessionCreated = await Session.create({
            title: title,
            description: description,
            module_id: module_id,
            uploads: uploads
        })
        res.status(201).send(sessionCreated)
    }
    catch (e) {
        res.status(400).send(e)
    }

}

exports.deleteSession = async (req, res) => {
    const sessionId = req.params.id

    const token = req.headers.authorization.split(" ")[1]
    const decode = jsonwebtoken.verify(token, 'this_is_seceret')
    const deletedBy = decode.id
    try {
        const findSession = await Session.findOne({ where: { id: sessionId } })
        if (findSession) {
            const isDeleted = await Session.update({ isDeleted: true, deletedBy: deletedBy }, { where: { id: sessionId } })
            const sessionDeleted = await Session.findOne({ where: { id: sessionId } })
            res.status(201).send(sessionDeleted)
        }

        if (!findSession) {
            res.status(404).json('No session awailable!')
        }
    }
    catch (e) {
        res.status(400).json(e)
    }

}
