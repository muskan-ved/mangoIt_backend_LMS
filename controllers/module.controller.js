const db = require('../models/index.model')
const Module = db.Module

exports.createModule = async(req,res) => {
    const {
        title,
        description,
        course_id,
    } = req.body

    try{
        moduleCreated = await Module.create({
            title: title,
            description: description,
            course_id: course_id
        })
        res.status(201).json(moduleCreated)
    }

    catch(e){
        res.status(400).send(e)
    }

}