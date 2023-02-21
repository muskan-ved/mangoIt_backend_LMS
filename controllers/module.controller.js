const db = require('../models/index.model')
const jsonwebtoken = require('jsonwebtoken')

const Module = db.Module

exports.createModule = async (req, res) => {
    const {
        title,
        description,
        course_id,
    } = req.body

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, 'this_is_seceret')
    const user_id = decode.id

    try {
        moduleCreated = await Module.create({
            title: title,
            description: description,
            course_id: course_id,
            user_id: user_id,
        })
        res.status(201).json(moduleCreated)
    }

    catch (e) {
        res.status(400).send(e)
    }

}

exports.updateModule = async (req, res) => {
    const {
        title,
        description,
        course_id,
    } = req.body

    const moduleId = req.params.id

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, 'this_is_seceret')
    const user_id = decode.id

    try {
        moduleUpdate = await Module.update({
            title: title,
            description: description,
            course_id: course_id,
            user_id: user_id,
        },{ where: { id: moduleId } })

        const updatedModule = await Module.findOne({ where: { id: moduleId } })
        res.status(201).json(updatedModule)
    }

    catch (e) {
        res.status(400).send(e)
    }
}


exports.deleteModule = async (req, res) => {
    const moduleId = req.params.id


    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, 'this_is_seceret')
    const deletedBy = decode.id

    try {
        findModule = await Module.findOne({ where: { id: moduleId } })
        if (findModule) {
            const isDeleted = await Module.update({ isDeleted: true, deletedBy: deletedBy }, { where: { id: moduleId } })
            const moduleDeleted = await Module.findOne({ where: { id: moduleId } })
            res.status(201).send(moduleDeleted)
        }

        if(!findModule){
            res.status(404).json('No module awailable!')
        }
    }
    catch (e) {
        res.status(400).send(e)
    }

}

