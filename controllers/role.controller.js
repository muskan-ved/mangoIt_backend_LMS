const jsonwebtoken = require('jsonwebtoken')

exports.getAuthToken = (req,res) =>{
    const token = jsonwebtoken.sign({}, 'this_is_seceret', {expiresIn: "24h"})
    res.status(200).json({authToken:token})
}