const path = require('path')
const db = require('../models/index.model')
const Session = db.Session



exports.createSession = async(req, res) => {
    const {
        title,
        description,
        module_id,
    } = req.body

    const uploads = path.join(__dirname, '../uploads')

    try {
        const sessionCreated = await Session.create({
            title: title,
            description: description,
            module_id: module_id, 
            uploads : uploads
        })
        res.status(201).send(sessionCreated)
    }
 catch (e){
    res.status(400).send(e)
 }

}
