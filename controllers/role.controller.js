const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()

exports.getAuthToken = (req,res) =>{
    const token = jsonwebtoken.sign({}, process.env.SIGNING_KEY, {expiresIn: "48h"})
    res.status(200).json({authToken:token})
}